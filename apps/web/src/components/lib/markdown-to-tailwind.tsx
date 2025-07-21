"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownToTailwind({ children }: { children: string }) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				h1: ({ node, ...props }) => (
					<h1
						className="w-full text-3xl font-bold mt-6 mb-4"
						{...props}
					/>
				),
				h2: ({ node, ...props }) => (
					<h2
						className="w-full text-2xl font-semibold mt-5 mb-3"
						{...props}
					/>
				),
				h3: ({ node, ...props }) => (
					<h3
						className="w-full text-xl font-semibold mt-4 mb-2"
						{...props}
					/>
				),
				p: ({ node, ...props }) => (
					<p
						className="w-full mb-3 leading-relaxed"
						{...props}
					/>
				),
				ul: ({ node, ...props }) => (
					<ul
						className="w-full list-disc pl-6 mb-3"
						{...props}
					/>
				),
				ol: ({ node, ...props }) => (
					<ol
						className="w-full list-decimal pl-6 mb-3"
						{...props}
					/>
				),
				li: ({ node, ...props }) => (
					<li
						className="w-full mb-1"
						{...props}
					/>
				),
				blockquote: ({ node, ...props }) => (
					<blockquote
						className="w-full border-l-4 border-blue-400 pl-4 italic my-4 text-gray-700 dark:text-gray-300"
						{...props}
					/>
				),
				a: ({ node, ...props }) => (
					<a
						className="w-full text-blue-600 underline hover:text-blue-800"
						target="_blank"
						rel="noopener noreferrer"
						{...props}
					/>
				),
				code: ({ node, ...props }) => (
					<code
						className="w-full bg-zinc-200 px-1 rounded text-sm"
						{...props}
					/>
				),
				pre: ({ node, ...props }) => (
					<pre
						className="w-full bg-zinc-800 text-white p-3 rounded mb-4 overflow-x-auto text-sm"
						{...props}
					/>
				),
				table: ({ node, ...props }) => (
					<table
						className="w-full min-w-full border border-zinc-400 my-4 text-left text-sm"
						{...props}
					/>
				),
				thead: ({ node, ...props }) => (
					<thead
						className="w-full bg-zinc-200 dark:bg-zinc-700"
						{...props}
					/>
				),
				tbody: ({ node, ...props }) => <tbody {...props} />,
				tr: ({ node, ...props }) => (
					<tr
						className="w-full border-b border-zinc-300 dark:border-zinc-700"
						{...props}
					/>
				),
				th: ({ node, ...props }) => (
					<th
						className="w-full px-4 py-2 font-semibold border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
						{...props}
					/>
				),
				td: ({ node, ...props }) => (
					<td
						className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700"
						{...props}
					/>
				),
				hr: ({ node, ...props }) => (
					<hr
						className="w-full my-6 border-zinc-300 dark:border-zinc-700"
						{...props}
					/>
				),
				img: ({ node, ...props }) => (
					<img
						className="w-full rounded max-w-full h-auto my-4"
						{...props}
					/>
				),
				strong: ({ node, ...props }) => (
					<strong
						className="w-full font-bold"
						{...props}
					/>
				),
				em: ({ node, ...props }) => (
					<em
						className="w-full italic"
						{...props}
					/>
				),
			}}>
			{children}
		</ReactMarkdown>
	);
}
