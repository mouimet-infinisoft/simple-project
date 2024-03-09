// components/Hero.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  buttonText,
  buttonLink
}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hero min-h-screen bg-cover bg-center flex flex-col justify-center items-center px-4 py-8"
      >
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-start items-center max-w-screen-lg w-full gap-6">
            <motion.p
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold text-center"
            >
              {title}
            </motion.p>
            <motion.p
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl md:text-3xl lg:text-4xl font-medium text-center text-[#ff3bff]"
            >
              {subtitle}
            </motion.p>
            <div className="flex justify-center items-center">
              <img
                src="/image.png"
                className="w-full max-w-[400px] h-auto"
                alt="Hero Image"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Hero;