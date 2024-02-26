'use client';

import React, { useMemo } from 'react';
import { ChatMessage } from '@/types/ChatMessage';
import dynamic from 'next/dynamic';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import { Remark } from 'react-remark';
import { DiagramModule } from '@brainstack/diagram';
import remarkRehype from 'remark-rehype';
// import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
// import {unified} from 'unified'

// Dynamically import ReactMarkdown with SSR disabled
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

const MessageComponent = ({ text, role }: ChatMessage) => {
  const messageStyles: Record<string, string> = {
    base: 'rounded-md p-2 mb-2 shadow text-white',
    user: 'bg-blue-600 text-right',
    ibrain: 'bg-green-600 text-left'
  };

  const combinedStyles = `${messageStyles.base} ${messageStyles[role]}`;

  // const file = await unified()
  // .use(remarkParse)
  // .use(remarkGfm)
  // .use(remarkRehype)
  // .use(rehypeStringify)
  // .process('# Hi\n\n*Hello*, world!')

  // console.log(String(file))

  const processText = useMemo(() => {
    console.log(`MessageComponent ProcessText: `, text);
    const plantUmlRegex = /```(?:\n)?@startuml([\s\S]*?)@enduml(?:\n)?```/g;
    return text.replace(plantUmlRegex, (match, p1) => {
      const plantUmlCode = p1.trim(); // Trim the PlantUML code
      const svgUrl = DiagramModule.generate_svg(plantUmlCode); // Generate SVG URL
      return `![PlantUML Diagram](${svgUrl})`; // Return Markdown image syntax
    });
  }, [text]);

  return (
    <ReactMarkdown
      className={combinedStyles}
      remarkPlugins={[remarkParse, remarkRehype, remarkGfm]}
    >
      {processText}
    </ReactMarkdown>
  );
};

export default MessageComponent;
