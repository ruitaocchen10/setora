"use client";

import { useRef, useState, KeyboardEvent, ChangeEvent } from "react";
import { Paperclip, Send, X } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string, audioFile: File | null) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    if (!text.trim() && !audioFile) return;
    onSend(text.trim(), audioFile);
    setText("");
    setAudioFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAudioFile(file);
    e.target.value = "";
  }

  const canSend = (text.trim().length > 0 || audioFile !== null) && !disabled;

  return (
    <div className="border-t border-border px-6 py-4 shrink-0">
      {audioFile && (
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary max-w-fit">
            <span className="truncate max-w-48">{audioFile.name}</span>
            <button
              onClick={() => setAudioFile(null)}
              className="shrink-0 hover:text-primary/70 transition-colors cursor-pointer"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <div className="flex items-end gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 mb-0.5 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
          title="Attach recording"
        >
          <Paperclip className="size-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Add a note or ask a question…"
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed py-1.5 max-h-40 overflow-y-auto"
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="shrink-0 mb-0.5 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
        >
          <Send className="size-4" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 ml-8">⌘↵ to send</p>
    </div>
  );
}
