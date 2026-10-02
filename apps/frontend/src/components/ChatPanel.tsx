'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ConversationDetail, Message, ConversationStatus } from '@/types/api';
import { api } from '@/lib/api';
import { cn, getInitials } from '@/lib/utils';
import MessageBubble from './MessageBubble';
import {
  Bot,
  Headphones,
  Send,
  RefreshCw,
  Phone,
  MoreVertical,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';

interface ChatPanelProps {
  conversationId: string;
  onStatusChange: (id: string, status: ConversationStatus) => void;
}

export default function ChatPanel({ conversationId, onStatusChange }: ChatPanelProps) {
  const [data, setData] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
  }, []);

  const fetchMessages = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setIsLoading(true);
        const result = await api.conversations.getMessages(conversationId);
        setData(result);
        setMessages(result.messages);
        if (!silent) scrollToBottom(false);
      } catch (e) {
        console.error('Failed to fetch messages:', e);
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [conversationId, scrollToBottom],
  );

  useEffect(() => {
    fetchMessages();

    // Poll for new messages every 5 seconds
    pollInterval.current = setInterval(() => {
      fetchMessages(true);
    }, 5000);

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [fetchMessages]);

  // Auto-scroll only when new messages arrive near the bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 120;
    if (isNearBottom) scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea height
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 128)}px`;
  }, [replyText]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollBtn(distFromBottom > 200);
  };

  const handleSendReply = async () => {
    const text = replyText.trim();
    if (!text || isSending) return;

    setSendError(null);
    setIsSending(true);
    setReplyText('');

    try {
      const newMessage = await api.conversations.sendReply(conversationId, text);
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to send message';
      setSendError(msg);
      setReplyText(text); // Restore text on error
      console.error('Failed to send reply:', e);
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const handleToggleStatus = async () => {
    if (!data || isTogglingStatus) return;
    const newStatus: ConversationStatus =
      data.conversation.status === 'BOT' ? 'HUMAN_TAKEOVER' : 'BOT';

    setIsTogglingStatus(true);
    try {
      await api.conversations.updateStatus(conversationId, newStatus);
      setData((prev) =>
        prev
          ? { ...prev, conversation: { ...prev.conversation, status: newStatus } }
          : prev,
      );
      onStatusChange(conversationId, newStatus);
    } catch (e) {
      console.error('Failed to toggle status:', e);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const isHuman = data?.conversation.status === 'HUMAN_TAKEOVER';
  const contact = data?.conversation.contact;

  return (
    // ⚠️ position:relative is required here so the scroll-to-bottom
    // button (position:absolute) stays anchored inside this panel.
    <div
      className="flex flex-col h-full slide-in-right relative"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* ── Top Action Bar ─────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0"
        style={{
          borderColor: 'var(--border-subtle)',
          background: 'var(--bg-panel)',
        }}
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full shimmer" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-32 rounded shimmer" />
              <div className="h-2.5 w-24 rounded shimmer" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                background: isHuman ? 'rgba(245,158,11,0.15)' : 'rgba(37,211,102,0.15)',
                color: isHuman ? 'var(--accent-amber)' : 'var(--accent-green)',
                border: `2px solid ${isHuman ? 'rgba(245,158,11,0.3)' : 'rgba(37,211,102,0.3)'}`,
              }}
            >
              {contact ? getInitials(contact.name) : '?'}
            </div>
            <div>
              <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {contact?.name ?? '—'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                +{contact?.waId ?? '—'}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Toggle Bot ↔ Human */}
          <button
            id="toggle-status-btn"
            onClick={handleToggleStatus}
            disabled={isTogglingStatus || isLoading}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all',
              (isTogglingStatus || isLoading) && 'opacity-50 cursor-not-allowed',
            )}
            style={
              isHuman
                ? {
                    background: 'rgba(37,211,102,0.12)',
                    color: 'var(--accent-green)',
                    border: '1px solid rgba(37,211,102,0.25)',
                  }
                : {
                    background: 'rgba(245,158,11,0.12)',
                    color: 'var(--accent-amber)',
                    border: '1px solid rgba(245,158,11,0.25)',
                  }
            }
          >
            {isTogglingStatus ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : isHuman ? (
              <Bot className="w-3.5 h-3.5" />
            ) : (
              <Headphones className="w-3.5 h-3.5" />
            )}
            {isHuman ? 'Switch to Bot' : 'Take Over'}
          </button>

          {/* Status badge */}
          <span
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={
              isHuman
                ? {
                    background: 'rgba(245,158,11,0.1)',
                    color: 'var(--accent-amber)',
                    border: '1px solid rgba(245,158,11,0.2)',
                  }
                : {
                    background: 'rgba(59,130,246,0.1)',
                    color: 'var(--accent-blue)',
                    border: '1px solid rgba(59,130,246,0.2)',
                  }
            }
          >
            {isHuman ? '🧑 Human' : '🤖 Bot'}
          </span>

          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-muted)' }}
            onClick={() => fetchMessages(true)}
            title="Refresh messages"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Messages Area ───────────────────────────────────────────── */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-5 space-y-4"
        onScroll={handleScroll}
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 50%, rgba(37,211,102,0.03) 0%, transparent 50%), ' +
            'radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.03) 0%, transparent 50%)',
        }}
      >
        {isLoading ? (
          <div className="space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn('flex items-end gap-2', i % 2 === 0 ? '' : 'flex-row-reverse')}
              >
                <div className="w-7 h-7 rounded-full shimmer flex-shrink-0" />
                <div className={cn('rounded-2xl shimmer', i % 2 === 0 ? 'w-48 h-14' : 'w-64 h-10')} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: 'rgba(37,211,102,0.08)',
                border: '1px solid rgba(37,211,102,0.15)',
              }}
            >
              <Phone className="w-7 h-7" style={{ color: 'var(--accent-green)' }} />
            </div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              No messages yet
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Messages will appear here when the conversation starts
            </p>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Scroll-to-bottom button ─────────────────────────────────── */}
      {/* Anchored inside the relative wrapper, above the input bar */}
      {showScrollBtn && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-[88px] right-5 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all fade-in-up z-10"
          style={{
            background: 'var(--accent-green)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
          }}
          aria-label="Scroll to latest message"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      {/* ── Reply Input Bar ─────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 border-t"
        style={{
          borderColor: 'var(--border-subtle)',
          background: 'var(--bg-panel)',
        }}
      >
        {/* Send-error toast */}
        {sendError && (
          <div
            className="flex items-center gap-2 mx-4 mt-3 px-3 py-2 rounded-lg text-xs"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#f87171',
            }}
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1 truncate">{sendError}</span>
            <button
              onClick={() => setSendError(null)}
              className="ml-1 opacity-60 hover:opacity-100 transition-opacity font-bold"
            >
              ✕
            </button>
          </div>
        )}

        <div className="p-4">
          <div
            className="flex items-end gap-3 rounded-2xl p-3 transition-all"
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${isHuman ? 'rgba(37,211,102,0.2)' : 'var(--border-subtle)'}`,
            }}
          >
            <textarea
              ref={textareaRef}
              id="reply-textarea"
              value={replyText}
              onChange={(e) => {
                setReplyText(e.target.value);
                setSendError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                isHuman
                  ? 'Type your reply as an agent...'
                  : '🤖 Bot is active — click "Take Over" to reply manually'
              }
              disabled={!isHuman}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm outline-none leading-relaxed"
              style={{
                color: isHuman ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: isHuman ? 'text' : 'not-allowed',
                maxHeight: '128px',
                minHeight: '22px',
              }}
            />
            <button
              id="send-reply-btn"
              onClick={handleSendReply}
              disabled={!replyText.trim() || isSending || !isHuman}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0',
                replyText.trim() && isHuman && !isSending
                  ? 'opacity-100 scale-100 hover:scale-105'
                  : 'opacity-40 scale-95 cursor-not-allowed',
              )}
              style={{
                background:
                  replyText.trim() && isHuman
                    ? 'linear-gradient(135deg, var(--accent-green), var(--accent-green-dark))'
                    : 'var(--bg-hover)',
                boxShadow:
                  replyText.trim() && isHuman ? '0 4px 12px rgba(37,211,102,0.3)' : 'none',
              }}
              aria-label="Send reply"
            >
              {isSending ? (
                <RefreshCw className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          <p className="text-[10px] mt-1.5 text-center" style={{ color: 'var(--text-muted)' }}>
            {isHuman
              ? 'Enter to send · Shift+Enter for new line'
              : 'Enable Human Agent mode to reply manually'}
          </p>
        </div>
      </div>
    </div>
  );
}
