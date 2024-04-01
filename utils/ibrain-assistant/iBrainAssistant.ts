'use client';
import { OpenAIAssistant } from '@brainstack/openai-assistantapi';
import { AbstractTool } from './tools/abstraction';
import { core } from '../BrainStackProvider';

export type AiIntegration = 'openai' | 'togetherai' | null | undefined;

const generateOptions = (apiKey: string, aiIntegration: AiIntegration) => ({
  apiKey,
  baseURL:
    aiIntegration?.toLowerCase() === 'openai'
      ? undefined
      : 'https://api.together.xyz/v1',
  dangerouslyAllowBrowser: true,
  maxRetries: 0
});

const getModelName = (aiIntegration: AiIntegration) =>
  aiIntegration?.toLowerCase() === 'openai'
    ? 'gpt-3.5-turbo'
    : // : 'mistralai/Mistral-7B-Instruct-v0.1';
      // : 'togethercomputer/CodeLlama-34b-Instruct';
      'mistralai/Mixtral-8x7B-Instruct-v0.1';

export class IBrainAssistant {
  private assistant: OpenAIAssistant;
  private tools: Record<string, AbstractTool> = {};

  constructor(
    apiKey: string,
    assistantId: string,
    private aiIntegration: AiIntegration,
    private addSyncTask?: (
      description: string,
      executeFn: () => Promise<any>
    ) => void,
    private addAsyncTask?: (
      description: string,
      executeFn: () => Promise<any>
    ) => void
  ) {
    this.assistant = new OpenAIAssistant(
      generateOptions(apiKey, this.aiIntegration),
      assistantId
    );
  }

  addSyncTool(tool: AbstractTool): void {
    if (this.addSyncTask) {
      const originalExecute = tool.execute.bind(tool);

      tool.execute = async (arg?: any) => {
        let result;

        if (this.addSyncTask) {
          const taskExecutor = async () => {
            result = await originalExecute(arg);
            return result;
          };
          this.addSyncTask(tool.description, taskExecutor);
        }

        return result;
      };
    }
    this.tools[tool.name] = tool;
  }

  addAsyncTool(tool: AbstractTool): void {
    if (this.addAsyncTask) {
      const originalExecute = tool.execute.bind(tool);

      tool.execute = async (arg?: any) => {
        let result;

        if (this.addAsyncTask) {
          const taskExecutor = async () => {
            result = await originalExecute(arg);
            return result;
          };
          this.addAsyncTask(tool.description, taskExecutor);
        }

        return result;
      };
    }
    this.tools[tool.name] = tool;
  }

  listTools(): AbstractTool[] {
    return Object.values(this.tools);
  }

  // Method to remove a tool by its name
  removeTool(toolName: string): boolean {
    if (this.tools[toolName]) {
      delete this.tools[toolName];
      console.log(`Tool ${toolName} removed successfully.`);
      return true;
    } else {
      console.log(`Tool ${toolName} not found.`);
      return false;
    }
  }

  // Method to handle tool calls
  private async handleToolCalls(toolCall: any) {
    try {
      const functionName = toolCall.function.name;
      const argumentsObject = JSON.parse(toolCall.function.arguments);

      console.log('Function Name:', functionName);
      console.log('Arguments:', argumentsObject);

      if (this.tools[functionName]) {
        const answer =
          await this.tools?.[functionName]?.execute(argumentsObject);
        return answer;
      } else {
        console.error('Unknown function name:', functionName);
      }
    } catch (error) {
      console.error('Error handling tool calls:', error);
    }
  }

  async ask(message: string) {
    try {
      const context: any[] =
        core.store.getState((s) => s?.communications)?.slice(-10) ?? [];
      console.log(
        'Asking the assistant:',
        message,
        ` with following context: `,
        context
      );
      const completion = await this.assistant.openai.chat.completions.create({
        tools: Object.values(this.tools).map((tool) =>
          tool.getToolDefinition()
        ),
        tool_choice: 'auto',
        messages: [
          ...context,
          {
            role: 'system',
            content:
              'You are a helpful assistant that can access external functions. The responses from these function calls will be appended to this dialogue. Please provide responses based on the information from these function calls. Your name is iBrain and you are a unique AI superstar to help.'
          },
          // {
          //   role: 'assistant',
          //   content: 'My name is iBrain and I am an AI superstar to help you.'
          // },
          { role: 'user', content: message }
        ],
        model: getModelName(this.aiIntegration)
      });

      const toolCall = completion.choices[0].message.tool_calls?.[0];
      if (toolCall) {
        console.log(
          'Assistant response:',
          completion.choices[0].message.content,
          ' with Tool call function ',
          toolCall.function.name,
          ' arguments ',
          toolCall.function.arguments
        );
        const answer = await this.handleToolCalls(toolCall);
        console.log(
          `const answer = await this.handleToolCalls(toolCall) result is: `,
          answer
        );
        return answer;
      } else {
        console.log(
          'Assistant response:',
          completion.choices[0].message.content
        );

        return completion.choices[0].message.content ?? '';
      }
    } catch (error) {
      console.error('Error asking the assistant:', error);
    }
  }

  async talk(systemPrompt: string, instructions: string): Promise<string> {
    try {
      // Use the LLM to generate a response based on the prompt
      const completion = await this.assistant.openai.chat.completions.create({
        temperature: 0.8,
        model: getModelName(this.aiIntegration),
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: instructions
          }
        ]
      });

      // Extract the generated introduction speech from the LLM's response
      const answer =
        completion.choices[0].message.content ??
        "Hello, I am iBrain and I'm here to assist you in any way I can!";

      console.log('talk: ', answer);
      return answer;
    } catch (error) {
      console.error('Error talk:', error);
      return 'There was an error talk. Please try again later.';
    }
  }
  async introduceYourself(): Promise<string> {
    // Updated prompt for the LLM to generate a more engaging and informative introduction
    const prompt = `As iBrain, you are an advanced AI assistant designed to help users with a wide range of tasks. Thank the user for accepting to discuss by voice with you. You're friendly, engaging, and knowledgeable about the services offered, including pricing details and how users can subscribe or sign in and there first 14 days are free. No need for credit card or long subscription. You can do it for the user in 2 seconds. The user just say Sign me in with google or github or email and done. You also support multiple languages, allowing users to interact with you in English, French, Russian, Portuguese, and more. Please introduce yourself in a manner that feels natural and human-like, offering a warm greeting, and explain how you can assist users, including how to change the interaction language. Your last sentence should be a suggestion of a clear action to user to guide on what's next. Lioke you want tme to talk about pricing  or you want to start now?`;

    try {
      // Use the LLM to generate a response based on the prompt
      const completion = await this.assistant.openai.chat.completions.create({
        temperature: 0.8,
        model: getModelName(this.aiIntegration), // Ensure you're using the appropriate model
        messages: [
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: 'Hi.'
          }
        ]
      });

      // Extract the generated introduction speech from the LLM's response
      const introduction =
        completion.choices[0].message.content ??
        "Hello, I am iBrain and I'm here to assist you in any way I can!";

      console.log('Generated introduction:', introduction);
      return introduction;
    } catch (error) {
      console.error('Error generating introduction:', error);
      return 'There was an error generating my introduction. Please try again later.';
    }
  }
}
