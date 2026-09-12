export type Transport =  {
	state: "disconnected" | "connecting" | "connected";
	connect: () => Promise<void>;
	disconnect: () => void;
	sendBytes: (bytes: Uint8Array) => Promise<void>;
	sendText: (text: string) => Promise<void>;
	recvBytes: () => Promise<Uint8Array | undefined>;
	recvText: () => Promise<string | undefined>;
}
