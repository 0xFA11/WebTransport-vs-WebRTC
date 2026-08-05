import { useState } from "react";
import { Button } from "#client/ui/button.tsx";
import { Input } from "#client/ui/input.tsx";
import { Bubble, BubbleContent, BubbleGroup } from "#client/ui/bubble.tsx";
import {
	MessageScroller,
	MessageScrollerButton,
	MessageScrollerContent,
	MessageScrollerItem,
	MessageScrollerProvider,
	MessageScrollerViewport,
} from "#client/ui/message-scroller.tsx";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "#client/ui/card.tsx";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "#client/ui/chart.tsx";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ArrowUpIcon, ZapIcon, XIcon } from "lucide-react";

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
	const [messages, setMessages] = useState<string[]>(["hello", "world"]);
	return (
		<div className="typeset flex flex-col gap-4">
			<h1>WebTransport vs WebRTC</h1>
			<div className="flex gap-4">
				<Card className="h-140 flex-1 gap-0">
					<CardHeader className="border-b">
						<CardTitle>WebTransport</CardTitle>
						<CardDescription>Some status message goes here</CardDescription>
						<CardAction>
							<Button>
								<ZapIcon />
								Connect
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent className="min-h-0 p-0">
						<MessageScrollerProvider autoScroll={true}>
							<MessageScroller>
								<MessageScrollerViewport>
									<MessageScrollerContent className="p-(--card-spacing)">
										<MessageScrollerItem className="flex">
											<Bubble variant="muted">
												<BubbleContent>
													The build failed during dependency installation.
												</BubbleContent>
											</Bubble>
										</MessageScrollerItem>
										<MessageScrollerItem className="flex justify-end" scrollAnchor>
											<Bubble>
												<BubbleContent>Can you share the exact error?</BubbleContent>
											</Bubble>
										</MessageScrollerItem>
										<MessageScrollerItem className="flex">
											<BubbleGroup>
												<Bubble variant="muted">
													<BubbleContent>Here&apos;s the error from the logs</BubbleContent>
												</Bubble>
												<Bubble variant="muted">
													<BubbleContent>
														Something went wrong with the build. The libraries are not
														installed correctly. Try running the build again.
													</BubbleContent>
												</Bubble>
											</BubbleGroup>
										</MessageScrollerItem>
										<MessageScrollerItem className="flex">
											<BubbleGroup>
												<Bubble variant="muted">
													<BubbleContent>Here&apos;s the error from the logs</BubbleContent>
												</Bubble>
												<Bubble variant="muted">
													<BubbleContent>
														Something went wrong with the build. The libraries are not
														installed correctly. Try running the build again.
													</BubbleContent>
												</Bubble>
											</BubbleGroup>
										</MessageScrollerItem>
										<MessageScrollerItem className="flex">
											<BubbleGroup>
												<Bubble variant="muted">
													<BubbleContent>Here&apos;s the error from the logs</BubbleContent>
												</Bubble>
												<Bubble variant="muted">
													<BubbleContent>
														Something went wrong with the build. The libraries are not
														installed correctly. Try running the build again.
													</BubbleContent>
												</Bubble>
											</BubbleGroup>
										</MessageScrollerItem>
										{messages.map((text, index) => (
											<MessageScrollerItem key={index} className="flex justify-end">
												<Bubble>
													<BubbleContent>{text}</BubbleContent>
												</Bubble>
											</MessageScrollerItem>
										))}
									</MessageScrollerContent>
								</MessageScrollerViewport>
								<MessageScrollerButton />
							</MessageScroller>
						</MessageScrollerProvider>
					</CardContent>
					<CardFooter>
						<form
							className="flex w-full gap-2"
							onSubmit={(event) => {
								event.preventDefault();
								const form = event.currentTarget;
								const text = new FormData(form).get("message")?.toString().trim();
								if (!text) return;
								setMessages((prev) => [...prev, text]);
								form.reset();
							}}>
							<Input name="message" placeholder="Type a message" autoComplete="off" />
							<Button type="submit" size="icon">
								<ArrowUpIcon />
							</Button>
						</form>
					</CardFooter>
				</Card>
				<Card className="h-140 flex-1 gap-0">
					<CardHeader className="border-b">
						<CardTitle>WebRTC</CardTitle>
						<CardDescription>Some status message goes here</CardDescription>
						<CardAction>
							<Button variant="destructive">
								<XIcon />
								Disconnect
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent className="min-h-0 p-0">
						<MessageScrollerProvider autoScroll={true}>
							<MessageScroller>
								<MessageScrollerViewport>
									<MessageScrollerContent className="p-(--card-spacing)">
										<MessageScrollerItem className="flex">
											<Bubble variant="muted">
												<BubbleContent>
													The build failed during dependency installation.
												</BubbleContent>
											</Bubble>
										</MessageScrollerItem>
										<MessageScrollerItem className="flex justify-end" scrollAnchor>
											<Bubble>
												<BubbleContent>Can you share the exact error?</BubbleContent>
											</Bubble>
										</MessageScrollerItem>
										<MessageScrollerItem className="flex">
											<BubbleGroup>
												<Bubble variant="muted">
													<BubbleContent>Here&apos;s the error from the logs</BubbleContent>
												</Bubble>
												<Bubble variant="muted">
													<BubbleContent>
														Something went wrong with the build. The libraries are not
														installed correctly. Try running the build again.
													</BubbleContent>
												</Bubble>
											</BubbleGroup>
										</MessageScrollerItem>
										<MessageScrollerItem className="flex">
											<BubbleGroup>
												<Bubble variant="muted">
													<BubbleContent>Here&apos;s the error from the logs</BubbleContent>
												</Bubble>
												<Bubble variant="muted">
													<BubbleContent>
														Something went wrong with the build. The libraries are not
														installed correctly. Try running the build again.
													</BubbleContent>
												</Bubble>
											</BubbleGroup>
										</MessageScrollerItem>
										<MessageScrollerItem className="flex">
											<BubbleGroup>
												<Bubble variant="muted">
													<BubbleContent>Here&apos;s the error from the logs</BubbleContent>
												</Bubble>
												<Bubble variant="muted">
													<BubbleContent>
														Something went wrong with the build. The libraries are not
														installed correctly. Try running the build again.
													</BubbleContent>
												</Bubble>
											</BubbleGroup>
										</MessageScrollerItem>
										{messages.map((text, index) => (
											<MessageScrollerItem key={index} className="flex justify-end">
												<Bubble>
													<BubbleContent>{text}</BubbleContent>
												</Bubble>
											</MessageScrollerItem>
										))}
									</MessageScrollerContent>
								</MessageScrollerViewport>
								<MessageScrollerButton />
							</MessageScroller>
						</MessageScrollerProvider>
					</CardContent>
					<CardFooter>
						<form
							className="flex w-full gap-2"
							onSubmit={(event) => {
								event.preventDefault();
								const form = event.currentTarget;
								const text = new FormData(form).get("message")?.toString().trim();
								if (!text) return;
								setMessages((prev) => [...prev, text]);
								form.reset();
							}}>
							<Input name="message" placeholder="Type a message" autoComplete="off" />
							<Button type="submit" size="icon">
								<ArrowUpIcon />
							</Button>
						</form>
					</CardFooter>
				</Card>
			</div>
			<Card className="mx-auto h-140 w-full max-w-2xl">
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
								Trending up by 5.2% this month
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
