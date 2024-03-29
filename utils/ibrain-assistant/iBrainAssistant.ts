'use client';
import { OpenAIAssistant } from '@brainstack/openai-assistantapi';
import { AbstractTool } from './tools/abstraction';
import { core } from '../BrainStackProvider';

export class IBrainAssistant {
  private assistant: OpenAIAssistant;
  private tools: Record<string, AbstractTool> = {};

  constructor(apiKey: string, assistantId: string) {
    this.assistant = new OpenAIAssistant(
      // { baseURL:'',apiKey, dangerouslyAllowBrowser: true },
      {
        baseURL: 'http://127.0.0.1:8082',
        apiKey: 'useless',
        dangerouslyAllowBrowser: true
      },
      assistantId
    );
  }

  // Add a tool to the assistant
  addTool(tool: AbstractTool): void {
    this.tools[tool.name] = tool;
  }

  // Method to handle tool calls
  private async handleToolCalls(toolCall: any) {
    try {
      const functionName = toolCall.function.name;
      const argumentsObject = JSON.parse(toolCall.function.arguments);

      console.log('Function Name:', functionName);
      console.log('Arguments:', argumentsObject);

      // Execute the tool based on the function name
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

  // Method to ask the assistant
  async ask(message: string) {
    try {
      const context: any[] =
        core.store.getState((s) => s?.communications) ?? [];
      console.log('Asking the assistant:', message);
      const completion = await this.assistant.openai.chat.completions.create({
        tools: Object.values(this.tools).map((tool) =>
          tool.getToolDefinition()
        ),
        messages: [
          ...context,
          {
            role: 'assistant',
            content: 'My name is iBrain and I am an AI superstar to help you.'
          },
          { role: 'user', content: message }
        ],
        // model: 'gpt-3.5-turbo',
        model: 'tinyllama-chat'
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
}
