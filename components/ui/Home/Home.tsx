'use client';
import React from 'react';
import { FeatureList } from '../FeatureList';
import { Hero } from '../Hero';

const features = [
  {
    title: 'Talk with your data',
    description: 'Easily access and analyze your data through voice commands.'
  },
  {
    title: 'Easy for non-technical users',
    description:
      'No coding required, anyone can interact with data using natural language.'
  },
  {
    title: 'Business at your fingertips',
    description:
      'Get real-time insights and make data-driven decisions on the go.'
  },
  {
    title: 'Instantaneous',
    description: 'Get immediate results to your voice queries without delays.'
  },
  {
    title: 'Easy multi-language',
    description:
      'Interact with your data in multiple languages for broader accessibility.'
  },
  {
    title: 'No learning curve',
    description:
      'Start using the platform instantly, no need for extensive training.'
  },
  {
    title: 'Almost no config',
    description: 'Minimal setup required, get up and running quickly.'
  }
];

const HomeComponent: React.FC<{}> = () => {
  return (
    <div>
      <Hero
        title="Welcome to iBrain Data!"
        subtitle="Discuss by voice with me, I'll help use databases"
        buttonText="Get Started"
        buttonLink="/"
      />

      <FeatureList features={features} />
    </div>
  );
};

export default HomeComponent;
