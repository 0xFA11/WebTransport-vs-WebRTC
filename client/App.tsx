import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { cn } from "#client/ui/utils.ts";
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
	const { isConnected, connect, disconnect } = useWebTransport();
	return (
		<Chat
			className="h-140 flex-1"
			title="WebTransport"
			description={isConnected ? "connected" : "disconnected"}
			action={
				isConnected ? (
					<Button onClick={disconnect}>Disconnect</Button>
				) : (
					<Button onClick={connect}>Connect</Button>
				)
			}
			messages={["hello", "webtransport"]}
			onSend={() => {}}
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

export const App = () => {
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
