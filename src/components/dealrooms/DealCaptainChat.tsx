import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUGGESTED = [
  "What's my next move?",
  "Run risk check",
  "Generate debrief",
  "Refresh intelligence",
  "Write voicemail script",
];

export function DealCaptainChat({ companyName }: { companyName: string }) {
  const initialMessages: UIMessage[] = [
    {
      id: "seed-1",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: `Deal Captain online for **${companyName}**. I have firmographics, stakeholder map, and intent signals loaded. Ask me for the next move, a risk check, or outreach drafts.`,
        },
      ],
    },
  ];

  const transport = new DefaultChatTransport({ api: "/api/chat" });
  const { messages, sendMessage, status } = useChat({
    id: `dealroom-${companyName}`,
    messages: initialMessages,
    transport,
  });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const send = (q?: string) => {
    const text = (q ?? input).trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({
      text: `[Account context: ${companyName}] ${text}`,
    });
  };

  return (
    <aside className="w-[340px] shrink-0 border-l border-border bg-surface/40 flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="font-display text-sm">Deal Captain</div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-border">gemini-3-flash</span>
          <span className="ml-auto w-2 h-2 rounded-full bg-success animate-pulse" />
        </div>
        <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider mt-1">{companyName}</div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => {
          const text = m.parts
            .map((p) => (p.type === "text" ? p.text : ""))
            .join("");
          return (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[90%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-card border border-border"
                }`}
              >
                {text || (m.role === "assistant" ? <span className="text-muted-foreground italic">Thinking…</span> : "")}
              </div>
            </div>
          );
        })}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" style={{ animationDelay: "0.15s" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot" style={{ animationDelay: "0.3s" }} />
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              disabled={isLoading}
              className="text-[10px] px-2 py-1 rounded-full border border-border bg-card hover:border-primary/30 text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask Deal Captain…"
            disabled={isLoading}
            className="flex-1 px-3 py-2 rounded-md bg-surface border border-border text-sm focus:outline-none focus:border-primary/40 disabled:opacity-50"
          />
          <Button size="sm" onClick={() => send()} disabled={isLoading} style={{ background: "var(--gradient-primary)" }}>
            <Send className="w-3 h-3" />
          </Button>
        </div>
        <div className="text-[10px] font-mono text-muted-foreground text-center">Powered by Gemini · gemini-3-flash-preview</div>
      </div>
    </aside>
  );
}
