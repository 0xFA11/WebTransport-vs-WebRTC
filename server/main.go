package main

import (
	"fmt"
	"io"
	"log/slog"
	"net"
	"net/http"
	"os"

	"github.com/pion/webrtc/v4"
	"github.com/quic-go/quic-go/http3"
	"github.com/quic-go/webtransport-go"
)

func main() {
	httpMux := http.NewServeMux()
	httpMux.Handle("/", http.FileServer(http.Dir("public")))
	httpServer := http.Server{Addr: ":8443", Handler: httpMux}

	wtpMux := http.NewServeMux()
	wtpServer := webtransport.Server{H3: &http3.Server{Addr: ":3443", Handler: wtpMux}}

	rtcSocket, err := net.ListenUDP("udp", &net.UDPAddr{Port: 4443})
	if err != nil {
		slog.Error("cannot listen udp for webrtc", "err", err)
		os.Exit(1)
	}
	rtcSettings := webrtc.SettingEngine{}
	rtcSettings.SetNetworkTypes([]webrtc.NetworkType{
		webrtc.NetworkTypeUDP4,
		webrtc.NetworkTypeUDP6,
	})
	rtcSettings.SetICEUDPMux(webrtc.NewICEUDPMux(nil, rtcSocket))
	rtcAPI := webrtc.NewAPI(webrtc.WithSettingEngine(rtcSettings))

	wtpMux.HandleFunc("CONNECT /webtransport", func(w http.ResponseWriter, r *http.Request) {
		session, err := wtpServer.Upgrade(w, r)
		if err != nil {
			slog.Error("webtransport upgrade failed", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		for {
			data, err := session.ReceiveDatagram(session.Context())
			if err != nil {
				slog.Info("webtransport session closed", "err", err)
				return
			}
			err = session.SendDatagram(data)
			if err != nil {
				slog.Warn("webtransport send failed", "err", err)
			}
		}
	})

	httpMux.HandleFunc("OPTIONS /webrtc", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
		w.Header().Set("Access-Control-Allow-Methods", "POST")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.WriteHeader(http.StatusNoContent)
	})

	httpMux.HandleFunc("POST /webrtc", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))

		offer, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 4096))
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		rtcPeer, err := rtcAPI.NewPeerConnection(webrtc.Configuration{})
		if err != nil {
			slog.Error("cannot create webrtc peer connection", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		rtcPeer.OnDataChannel(func(channel *webrtc.DataChannel) {
			channel.OnMessage(func(msg webrtc.DataChannelMessage) {
				err := channel.Send(msg.Data)
				if err != nil {
					slog.Warn("webrtc send failed", "err", err)
				}
			})
		})
		rtcPeer.OnConnectionStateChange(func(state webrtc.PeerConnectionState) {
			if state == webrtc.PeerConnectionStateFailed || state == webrtc.PeerConnectionStateClosed {
				rtcPeer.Close()
			}
		})

		err = rtcPeer.SetRemoteDescription(webrtc.SessionDescription{
			Type: webrtc.SDPTypeOffer,
			SDP:  string(offer),
		})
		if err != nil {
			rtcPeer.Close()
			slog.Error("cannot set remote description of webrtc peer connection", "err", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		answer, err := rtcPeer.CreateAnswer(nil)
		if err != nil {
			rtcPeer.Close()
			slog.Error("cannot create answer for webrtc peer connection", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		gathered := webrtc.GatheringCompletePromise(rtcPeer)
		err = rtcPeer.SetLocalDescription(answer)
		if err != nil {
			rtcPeer.Close()
			slog.Error("cannot set local description of webrtc peer connection", "err", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		<-gathered

		w.Header().Set("Content-Type", "application/sdp")
		fmt.Fprint(w, rtcPeer.LocalDescription().SDP)
	})

	go func() {
		err := wtpServer.ListenAndServeTLS("cert.pem", "key.pem")
		if err != nil {
			slog.Error("wtpServer cannot ListenAndServeTLS", "err", err)
			os.Exit(1)
		}
	}()

	err = httpServer.ListenAndServeTLS("cert.pem", "key.pem")
	if err != nil {
		slog.Error("httpServer cannot ListenAndServeTLS", "err", err)
		os.Exit(1)
	}
}
