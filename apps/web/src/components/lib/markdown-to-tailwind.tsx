"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { ReactNode, HTMLAttributes, ImgHTMLAttributes, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";

function filterProps<T extends object>(props: T): T {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const { node, ref, ...rest } = props as any;
  return rest as T;
}

const components: { [key: string]: React.FC<Record<string, never>> } = {
  h1: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="w-full text-3xl font-bold mt-6 mb-4" {...filterProps(props)}>{children}</h1>
  ),
  h2: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="w-full text-2xl font-semibold mt-5 mb-3" {...filterProps(props)}>{children}</h2>
  ),
  h3: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="w-full text-xl font-semibold mt-4 mb-2" {...filterProps(props)}>{children}</h3>
  ),
  p: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLParagraphElement>) => (
    <p className="w-full mb-3 leading-relaxed" {...filterProps(props)}>{children}</p>
  ),
  ul: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLUListElement>) => (
    <ul className="w-full list-disc pl-6 mb-3" {...filterProps(props)}>{children}</ul>
  ),
  ol: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLOListElement>) => (
    <ol className="w-full list-decimal pl-6 mb-3" {...filterProps(props)}>{children}</ol>
  ),
  li: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLLIElement>) => (
    <li className="w-full mb-1" {...filterProps(props)}>{children}</li>
  ),
  blockquote: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLElement>) => (
    <blockquote className="w-full border-l-4 border-blue-400 pl-4 italic my-4 text-gray-700 dark:text-gray-300" {...filterProps(props)}>{children}</blockquote>
  ),
  a: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLAnchorElement>) => (
    <a className="w-full text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer" {...filterProps(props)}>{children}</a>
  ),
  code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: ReactNode } & HTMLAttributes<HTMLElement>) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
        <SyntaxHighlighter
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          style={oneDark as any}
          language={match[1]}
        PreTag="div"
        customStyle={{
          borderRadius: "0.375rem",
          padding: "0.75rem",
          marginBottom: "1rem",
          fontSize: "0.875rem",
        }}
        {...filterProps(props)}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className="w-full bg-zinc-200 dark:bg-zinc-800 px-1 rounded text-sm" {...filterProps(props)}>{children}</code>
    );
  },
  table: ({ children, ...props }: { children?: ReactNode } & TableHTMLAttributes<HTMLTableElement>) => (
    <table className="w-full min-w-full border border-zinc-400 my-4 text-left text-sm" {...filterProps(props)}>{children}</table>
  ),
  thead: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="w-full bg-zinc-200 dark:bg-zinc-700" {...filterProps(props)}>{children}</thead>
  ),
  tbody: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLTableSectionElement>) => <tbody {...filterProps(props)}>{children}</tbody>,
  tr: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="w-full border-b border-zinc-300 dark:border-zinc-700" {...filterProps(props)}>{children}</tr>
  ),
  th: ({ children, ...props }: { children?: ReactNode } & ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
    <th className="w-full px-4 py-2 font-semibold border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800" {...filterProps(props)}>{children}</th>
  ),
  td: ({ children, ...props }: { children?: ReactNode } & TdHTMLAttributes<HTMLTableDataCellElement>) => (
    <td className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700" {...filterProps(props)}>{children}</td>
  ),
  hr: (props: HTMLAttributes<HTMLHRElement>) => (
    <hr className="w-full my-6 border-zinc-300 dark:border-zinc-700" {...filterProps(props)} />
  ),
  img: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt="" className="w-full rounded max-w-full h-auto my-4" {...filterProps(props)} />
  ),
  strong: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLElement>) => (
    <strong className="w-full font-bold" {...filterProps(props)}>{children}</strong>
  ),
  em: ({ children, ...props }: { children?: ReactNode } & HTMLAttributes<HTMLElement>) => (
    <em className="w-full italic" {...filterProps(props)}>{children}</em>
  ),
};

// Patch for ESM/CJS compatibility
export default function MarkdownToTailwind({ children }: { children?: ReactNode }) {
  // Patch for ESM/CJS compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Markdown = (ReactMarkdown as any).default || ReactMarkdown;
  return (
	<Markdown remarkPlugins={[remarkGfm]} components={components}>
	  {children}
	</Markdown>
  );
}
