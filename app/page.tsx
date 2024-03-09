"use client"
import { createBrainstack } from '@brainstack/react';
import { HomeComponent } from '@/components/ui/Home';

export const {
  BrainStackProvider,
  useBrainStack,
  core,
  createEventHandlerMutator,
  createEventHandlerMutatorShallow
} = createBrainstack({
  eventHubOptions: [],
  //@ts-ignore
  stateOptions: {communications:[]},
  loggerOptions: [5]
});



export default function HomePage() {
  return (
    <BrainStackProvider>
      <HomeComponent/>
    </BrainStackProvider>
  );
}
