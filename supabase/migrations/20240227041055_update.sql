create extension if not exists "wrappers" with schema "extensions";


create table "public"."awareness" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "informations" text
);


alter table "public"."awareness" enable row level security;

CREATE UNIQUE INDEX awareness_pkey ON public.awareness USING btree (id);

alter table "public"."awareness" add constraint "awareness_pkey" PRIMARY KEY using index "awareness_pkey";

grant delete on table "public"."awareness" to "anon";

grant insert on table "public"."awareness" to "anon";

grant references on table "public"."awareness" to "anon";

grant select on table "public"."awareness" to "anon";

grant trigger on table "public"."awareness" to "anon";

grant truncate on table "public"."awareness" to "anon";

grant update on table "public"."awareness" to "anon";

grant delete on table "public"."awareness" to "authenticated";

grant insert on table "public"."awareness" to "authenticated";

grant references on table "public"."awareness" to "authenticated";

grant select on table "public"."awareness" to "authenticated";

grant trigger on table "public"."awareness" to "authenticated";

grant truncate on table "public"."awareness" to "authenticated";

grant update on table "public"."awareness" to "authenticated";

grant delete on table "public"."awareness" to "service_role";

grant insert on table "public"."awareness" to "service_role";

grant references on table "public"."awareness" to "service_role";

grant select on table "public"."awareness" to "service_role";

grant trigger on table "public"."awareness" to "service_role";

grant truncate on table "public"."awareness" to "service_role";

grant update on table "public"."awareness" to "service_role";



