// components/ToolCard.tsx
import { AbstractTool } from '@/utils/ibrain-assistant/tools/abstraction';
import React from 'react';

interface ToolCardProps {
  tool: AbstractTool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full">
      <h2 className="text-xl text-black font-semibold mb-2">{tool.name}</h2>
      <p className="text-gray-600 mb-4">{tool.description}</p>
    </div>
  );
};

export default ToolCard;
