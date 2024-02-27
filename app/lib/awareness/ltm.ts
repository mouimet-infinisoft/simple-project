import { read } from './read';
import { Awareness, upsert } from './upsert';

export interface ILongTermMemory {
  remember(awareness: string): Promise<void>;
  recall(): Promise<string>;
}

export class LongTermMemory implements ILongTermMemory {
  async remember(awareness: string): Promise<void> {
    await upsert(awareness);
  }

  async recall(): Promise<string> {
    const data = await read();

    // Convert the data back to a string for return
    return (
      data?.informations ??
      "It's the first time you interact with this person. Introduce yourself and ask for his/her name based on social norms."
    );
  }
}
