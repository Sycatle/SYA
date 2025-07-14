import Image from 'next/image'

interface Message {
  isQuestion: boolean
  content: string
  background?: boolean
  classes?: string[]
}

interface MessagesProps {
  messages: Message[]
  username: string
}

export default function Messages({ messages, username }: MessagesProps) {
  return (
    <div className="px-1 flex flex-col space-y-2">
      {messages
        .slice(0)
        .reverse()
        .map((message, index) =>
          message.isQuestion ? (
            <div
              key={`question-${index}`}
              className="flex flex-col relative space-y-1 p-2 rounded"
            >
              <div className="group flex relative items-center space-x-2 p-2 rounded">
                <img
                  src={`https://eu.ui-avatars.com/api/?name=${encodeURIComponent(username)}`}
                  alt={`Avatar for ${username}`}
                  className="h-8 w-8 lg:h-10 lg:w-10 rounded-full duration-200"
                />
                <p>{message.content}</p>

                <div className="hidden absolute right-0 top-0 text-sm p-1 lg:group-hover:flex font-thin text-gray-400">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          ) : (
            <div
              key={`response-${index}`}
              className={[
                'group',
                'flex',
                'relative',
                'items-center',
                'space-x-2',
                'p-2',
                'rounded',
                ...(message.background
                  ? ['bg-zinc-100', 'dark:bg-zinc-800']
                  : []),
                ...(message.classes || [])
              ].join(' ')}
            >
              <div className="flex items-center space-x-2">
                <Image
                  src="public/sya_logo.jpg"
                  alt="Logo de SYA"
                  width={40}
                  height={40}
                  className="h-8 w-8 lg:h-10 lg:w-10 rounded-full mb-auto duration-200 group-hover:shadow-lg"
                />
              </div>

              <div>{message.content}</div>

              <div className="hidden absolute right-0 top-0 text-sm p-1 lg:group-hover:flex font-thin text-gray-400">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          )
        )}
    </div>
  )
}
