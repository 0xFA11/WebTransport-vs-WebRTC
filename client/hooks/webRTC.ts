import { useState, useRef, useEffect, useCallback } from "react";
import type { Transport } from "#client/types.ts";

export const useWebRTC = (): Transport => {
	const [state, setState] = useState<"disconnected" | "connecting" | "connected">("disconnected");

	const [textEncoder] = useState(() => new TextEncoder());
	const [textDecoder] = useState(() => new TextDecoder());

	const disconnect = useCallback(() => {
		// todo
	}, []);

	const connect = useCallback(async () => {
		// todo
	}, []);

	const sendBytes = useCallback(async (bytes: Uint8Array): Promise<void> => {
		// todo
	}, []);

	const sendText = useCallback(
		(text: string): Promise<void> => sendBytes(textEncoder.encode(text)),
		[sendBytes, textEncoder],
	);

	const recvBytes = useCallback(async (): Promise<Uint8Array | undefined> => {
		// todo
		return undefined;
	}, []);

	const recvText = useCallback(async (): Promise<string | undefined> => {
		const bytes = await recvBytes();
		return bytes ? textDecoder.decode(bytes) : undefined;
	}, [recvBytes, textDecoder]);

	useEffect(() => disconnect, [disconnect]);

	return { state, connect, disconnect, sendBytes, sendText, recvBytes, recvText };
};
