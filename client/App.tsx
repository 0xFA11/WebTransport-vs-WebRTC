import { Separator } from "#client/ui/separator.tsx";
import { Button } from "#client/ui/button.tsx";
import { Bubble, BubbleContent, BubbleGroup } from "#client/ui/bubble.tsx";
import { Message, MessageContent } from "#client/ui/message.tsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "#client/ui/card.tsx";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "#client/ui/chart.tsx";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { EarthIcon, TrendingUpIcon } from "lucide-react";

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

export const App = () => {
	return (
		<div className="typeset flex flex-col gap-4">
			<h1>WebTransport vs WebRTC</h1>
			<Separator />
			<div className="flex w-full max-w-sm flex-col gap-6 py-12">
				<Message>
					<MessageContent>
						<Bubble variant="muted">
							<BubbleContent>The build failed during dependency installation.</BubbleContent>
						</Bubble>
					</MessageContent>
				</Message>
				<Message align="end">
					<MessageContent>
						<Bubble>
							<BubbleContent>Can you share the exact error?</BubbleContent>
						</Bubble>
					</MessageContent>
				</Message>
				<Message>
					<MessageContent>
						<BubbleGroup>
							<Bubble variant="muted">
								<BubbleContent>Here&apos;s the error from the logs</BubbleContent>
							</Bubble>
							<Bubble variant="muted">
								<BubbleContent>
									Something went wrong with the build. The libraries are not installed correctly. Try
									running the build again.
								</BubbleContent>
							</Bubble>
						</BubbleGroup>
					</MessageContent>
				</Message>
				<Separator />
				<div className="flex gap-2">
					<Button>
						Hello<span>👋</span>
					</Button>
					<Button variant="outline">
						World
						<EarthIcon />
					</Button>
				</div>
			</div>
			<Card>
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
							}}>
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
								Trending up by 5.2% this month <TrendingUpIcon className="h-4 w-4" />
							</div>
							<div className="text-muted-foreground flex items-center gap-2 leading-none">
								Showing total visitors for the last 6 months
							</div>
						</div>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};
