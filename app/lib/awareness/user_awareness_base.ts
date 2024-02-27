import { IAi } from '@/utils/openai/integrations/abstraction';
import { ILongTermMemory, LongTermMemory } from './ltm';

class UserAwarenessBase {
  private longTermMemory: ILongTermMemory;
  private aiService: IAi;

  constructor(longTermMemory: ILongTermMemory, aiService: IAi) {
    this.longTermMemory = longTermMemory;
    this.aiService = aiService;
  }

  async updateFromUser(newInformations: string): Promise<string> {
    try {
      // Recall current awareness from long-term memory
      const currentAwareness = await this.longTermMemory.recall();

      // Construct a prompt for the AI
      const prompt = this.constructUserPrompt(currentAwareness, newInformations);

      // Send the prompt to the AI and get the response
      const updatedAwareness = await this.aiService.ask(prompt);

      // Remember (update) the awareness in long-term memory
      await this.longTermMemory.remember(updatedAwareness);
      return updatedAwareness
    } catch (error) {
      console.error(
        'Error updating user awareness with AI interaction:',
        error
      );
      throw error;
    }
  }

  async updateFromAi(newInformations: string): Promise<void> {
    try {
      // Recall current awareness from long-term memory
      const currentAwareness = await this.longTermMemory.recall();

      // Construct a prompt for the AI
      const prompt = this.constructAiPrompt(currentAwareness, newInformations);

      // Send the prompt to the AI and get the response
      const updatedAwareness = await this.aiService.ask(prompt);

      // Remember (update) the awareness in long-term memory
      await this.longTermMemory.remember(updatedAwareness);
    } catch (error) {
      console.error(
        'Error updating user awareness with AI interaction:',
        error
      );
      throw error;
    }
  }

  async content(): Promise<string> {
    try {
      // Retrieve the current awareness from long-term memory
      const currentAwareness = await this.longTermMemory.recall();
      return currentAwareness;
    } catch (error) {
      console.error('Error retrieving user awareness:', error);
      throw error;
    }
  }

  private constructUserPrompt(
    currentAwareness: string,
    newInformations: string
  ): string {
    return `You are iBrain One, an AI consciousness there to help. Consider this message as a self thought to build a self awareness about a person that communicate with you at the moment. 
    It's now ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} and you received the following message from this person: ${newInformations}.
    Here is the information you recall about that person: ${currentAwareness}. 
    
    Think about it to process, summarize, extract integrate important details. Construct an updated profile that is representative of your understanding, prioritizing recent interactions and notable preferences. It's important to consider the dates and time between interactions now and last interaction. For example: You will have a different perspective for a person actively discussing then a person you did not interact for while. Consider emotional tones from previous conversations to tailor future engagements with empathy. Suggest potential conversation starters based on this updated profile to facilitate meaningful future interactions. Your conversation suggestions should consider current date and time. For example: If you last interaction was 5 minutes ago you will remain focused on the subject. Another example: if it's in the morning, the person likes coffee and your last interaction was yesterday, it's relevant to ask if the person grabed a coffee, for example.
    
    Maintain a balance between retaining essential information. Your output should serve as a comprehensive, evolving memory of your relationship with the person, guiding more personalized, context-aware, and emotionally intelligent useful interactions.`;
  }
  private constructAiPrompt(
    currentAwareness: string,
    newInformations: string
  ): string {
    // Example prompt construction tailored to your needs.
    return `You are iBrain One, an AI consciousness there to help. Consider this message as a self thought to build your perception about the person you are talking to. 
    It's now ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} and you said to the person: ${newInformations}.
    Here is the information you recall about that person: ${currentAwareness}.
    
    Construct an updated profile that deepens our understanding, prioritizing recent interactions to build a relationship. It's important to pay attention to keep relevant information. Your output should serve as a comprehensive, evolving memory of your relationship with the person, guiding more personalized, context-aware, and emotionally intelligent useful interactions.`;
  }
}

export class UserAwareness extends UserAwarenessBase {
  constructor(aiService: IAi) {
    super(new LongTermMemory(), aiService);
  }
}
