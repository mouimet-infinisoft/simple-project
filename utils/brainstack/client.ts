import { TBrainstackOptions, createBrainstack } from "@brainstack/react"

const options: TBrainstackOptions = {
  eventHubOptions: [],
  loggerOptions: [5]
}
export const {
  BrainStackProvider,
  useBrainStack,
  core,
  getValue,
  createEventHandlerMutator,
  createEventHandlerMutatorShallow,
} = createBrainstack(options);
