create type "public"."ai_integration" as enum ('openai', 'togetherai');

alter table "public"."users" add column "ai_integration" ai_integration;



