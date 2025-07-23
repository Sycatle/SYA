"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// Typage compatible pour le composant code

export default function MarkdownToTailwind({ children }: { children: string }) {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				h1: ({ ...props }) => (
					<h1
						className="w-full text-3xl font-bold mt-6 mb-4"
						{...props}
					/>
				),
				h2: ({ ...props }) => (
					<h2
						className="w-full text-2xl font-semibold mt-5 mb-3"
						{...props}
					/>
				),
				h3: ({ ...props }) => (
					<h3
						className="w-full text-xl font-semibold mt-4 mb-2"
						{...props}
					/>
				),
				p: ({ ...props }) => (
					<p
						className="w-full mb-3 leading-relaxed"
						{...props}
					/>
				),
				ul: ({ ...props }) => (
					<ul
						className="w-full list-disc pl-6 mb-3"
						{...props}
					/>
				),
				ol: ({ ...props }) => (
					<ol
						className="w-full list-decimal pl-6 mb-3"
						{...props}
					/>
				),
				li: ({ ...props }) => (
					<li
						className="w-full mb-1"
						{...props}
					/>
				),
				blockquote: ({ ...props }) => (
					<blockquote
						className="w-full border-l-4 border-blue-400 pl-4 italic my-4 text-gray-700 dark:text-gray-300"
						{...props}
					/>
				),
				a: ({ ...props }) => (
					<a
						className="w-full text-blue-600 underline hover:text-blue-800"
						target="_blank"
						rel="noopener noreferrer"
						{...props}
					/>
				),
				code: (props: { inline?: boolean; className?: string; children?: React.ReactNode }) => {
					const { inline, className, children, ...rest } = props;
					const match = /language-(\w+)/.exec(className || "");
					return !inline && match ? (
						<SyntaxHighlighter
							style={oneDark}
							language={match[1]}
							PreTag="div"
							customStyle={{
								borderRadius: "0.375rem",
								padding: "0.75rem",
								marginBottom: "1rem",
								fontSize: "0.875rem",
							}}
							{...rest}>
							{String(children).replace(/\n$/, "")}
						</SyntaxHighlighter>
					) : (
						<code
							className="w-full bg-zinc-200 dark:bg-zinc-800 px-1 rounded text-sm"
							{...rest}>
							{children}
						</code>
					);
				},
				table: ({ ...props }) => (
					<table
						className="w-full min-w-full border border-zinc-400 my-4 text-left text-sm"
						{...props}
					/>
				),
				thead: ({ ...props }) => (
					<thead
						className="w-full bg-zinc-200 dark:bg-zinc-700"
						{...props}
					/>
				),
				tbody: ({ ...props }) => <tbody {...props} />,
				tr: ({ ...props }) => (
					<tr
						className="w-full border-b border-zinc-300 dark:border-zinc-700"
						{...props}
					/>
				),
				th: ({ ...props }) => (
					<th
						className="w-full px-4 py-2 font-semibold border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
						{...props}
					/>
				),
				td: ({ ...props }) => (
					<td
						className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700"
						{...props}
					/>
				),
				hr: ({ ...props }) => (
					<hr
						className="w-full my-6 border-zinc-300 dark:border-zinc-700"
						{...props}
					/>
				),
				img: ({ ...props }) => (
					<img
						className="w-full rounded max-w-full h-auto my-4"
						{...props}
					/>
				),
				strong: ({ ...props }) => (
					<strong
						className="w-full font-bold"
						{...props}
					/>
				),
				em: ({ ...props }) => (
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
