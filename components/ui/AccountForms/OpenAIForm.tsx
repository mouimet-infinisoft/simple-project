'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
// import { updateSettings } from '@/utils/auth-helpers/server'; // Assume this is a new or updated utility function
// import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OpenAIForm({ userSettings }: { userSettings: { apiKey: string; assistantId: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiKey, setApiKey] = useState(userSettings.apiKey);
  const [assistantId, setAssistantId] = useState(userSettings.assistantId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);

    // Check if the new settings are the same as the old settings
    if (apiKey === userSettings.apiKey && assistantId === userSettings.assistantId) {
      setIsSubmitting(false);
      return;
    }

    // Assuming handleRequest can be adapted or is flexible enough to handle this new structure
    // await handleRequest(e, () => updateSettings({ apiKey, assistantId }), router);
    setIsSubmitting(false);
  };

  return (
    <Card
      title="API Settings"
      description="Please enter your OpenAI API key and Assistant ID."
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <Button
            variant="slim"
            type="submit"
            form="settingsForm"
            loading={isSubmitting}
          >
            Update Settings
          </Button>
        </div>
      }
    >
      <form id="settingsForm" onSubmit={handleSubmit} className="mt-8 mb-4 text-xl font-semibold">
        <div className="mb-4">
          <label htmlFor="apiKey" className="block mb-2">OpenAI API Key</label>
          <input
            type="text"
            id="apiKey"
            name="apiKey"
            className="w-full p-3 rounded-md bg-zinc-800"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Your OpenAI API Key"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="assistantId" className="block mb-2">Assistant ID</label>
          <input
            type="text"
            id="assistantId"
            name="assistantId"
            className="w-full p-3 rounded-md bg-zinc-800"
            value={assistantId}
            onChange={(e) => setAssistantId(e.target.value)}
            placeholder="Your Assistant ID"
          />
        </div>
      </form>
    </Card>
  );
}
