#!/bin/sh
set -eu
cd "$(dirname "$0")"

CAROOT="$(mkcert -CAROOT)"

openssl req -new -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes \
	-keyout key.pem -subj "/CN=localhost" \
	-addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:::1" |
openssl x509 -req -CA "$CAROOT/rootCA.pem" -CAkey "$CAROOT/rootCA-key.pem" \
	-CAcreateserial -days 14 -copy_extensions copy -out cert.pem

openssl x509 -in cert.pem -noout -subject -enddate
