'use client'

import Image from 'next/image'
import clsx from 'clsx'

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
    <div className="px-1 min-h-screen flex flex-col space-y-2">
      {[...messages].reverse().map((message, index) => {
        const timestamp = new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })

        if (message.isQuestion) {
          return (
            <div
              key={`question-${index}`}
              className="flex flex-col relative space-y-1 p-2 rounded"
            >
              <div className="group flex relative items-center space-x-2 p-2 rounded">
                <Image
                  src={`https://eu.ui-avatars.com/api/?name=${encodeURIComponent(username)}`}
                  alt={`Avatar de ${username}`}
                  width={40}
                  height={40}
                  className="h-8 w-8 lg:h-10 lg:w-10 rounded-full duration-200"
                />
                <p className="break-words">{message.content}</p>

                <span className="hidden absolute right-0 top-0 text-sm p-1 lg:group-hover:flex font-thin text-gray-400">
                  {timestamp}
                </span>
              </div>
            </div>
          )
        }

        return (
          <div
            key={`response-${index}`}
            className={clsx(
              'group flex relative items-start space-x-2 p-2 rounded',
              message.background && 'bg-zinc-100 dark:bg-zinc-800',
              message.classes
            )}
          >
            <Image
              src="/sya_logo.jpg"
              alt="Logo de SYA"
              width={40}
              height={40}
              className="h-8 w-8 lg:h-10 lg:w-10 rounded-full mb-auto duration-200 group-hover:shadow-lg"
              priority
            />

            <div className="break-words">{message.content}</div>

            <span className="hidden absolute right-0 top-0 text-sm p-1 lg:group-hover:flex font-thin text-gray-400">
              {timestamp}
            </span>
          </div>
        )
      })}
    </div>
  )
}
