"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  getHeroDemoChatThread,
  type DemoChatMessage,
  type DemoChatPrompt,
} from "@/content/hero-demo-chat-threads";

const PROMPT_LABEL_KEYS = {
  summarize: "chatPromptSummarize",
  actions: "chatPromptActions",
  questions: "chatPromptQuestions",
} as const;

function ChatBubble({ message }: { message: DemoChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div
      className={`max-w-[88%] whitespace-pre-wrap rounded-xl border px-2.5 py-2 text-[0.88em] leading-snug ${
        isUser
          ? "ml-auto border-border/80 bg-section text-foreground"
          : "mr-auto border-border bg-background text-foreground/90"
      }`}
    >
      {message.content}
    </div>
  );
}

export function HeroDemoChat({
  meetingId,
  onAttach,
}: {
  meetingId: string;
  onAttach?: () => void;
}) {
  const t = useTranslations("hero.demo");
  const locale = useLocale();
  const thread = useMemo(
    () => getHeroDemoChatThread(meetingId, locale),
    [meetingId, locale],
  );
  const [messages, setMessages] = useState<DemoChatMessage[]>(thread.messages);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialCount = thread.messages.length;

  useEffect(() => {
    setMessages(thread.messages);
    setTyping(false);
    setDraft("");
  }, [thread]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  function runExchange(user: string, assistant: string) {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: user },
      { role: "assistant", content: assistant },
    ]);
  }

  function handlePrompt(prompt: DemoChatPrompt) {
    if (typing) return;
    runExchange(prompt.user, prompt.assistant);
  }

  function handleSend() {
    const text = draft.trim();
    if (!text || typing) return;
    setDraft("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: thread.defaultReply },
      ]);
    }, 850);
  }

  const showWelcome = messages.length <= initialCount;

  return (
    <>
      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2"
      >
        {messages.map((msg, i) => (
          <ChatBubble key={`${msg.role}-${i}-${msg.content.slice(0, 12)}`} message={msg} />
        ))}
        {typing ? (
          <div className="mr-auto max-w-[88%] rounded-xl border border-border bg-background px-2.5 py-2 text-[0.88em] text-muted">
            {t("chatThinking")}
          </div>
        ) : null}
        {showWelcome ? (
          <div className="mt-auto flex flex-col items-center gap-2 py-4 text-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-muted text-[0.75em] font-bold text-accent">
              AI
            </div>
            <p className="text-[0.88em] font-semibold text-foreground">{t("chatAskTitle")}</p>
            <div className="flex w-full flex-col gap-1.5">
              {thread.prompts.map((prompt) => (
                <button
                  key={prompt.id}
                  type="button"
                  disabled={typing}
                  onClick={() => handlePrompt(prompt)}
                  className="w-full rounded-lg border border-border bg-section px-2 py-1.5 text-left text-[0.82em] text-foreground transition-colors hover:border-border-light hover:bg-surface-hover disabled:opacity-50"
                >
                  {t(PROMPT_LABEL_KEYS[prompt.id])}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-border/60 p-2">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background pl-1 pr-0.5">
          <button
            type="button"
            aria-label={t("chatAttach")}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-foreground"
            onClick={onAttach}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t("chatPlaceholder")}
            className="min-w-0 flex-1 bg-transparent py-1.5 text-[0.88em] text-foreground outline-none placeholder:text-muted/70"
          />
          <button
            type="button"
            aria-label={t("chatSend")}
            disabled={!draft.trim() || typing}
            onClick={handleSend}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-accent transition-colors hover:bg-accent-muted disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2 11 13" />
              <path d="m22 2-7 20-4-9-9-4z" />
            </svg>
          </button>
        </div>
        <div className="mt-1.5 flex items-center gap-1 px-0.5 text-[0.75em] text-muted">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
          </svg>
          <span className="truncate">{t("chatModel")}</span>
        </div>
      </div>
    </>
  );
}
