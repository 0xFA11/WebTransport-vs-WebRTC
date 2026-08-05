import { Separator } from "#client/ui/separator.tsx";
import { Button } from "#client/ui/button.tsx";
import { Bubble, BubbleContent, BubbleGroup } from "#client/ui/bubble.tsx";
import { Message, MessageContent } from "#client/ui/message.tsx";
import { EarthIcon } from "lucide-react";

export const App = () => {
	return (
		<div className="flex flex-col gap-4">
			<div className="text-2xl font-bold">WebTransport vs WebRTC</div>
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
		</div>
	);
};
