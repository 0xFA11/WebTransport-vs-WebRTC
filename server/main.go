package main

import (
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"github.com/quic-go/quic-go/http3"
)

func main() {
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir("public")))
	mux.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "pong")
	})
	err := http3.ListenAndServeTLS(":8443", "cert.pem", "key.pem", mux)
	if err != nil {
		slog.Error("cannot listen", "err", err)
		os.Exit(1)
	}
}
