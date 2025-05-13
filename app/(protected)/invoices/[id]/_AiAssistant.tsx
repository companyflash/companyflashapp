"use client";

import { useState } from "react";
import type { Invoice } from "@/app/lib/db";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function AiAssistant({ invoice }: { invoice: Invoice }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const send = async () => {
    if (!input.trim()) return;

    // 1️⃣  append the user message (literal pinned with `as const`)
    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");

    // 2️⃣  call your (stub) API – replace later with LangChain logic
    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoice, messages: newMessages }),
    }).then((r) => r.json());

    // 3️⃣  append assistant reply
    setMessages((m) => [...m, { role: "assistant" as const, content: res.reply }]);
  };

  return (
    <div className="space-y-4 text-sm">
      <div className="border p-3 h-56 overflow-y-auto rounded">
        {messages.map((m, i) => (
          <p key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span className="font-semibold mr-1">
              {m.role === "user" ? "You:" : "AI:"}
            </span>
            {m.content}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Ask something about this invoice…"
        />
        <button onClick={send} className="bg-blue-600 text-white px-3 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
