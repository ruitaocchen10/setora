"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, Music } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/types";
import { ChatInput } from "./ChatInput";

interface FeedbackData extends Record<string, unknown> {
  priority_issue?: string;
  explanation?: string;
  drill?: string;
  session_note?: string;
  audio_filename?: string;
}

interface SessionChatProps {
  sessionId: string;
  projectId: string;
  projectTitle: string;
  sessionDate: string;
  initialMessages: Message[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function UserMessage({ message }: { message: Message }) {
  const feedback = message.feedback_data as FeedbackData | null;
  return (
    <div className="flex flex-col items-end gap-1.5">
      {message.content && (
        <div className="max-w-[70%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5">
          <p className="text-sm text-primary-foreground leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      )}
      {feedback?.audio_filename && (
        <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
          <Music className="size-3 shrink-0" />
          <span className="truncate max-w-48">{feedback.audio_filename}</span>
        </div>
      )}
    </div>
  );
}

function AssistantMessage({ message }: { message: Message }) {
  const feedback = message.feedback_data as FeedbackData | null;
  const isStructured =
    feedback && (feedback.priority_issue || feedback.drill || feedback.session_note);

  if (isStructured) {
    return (
      <div className="max-w-[75%] flex flex-col gap-3">
        {(feedback.priority_issue || feedback.explanation) && (
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Focus for this session
            </p>
            {feedback.priority_issue && (
              <p className="text-sm font-medium text-foreground mb-1">
                {feedback.priority_issue}
              </p>
            )}
            {feedback.explanation && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feedback.explanation}
              </p>
            )}
          </div>
        )}
        {feedback.drill && (
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Try this drill
            </p>
            <p className="text-sm text-foreground leading-relaxed">{feedback.drill}</p>
          </div>
        )}
        {feedback.session_note && (
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Session note
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feedback.session_note}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-surface border border-border px-4 py-2.5">
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
        {message.content}
      </p>
    </div>
  );
}

export function SessionChat({
  sessionId,
  projectId,
  projectTitle,
  sessionDate,
  initialMessages,
}: SessionChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text: string, audioFile: File | null) {
    if (!text && !audioFile) return;
    setSending(true);

    const feedbackData: FeedbackData | null = audioFile
      ? { audio_filename: audioFile.name }
      : null;

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      session_id: sessionId,
      role: "user",
      content: text,
      recording_id: null,
      feedback_data: feedbackData,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    const supabase = createSupabaseBrowserClient();
    const { data: saved } = await supabase
      .from("messages")
      .insert({
        session_id: sessionId,
        role: "user",
        content: text,
        feedback_data: feedbackData,
      })
      .select()
      .single();

    if (saved) {
      setMessages((prev) =>
        prev.map((m) => (m.id === tempMessage.id ? (saved as Message) : m))
      );
    }

    setSending(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 py-5 border-b border-border shrink-0">
        <Link
          href={`/projects/${projectId}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-1 cursor-pointer"
        >
          <ChevronLeft className="size-4" />
          {projectTitle}
        </Link>
        <p className="text-xs text-muted-foreground">
          Session · {formatDate(sessionDate)}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Upload a recording or add a note to get started.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <UserMessage key={msg.id} message={msg} />
              ) : (
                <AssistantMessage key={msg.id} message={msg} />
              )
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={sending} />
    </div>
  );
}
