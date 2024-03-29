'use client';
import { AssistantComponent } from '@/components/ui/Assistant';
import React, { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import useCommunicationManager from '../hooks/useCommunicationManager';
import {TaskComponent} from '@/components/ui/TaskManager';

export default function AssistantPage() {
  const [topicMessage, setTopicMessage] = useState('');
  const { onAiCommunication, onUserCommunication } = useCommunicationManager();

  useEffect(() => {
    onAiCommunication((c) =>
      Promise.resolve(setTopicMessage((s) => s.concat(`\n iBrain:` + c)))
    );
    onUserCommunication((c) =>
      Promise.resolve(setTopicMessage((s) => s.concat(`\n You:` + c)))
    );
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }} // Initial animation values
        animate={{ opacity: 1, y: 0 }} // Animation states
        exit={{ opacity: 0, y: -20 }} // Animation states
        transition={{ duration: 2 }} // Animation duration
      >
        <AssistantComponent
          key={topicMessage}
          topic={topicMessage}
          active={Boolean(topicMessage?.length > 0)}
        />
        <TaskComponent/>
      </motion.div>
    </>
  );
}
