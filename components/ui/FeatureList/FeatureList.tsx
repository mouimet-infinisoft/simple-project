
import React from 'react';
import Feature from './Feature';

const FeatureList: React.FC<{ features: Feature[] }> = ({ features }) => {
  return (
    <div className="feature-list grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-8 max-w-screen-xl mx-auto">
      {features.map((feature) => (
        <Feature key={feature.title} {...feature} />
      ))}
    </div>
  );
};

export default FeatureList;
