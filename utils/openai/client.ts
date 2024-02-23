import { OpenAI } from 'openai';
import { configuration } from './config';

// Create and export an instance of OpenAIApi with the configuration
export const openai = new OpenAI(configuration);
