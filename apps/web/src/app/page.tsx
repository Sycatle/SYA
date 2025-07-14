import Messages from "@web/components/Messages";

export default function Home() {
	return (
		<div className="mx-auto mt-auto max-w-7xl py-16 space-y-8 text-xl">
			<main>
        <Messages 
          username="Charlie"
          messages={[]}
        />
      </main>
		</div>
	);
}
