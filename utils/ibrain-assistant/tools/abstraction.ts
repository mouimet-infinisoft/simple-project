import { Assistant } from 'openai/resources/beta/assistants/assistants';

// Define the interface for the tool parameters
export interface ToolParameters {
  [key: string]: {
    type: string;
    description: string;
    enum?: string[];
  };
}

// Abstract class for a tool
export abstract class AbstractTool<T = any> {
  constructor(
    public name: string,
    public description: string,
    private parameters: ToolParameters = {},
    private requiredParameters: (keyof ToolParameters)[] = []
  ) {}

  // Abstract method to define the execute behavior
  abstract execute(args?: T): Promise<any>;

  // Method to get the tool definition
  getToolDefinition(): Assistant.Function {
    return {
      type: 'function',
      function: {
        name: this.name,
        description: this.description,
        parameters: {
          type: 'object',
          properties: this.parameters,
          required: this.requiredParameters,
        },
      },
    };
  }
}
