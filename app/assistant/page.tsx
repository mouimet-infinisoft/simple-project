'use client';
import { AssistantComponent } from '@/components/ui/Assistant';
import React, { useState, useEffect } from 'react';
import { useBrainStack } from '../page';
import Button from '@/components/ui/Button';

export default function AssistantPage() {
  const [today, setToday] = useState(new Date());
  const bstack = useBrainStack();

  // Temporary workaround to rerender on state change
  bstack.useOn(
    'state.changed',
    (e: any) => {
      bstack.log.verbose(`state changed: `, e);
      setToday(new Date());
    },
    []
  );

  return (
    <div>
      <AssistantComponent
        topic={JSON.stringify(bstack.store.getState())}
        active={true}
      />
      <Button
        onClick={() => {
          bstack.store.mutate(() => new Date());
        }}
      >
        test
      </Button>
    </div>
  );
}
