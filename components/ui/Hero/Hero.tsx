// components/Hero.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, buttonText, buttonLink }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="hero min-h-screen bg-cover bg-center flex flex-col justify-center items-center px-4 py-8"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-white mb-8"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-lg text-gray-300 mb-12"
      >
        {subtitle}
      </motion.p>
      <motion.a
        href={buttonLink}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        className="inline-block px-6 py-2 text-lg text-white bg-blue-500 hover:bg-blue-600 font-bold rounded-md"
      >
        {buttonText}
      </motion.a>
    </motion.div>
  );
};

export default Hero;
