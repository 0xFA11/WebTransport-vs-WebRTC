import type { ReactNode } from "react";
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
import { ArrowUpIcon } from "lucide-react";
import { cn } from "#client/ui/utils.ts";

export const Chat = (props: {
	className?: string;
	title: string;
	description: string;
	action: ReactNode;
	messages: string[];
	onSend: (text: string) => void;
}) => {
	return (
		<Card className={cn("gap-0", props.className)}>
			<CardHeader className="border-b">
				<CardTitle>{props.title}</CardTitle>
				<CardDescription>{props.description}</CardDescription>
				<CardAction>{props.action}</CardAction>
			</CardHeader>
			<CardContent className="min-h-0 p-0">
				<MessageScrollerProvider autoScroll={true}>
					<MessageScroller>
						<MessageScrollerViewport>
							<MessageScrollerContent className="p-(--card-spacing)">
								<MessageScrollerItem className="flex">
									<Bubble variant="muted">
										<BubbleContent>The build failed during dependency installation.</BubbleContent>
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
												Something went wrong with the build. The libraries are not installed
												correctly. Try running the build again.
											</BubbleContent>
										</Bubble>
									</BubbleGroup>
								</MessageScrollerItem>
								{props.messages.map((text, index) => (
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
						props.onSend(text);
						form.reset();
					}}>
					<Input name="message" placeholder="Type a message" autoComplete="off" />
					<Button type="submit" size="icon">
						<ArrowUpIcon />
					</Button>
				</form>
			</CardFooter>
		</Card>
	);
};
