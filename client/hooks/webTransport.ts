import { useState, useRef, useEffect, useCallback } from "react";
import type { Transport } from "#client/types.ts";

export const useWebTransport = (): Transport => {
	const [state, setState] = useState<"disconnected" | "connecting" | "connected">("disconnected");
	const transportRef = useRef<WebTransport>(null);
	const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array>>(null);
	const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array>>(null);

	const [textEncoder] = useState(() => new TextEncoder());
	const [textDecoder] = useState(() => new TextDecoder());

	const disconnect = useCallback(() => {
		transportRef.current?.close();
		transportRef.current = null;
		writerRef.current = null;
		readerRef.current = null;
		setState("disconnected");
	}, []);

	const connect = useCallback(async () => {
		if (transportRef.current !== null) {
			return;
		}

		try {
			setState("connecting");

			const config = (await (await fetch("/webtransport")).json()) as {
				http3Addr: string;
				certSha256: string;
			};
			const transport = new WebTransport(`https://${location.hostname}${config.http3Addr}/webtransport`, {
				serverCertificateHashes: [
					{
						algorithm: "sha-256",
						value: Uint8Array.fromBase64(config.certSha256),
					},
				],
			});
			transportRef.current = transport;

			transport.closed
				.then((closeInfo) => console.warn("webtransport closed", closeInfo))
				.catch((closeReason) => console.error("webtransport closed", closeReason))
				.finally(() => {
					if (transportRef.current === transport) {
						disconnect();
					}
				});

			await transport.ready;

			const datagrams = transport.datagrams as typeof transport.datagrams & {
				createWritable?: () => WritableStream<Uint8Array>;
			};

			if (datagrams.createWritable) {
				writerRef.current = datagrams.createWritable().getWriter();
			} else {
				writerRef.current = datagrams.writable.getWriter();
			}

			readerRef.current = datagrams.readable.getReader();

			setState("connected");
		} catch (err) {
			disconnect();
			throw err;
		}
	}, [disconnect]);

	const sendBytes = useCallback(async (bytes: Uint8Array): Promise<void> => {
		await writerRef.current?.write(bytes);
		await writerRef.current?.ready;
	}, []);

	const sendText = useCallback(
		(text: string): Promise<void> => sendBytes(textEncoder.encode(text)),
		[sendBytes, textEncoder],
	);

	const recvBytes = useCallback(async (): Promise<Uint8Array | undefined> => {
		const bytes = await readerRef.current?.read();
		return bytes?.value;
	}, []);

	const recvText = useCallback(async (): Promise<string | undefined> => {
		const bytes = await recvBytes();
		return bytes ? textDecoder.decode(bytes) : undefined;
	}, [recvBytes, textDecoder]);

	useEffect(() => disconnect, [disconnect]);

	return { state, connect, disconnect, sendBytes, sendText, recvBytes, recvText };
};
