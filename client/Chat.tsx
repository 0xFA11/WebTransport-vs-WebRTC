import type { ReactNode } from "react";
import { ArrowUpIcon } from "lucide-react";
import { cn } from "#client/ui/utils.ts";
import { Button } from "#client/ui/button.tsx";
import { Input } from "#client/ui/input.tsx";
import {
	MessageScroller,
	MessageScrollerButton,
	MessageScrollerContent,
	MessageScrollerItem,
	MessageScrollerProvider,
	MessageScrollerViewport,
} from "#client/ui/message-scroller.tsx";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "#client/ui/card.tsx";

export const Chat = (props: {
	className?: string;
	title: string;
	description: string;
	action: ReactNode;
	messages: string[];
	onSend: (message: string) => void;
}) => {
	return (
		<MessageScrollerProvider autoScroll={true}>
			<Card className={cn("gap-0", props.className)}>
				<CardHeader className="gap-1 border-b">
					<CardTitle>{props.title}</CardTitle>
					<CardDescription>{props.description}</CardDescription>
					<CardAction>{props.action}</CardAction>
				</CardHeader>
				<CardContent className="flex-1 overflow-hidden p-0">
					<MessageScroller>
						<MessageScrollerViewport>
							<MessageScrollerContent className="p-(--card-spacing)">
								{props.messages.map((text, index) => (
									<MessageScrollerItem key={index} className="flex justify-end">
										{text}
									</MessageScrollerItem>
								))}
							</MessageScrollerContent>
						</MessageScrollerViewport>
						<MessageScrollerButton />
					</MessageScroller>
				</CardContent>
				<CardFooter>
					<form
						className="flex w-full gap-2"
						onSubmit={(event) => {
							event.preventDefault();
							const form = event.currentTarget;
							const message = new FormData(form).get("message");
							if (typeof message === "string") {
								const text = message.toString().trim();
								if (text.length > 0) {
									props.onSend(message.toString().trim());
								}
							}
							form.reset();
						}}>
						<Input name="message" placeholder="Type a message" autoComplete="off" />
						<Button type="submit" size="icon">
							<ArrowUpIcon />
						</Button>
					</form>
				</CardFooter>
			</Card>
		</MessageScrollerProvider>
	);
};
