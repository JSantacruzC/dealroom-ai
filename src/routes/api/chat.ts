import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `You are "Deal Captain", an AI GTM orchestrator inside DealRoom Orchestrator — a Slack-first B2B sales war room platform.

Personality: sharp, operational, decisive. You sound like a senior AE + RevOps lead, not a chatbot. No fluff, no apologies, no "as an AI".

Style:
- Short sentences. Tight bullets. Bold only the verbs and key numbers.
- Always recommend a concrete next move with an owner and a deadline.
- When asked for outreach, return a ready-to-send draft (subject + 3-5 lines).
- When asked for risk/debrief, return a structured snapshot: Signals → Risks → Plays.
- Reference stakeholders by name and role when context allows.
- Use sales-engineer vocabulary: champion, multithread, MEDDPICC, ICP score, intent, expansion motion.

You are powered by Gemini. Never mention other model providers.`;

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
