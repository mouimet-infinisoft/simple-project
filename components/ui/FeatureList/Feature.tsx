// components/Feature.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface Feature {
  title: string;
  description: string;
  Icon?: React.ComponentType<any>; // Type for SVG icon component
}

const Feature: React.FC<Feature> = ({ title, description, Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileInView={{ scale: 1.02, y: 0 }} // Boop animation on scroll
      viewport={{ once: true }} // Trigger animation only once
      className="feature shadow-md rounded-md p-4 flex items-center"
    >
      {Icon && <Icon className="mr-4 h-8 w-8" />}
      <div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

export default Feature;
