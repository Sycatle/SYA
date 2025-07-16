import ChatInput from "@web/components/ChatInput";
import Messages from "@web/components/Messages";

export default function Home() {
	return (
		<>
			<Messages
				username="Charlie"
				messages={[]}
			/>
			<ChatInput isDisabled={false} />
		</>
	);
}
