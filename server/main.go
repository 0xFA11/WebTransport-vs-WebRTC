package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/quic-go/quic-go/http3"
	"github.com/quic-go/webtransport-go"
)

func main() {
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir("public")))

	tcpServer := http.Server{Addr: ":8443", Handler: mux}
	udpServer := webtransport.Server{H3: &http3.Server{Addr: ":8443", Handler: mux}}

	mux.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "pong")
	})

	go func() {
		log.Fatal(udpServer.ListenAndServeTLS("cert.pem", "key.pem"))
	}()
	log.Fatal(tcpServer.ListenAndServeTLS("cert.pem", "key.pem"))
}
