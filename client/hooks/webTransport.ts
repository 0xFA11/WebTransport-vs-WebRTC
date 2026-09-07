import { useState, useRef } from "react";

export const useWebTransport = () => {
	const [isConnected, setConnected] = useState(false);
	const transportRef = useRef<WebTransport>(null);
	const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array>>(null);
	const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array>>(null);

	const [textEncoder] = useState(new TextEncoder());
	const [textDecoder] = useState(new TextDecoder());

	const disconnect = () => {
		transportRef.current?.close();
		transportRef.current = null;
		writerRef.current = null;
		readerRef.current = null;
		setConnected(false);
	};

	const connect = async () => {
		if (transportRef.current !== null) {
			return;
		}

		try {
			const config = (await (await fetch("/webtransport")).json()) as { h3Addr: string; certHashBase64: string };
			const transport = new WebTransport(`https://${location.hostname}${config.h3Addr}/webtransport`, {
				serverCertificateHashes: [
					{ algorithm: "sha-256", value: Uint8Array.fromBase64(config.certHashBase64) },
				],
			});
			transportRef.current = transport;
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

			transport.closed
				.then((closeInfo) => console.warn("webtransport closed", closeInfo))
				.catch((closeReason) => console.error("webtransport closed", closeReason))
				.finally(() => {
					if (transportRef.current === transport) {
						disconnect();
					}
				});
			setConnected(true);
		} catch (err) {
			disconnect();
			throw err;
		}
	};

	const sendBytes = async (bytes: Uint8Array): Promise<void> => {
		await writerRef.current?.write(bytes);
		await writerRef.current?.ready;
	};

	const sendText = async (text: string): Promise<void> => {
		await sendBytes(textEncoder.encode(text));
	};

	const recvBytes = async (): Promise<Uint8Array | null> => {
		const bytes = await readerRef.current?.read();
		return bytes?.value ?? null;
	};

	const recvText = async (): Promise<string | null> => {
		const bytes = await recvBytes();
		return bytes === null ? null : textDecoder.decode(bytes);
	};

	return { isConnected, connect, disconnect, sendBytes, sendText, recvBytes, recvText };
};
