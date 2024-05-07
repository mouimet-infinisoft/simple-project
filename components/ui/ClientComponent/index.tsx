"use client";
import { 
  VoiceProvider, 
  ToolCall, 
  ToolCallHandler,
  ToolResponse, 
  ToolError, 
} from "@humeai/voice-react";
import Messages from "./Controls";
import Controls from "./Messages";

// const handleToolCall: ToolCallHandler = async (
//   toolCall: ToolCall
// ): Promise<ToolResponse | ToolError> => {
//   console.log("Tool call received", toolCall);

//   if (toolCall.name === 'get_current_weather') {
//     try {
//       const args = JSON.parse(toolCall.parameters) as {
//         location: string;
//         format: 'fahrenheit' | 'celsius';
//       };

//       const location = await fetch(
//         `https://geocode.maps.co/search?q=${args.location}&api_key=${process.env.NEXT_PUBLIC_GEOCODING_API_KEY}`,
//       );

//       const locationResults = (await location.json()) as {
//         lat: string;
//         lon: string;
//       }[];

//       const { lat, lon } = locationResults[0];

//       const pointMetadataEndpoint: string = `https://api.weather.gov/points/${parseFloat(lat).toFixed(3)},${parseFloat(lon).toFixed(3)}`;

//       const result = await fetch(pointMetadataEndpoint, {
//         method: 'GET',
//       });

//       const json = (await result.json()) as {
//         properties: {
//           forecast: string;
//         };
//       };
//       const { properties } = json;
//       const { forecast: forecastUrl } = properties;

//       const forecastResult = await fetch(forecastUrl);

//       const forecastJson = (await forecastResult.json()) as {
//         properties: {
//           periods: unknown[];
//         };
//       };
//       const forecast = forecastJson.properties.periods;

//       return {
//         type: 'tool_response',
//         tool_call_id: toolCall.tool_call_id,
//         content: JSON.stringify(forecast),
//       };
//     } catch (error) {
//       return {
//         type: 'tool_error',
//         tool_call_id: toolCall.tool_call_id,
//         error: 'Weather tool error',
//         code: 'weather_tool_error',
//         level: 'warn',
//         content: 'There was an error with the weather tool',
//       };
//     }
//   } else {
//     return {
//       type: 'tool_error',
//       tool_call_id: toolCall.tool_call_id,
//       error: 'Tool not found',
//       code: 'tool_not_found',
//       level: 'warn',
//       content: 'The tool you requested was not found',
//     };
//   }
// };



const handleToolCall: ToolCallHandler = async (
    toolCall: ToolCall
  ): Promise<ToolResponse | ToolError> => {
    console.log("Tool call received", toolCall);
  
    const action = toolCall.name;
  
    switch (action) {
      case 'get_features_info':
        return generateToolResponse(toolCall.tool_call_id);
      default:
        return generateToolNotFoundError(toolCall.tool_call_id);
    }
  };
  
  const generateToolResponse = (tool_call_id: string): ToolResponse => {
    const content = `
      Introduction to iBrain's Core Features
      Begin by introducing iBrain as a revolutionary tool designed to empower teams and enhance workflows. Highlight the intuitive interaction with the AI assistant, emphasizing the natural, intention-driven discussions that do not require memorization of specific voice commands. Explain how iBrain understands the context of discussions and queries, providing relevant insights and taking appropriate actions based on the conversation's flow.
      
      Advanced Capabilities for Global Teams and Data Analysis
      Dive into the dynamic language adaptation feature, showcasing iBrain's ability to seamlessly adapt to over 90 languages, allowing users worldwide to engage in their preferred language without needing to adjust settings manually. Follow this by explaining the schema-aware data analysis capability, which leverages the database schema to generate insightful queries and extract meaningful information, all guided by the context of the ongoing discussion.
      
      Seamless Integration and Real-time Decision Making
      Conclude with the effortless database integration and real-time insights delivery features. Detail how iBrain integrates with popular databases like MySQL, SQL, and PostgreSQL through natural language discussions, eliminating complex manual setup processes. Emphasize the benefit of receiving real-time data insights and analytics during discussions, which supports quick decision-making and problem-solving, streamlining business operations and enhancing productivity.
    `;
  
    return {
      type: 'tool_response',
      tool_call_id: tool_call_id,
      content: content,
    };
  };
  
  const generateToolNotFoundError = (tool_call_id: string): ToolError => {
    return {
      type: 'tool_error',
      tool_call_id: tool_call_id,
      error: 'Tool not found',
      code: 'tool_not_found',
      level: 'warn',
      content: 'The tool you requested was not found',
    };
  };
  










export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  return (
    <VoiceProvider
      configId={process.env.NEXT_PUBLIC_HUME_VOICE_WEATHER_CONFIG_ID}
      auth={{ type: "accessToken", value: accessToken }}
      onToolCall={handleToolCall}
      onMessage={(message: unknown) => console.log(message)}
    >
      <Messages />
      <Controls />
    </VoiceProvider>
  );
}