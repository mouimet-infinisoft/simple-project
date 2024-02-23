import { LogLevel } from '@brainstack/log';
import { AiBase } from './implementation';
import { openai } from '../client';
import { CompletionCreateParamsNonStreaming } from 'openai/resources';

export class OpenAIIntegration extends AiBase {
  constructor(logLevel: LogLevel = LogLevel.VERBOSE) {
    super(logLevel);
  }

  async ask(prompt: string): Promise<string> {
    super.ask(prompt); // Call to base class ask, if needed for common pre-processing

    try {
      const completionParams: CompletionCreateParamsNonStreaming = {
        model: 'gpt-3.5-turbo', // or "gpt-3.5-turbo" as per your requirement
        prompt,
        max_tokens: 512,
        temperature: 0.7
      };

      const completion = await openai.completions.create(completionParams);
      const answer = completion.choices[0]?.text ?? 'No response';
      this._log.verbose(`OpenAI response: ${answer}`);
      return answer;
    } catch (error) {
      this._log.error('Error calling OpenAI:', error);
      throw new Error('Failed to get response from OpenAI.');
    }
  }
}
