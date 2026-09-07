import { useCallback, useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { cn } from "cn";
import { Button } from "#client/ui/button.tsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "#client/ui/card.tsx";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "#client/ui/chart.tsx";
import { Chat } from "#client/Chat.tsx";
import { useWebTransport } from "#client/hooks/webTransport.ts";

const Chart = (props: { className?: string }) => {
	const chartConfig = {
		desktop: {
			label: "Desktop",
			color: "var(--chart-1)",
		},
		mobile: {
			label: "Mobile",
			color: "var(--chart-2)",
		},
	} satisfies ChartConfig;
	const chartData = [
		{ month: "January", desktop: 186, mobile: 80 },
		{ month: "February", desktop: 305, mobile: 200 },
		{ month: "March", desktop: 237, mobile: 120 },
		{ month: "April", desktop: 73, mobile: 190 },
		{ month: "May", desktop: 209, mobile: 130 },
		{ month: "June", desktop: 214, mobile: 140 },
	];
	return (
		<Card className={cn("mx-auto h-140 w-full max-w-2xl", props.className)}>
			<CardHeader>
				<CardTitle>Line Chart - Multiple</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<LineChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<Line
							dataKey="desktop"
							type="monotone"
							stroke="var(--color-desktop)"
							strokeWidth={2}
							dot={false}
						/>
						<Line
							dataKey="mobile"
							type="monotone"
							stroke="var(--color-mobile)"
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
			<CardFooter>
				<div className="flex w-full items-start gap-2 text-sm">
					<div className="grid gap-2">
						<div className="flex items-center gap-2 leading-none font-medium">
							Trending up by 5.2% this month
						</div>
						<div className="text-muted-foreground flex items-center gap-2 leading-none">
							Showing total visitors for the last 6 months
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
};

const WebTransportChat = () => {
	const { state, connect, disconnect, sendText, recvText } = useWebTransport();
	const [messages, setMessages] = useState<string[]>([]);

	useEffect(() => {
		if (state !== "connected") {
			return;
		}
		let isReading = true;
		void (async () => {
			while (isReading) {
				let text: string | null;
				try {
					text = await recvText();
				} catch (err) {
					console.error("webtransport recv failed", err);
					return;
				}
				if (text === null) {
					return;
				}
				if (!isReading) {
					return;
				}
				setMessages((messages) => [...messages, text]);
			}
		})();
		return () => {
			isReading = false;
		};
	}, [state, recvText]);

	const onConnect = useCallback(() => {
		setMessages([]);
		connect().catch((err) => console.error("webtransport connect failed", err));
	}, [connect]);

	const onDisconnect = useCallback(() => {
		setMessages([]);
		disconnect();
	}, [disconnect]);

	const onSend = useCallback(
		(message: string) => {
			sendText(message).catch((err) => console.error("webtransport send failed", err));
		},
		[sendText],
	);

	const action = useMemo(() => {
		switch (state) {
			default:
			case "connecting":
				return <Button disabled={true}>Connecting</Button>;
			case "connected":
				return <Button onClick={onDisconnect}>Disconnect</Button>;
			case "disconnected":
				return <Button onClick={onConnect}>Connect</Button>;
		}
	}, [state, onConnect, onDisconnect]);

	return (
		<Chat
			className="h-140 flex-1"
			title="WebTransport"
			description={state}
			action={action}
			messages={messages}
			onSend={onSend}
		/>
	);
};

const WebRTCChat = () => {
	return (
		<Chat
			className="h-140 flex-1"
			title="WebRTC"
			description="disconnected"
			action={<Button>Connect</Button>}
			messages={["hello", "webrtc"]}
			onSend={() => {}}
		/>
	);
};

const useThemeProvider = () => {
	useEffect(() => {
		const darkMedia = matchMedia("(prefers-color-scheme: dark)");
		const updateTheme = () => document.documentElement.classList.toggle("dark", darkMedia.matches);
		updateTheme();
		darkMedia.addEventListener("change", updateTheme);
		return () => darkMedia.removeEventListener("change", updateTheme);
	}, []);
};

export const App = () => {
	useThemeProvider();
	return (
		<div className="typeset flex flex-col gap-4">
			<h1>WebTransport vs WebRTC</h1>
			<div className="flex gap-4">
				<WebTransportChat />
				<WebRTCChat />
			</div>
			<Chart />
		</div>
	);
};
