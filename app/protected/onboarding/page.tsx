'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useBrainStack } from '@/utils/BrainStackProvider';

export default function OnboardingPage() {
  const bstack = useBrainStack();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 2 }}
      >
        <div className="p-4 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <div className="text-3xl font-bold text-center mb-10">
              Onboarding
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
