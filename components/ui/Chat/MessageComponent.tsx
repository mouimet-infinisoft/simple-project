'use client';

import React, { useMemo } from 'react';
import { ChatMessage } from '@/types/ChatMessage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DiagramModule } from '@brainstack/diagram';

// components/MessageComponent.tsx

const MessageComponent = ({ text, role }: ChatMessage) => {
  const messageStyles: Record<string, string> = {
    base: 'rounded-md p-2 mb-2 shadow text-white',
    user: 'bg-blue-600 text-right',
    ibrain: 'bg-green-600 text-left'
  };

  const combinedStyles = `${messageStyles.base} ${messageStyles[role]}`;

  // Function to replace PlantUML code with the SVG URL
  const processText = useMemo(() => {
    const plantUmlRegex = /@startuml([\s\S]*?)@enduml/g;
    return text.replace(plantUmlRegex, (match, p1) => {
      const plantUmlCode = p1.trim(); // Remove @startuml and @enduml
      const svgUrl = DiagramModule.generate_svg(plantUmlCode);
      return `![PlantUML Diagram](${svgUrl})`; // Markdown image syntax
    });
  }, [text]);

  return (
    <ReactMarkdown className={combinedStyles} remarkPlugins={[remarkGfm]}>
      {processText}
    </ReactMarkdown>
  );
};

export default MessageComponent;
