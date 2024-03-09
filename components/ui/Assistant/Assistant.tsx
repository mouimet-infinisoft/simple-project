import React from 'react';
import { motion } from 'framer-motion';

const AssistantComponent: React.FC<{ topic: string; active: boolean }> = ({
  topic,
  active
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} // Initial animation values
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.9 }} // Animation states
      transition={{ duration: 0.5 }} // Animation duration
      className="discussion-component rounded-lg shadow-md px-8 py-6 flex flex-col items-center justify-center bg-white"
    >
      <h2 className='text-black'>{topic}</h2>
    </motion.div>
  );
};

export default AssistantComponent;
