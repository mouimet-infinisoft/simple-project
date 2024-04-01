'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { updateKey } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UserSettings {
  apiKey: string;
  assistantId: string;
  togetherApiKey?: string; // Marking the Together API key as optional
  aiIntegration?:string
}

export default function AIForm(userSettings: UserSettings) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await handleRequest(e, updateKey, router);
    setIsSubmitting(false);
    window.location.reload();
    router.push(`/protected/assistant`)
  };

  return (
    <Card
      title="API Settings"
      description="Please enter your AI Informations."
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
      <form
        id="settingsForm"
        onSubmit={handleSubmit}
        className="mt-8 mb-4 text-xl font-semibold"
      >
        <div className="mb-4">
          <label htmlFor="apiKey" className="block mb-2">
            OpenAI API Key
          </label>
          <input
            type="text"
            name="apiKey"
            className="w-full p-3 rounded-md bg-zinc-800"
            defaultValue={userSettings.apiKey}
            placeholder="Your OpenAI API Key"
          />
        </div>
        {/* <div className="mb-4">
          <label htmlFor="assistantId" className="block mb-2">
            Assistant ID
          </label>
          <input
            type="text"
            name="assistantId"
            className="w-full p-3 rounded-md bg-zinc-800"
            defaultValue={userSettings.assistantId}
            placeholder="Your Assistant ID"
          />
        </div> */}
        <div className="mb-4">
          <label htmlFor="togetherApiKey" className="block mb-2">
            Together API Key
          </label>
          <input
            type="text"
            name="togetherApiKey"
            className="w-full p-3 rounded-md bg-zinc-800"
            defaultValue={userSettings?.togetherApiKey}
            placeholder="Your Together API Key"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="aiIntegration" className="block mb-2">
            AI Integration
          </label>
          <select
            name="aiIntegration"
            id="aiIntegration"
            className="w-full p-3 rounded-md bg-zinc-800"
            defaultValue={userSettings?.aiIntegration} // You can set a default value here if needed
          >
            <option value="" disabled>
              Select your AI Integration
            </option>
            <option value="openai">OpenAI</option>
            <option value="togetherai">TogetherAI</option>
          </select>
        </div>
      </form>
    </Card>
  );
}
