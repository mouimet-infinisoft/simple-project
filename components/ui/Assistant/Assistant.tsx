import React from 'react';
import { motion } from 'framer-motion';

const AssistantComponent: React.FC<{ topic: string; active: boolean }> = ({
  topic,
  active
}) => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="discussion-component rounded-lg shadow-md px-8 py-6 flex flex-col items-center justify-center bg-white"
    >
      <h2 className="text-2xl text-gray-600  font-bold text-center mb-4">{topic}</h2>
      <p className="text-gray-600 text-center">
        Let's discuss innovative books on Saturday evenings!
      </p>
    </motion.div>
  );
};

export default AssistantComponent;
