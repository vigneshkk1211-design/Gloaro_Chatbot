'use client';

import React from 'react';
import { ConversationSummary } from '@/types/api';
import { cn, formatTime, getInitials } from '@/lib/utils';
import { MessageCircle, Bot, User } from 'lucide-react';

interface ConversationListProps {
  conversations: ConversationSummary[];
  selectedId: string | null;
  searchQuery: string;
  statusFilter: 'ALL' | 'BOT' | 'HUMAN_TAKEOVER';
  onSelect: (id: string) => void;
  onSearchChange: (q: string) => void;
  onStatusFilterChange: (s: 'ALL' | 'BOT' | 'HUMAN_TAKEOVER') => void;
  isLoading: boolean;
}

export default function ConversationList({
  conversations,
  selectedId,
  searchQuery,
  statusFilter,
  onSelect,
  onSearchChange,
  onStatusFilterChange,
  isLoading,
}: ConversationListProps) {
  const filtered = conversations.filter((c) => {
    const matchesSearch =
      c.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contact.waId.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #25d366, #1aa64e)' }}
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>
              Team Inbox
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--text-muted)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-green)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
          />
        </div>

        {/* Filter tabs */}
        <div
          className="flex gap-1 p-1 rounded-lg"
          style={{ background: 'var(--bg-card)' }}
        >
          {(['ALL', 'BOT', 'HUMAN_TAKEOVER'] as const).map((f) => (
            <button
              key={f}
              onClick={() => onStatusFilterChange(f)}
              className={cn(
                'flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all',
                statusFilter === f
                  ? 'text-white'
                  : 'hover:opacity-80',
              )}
              style={
                statusFilter === f
                  ? {
                      background:
                        f === 'HUMAN_TAKEOVER'
                          ? 'var(--accent-amber)'
                          : f === 'BOT'
                          ? 'var(--accent-blue)'
                          : 'var(--accent-green)',
                    }
                  : { color: 'var(--text-muted)' }
              }
            >
              {f === 'HUMAN_TAKEOVER' ? 'Human' : f === 'BOT' ? 'Bot' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-3 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                <div className="w-10 h-10 rounded-full shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 rounded shimmer w-3/4" />
                  <div className="h-2.5 rounded shimmer w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <MessageCircle className="w-10 h-10 mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              No conversations found
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filtered.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isSelected={selectedId === conv.id}
                onClick={() => onSelect(conv.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationItem({
  conv,
  isSelected,
  onClick,
}: {
  conv: ConversationSummary;
  isSelected: boolean;
  onClick: () => void;
}) {
  const initials = getInitials(conv.contact.name);
  const lastMsg = conv.lastMessage;
  const isHuman = conv.status === 'HUMAN_TAKEOVER';

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group',
        isSelected ? 'gradient-border' : 'hover:bg-[var(--bg-hover)]',
      )}
      style={isSelected ? {} : {}}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
          style={{
            background: isHuman
              ? 'linear-gradient(135deg, #f59e0b22, #f59e0b44)'
              : 'linear-gradient(135deg, #25d36622, #25d36644)',
            color: isHuman ? 'var(--accent-amber)' : 'var(--accent-green)',
            border: `2px solid ${isHuman ? 'rgba(245,158,11,0.3)' : 'rgba(37,211,102,0.3)'}`,
          }}
        >
          {initials}
        </div>
        {/* Status dot */}
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center',
          )}
          style={{
            background: isHuman ? 'var(--accent-amber)' : 'var(--accent-blue)',
            borderColor: 'var(--bg-secondary)',
          }}
        >
          {isHuman ? (
            <User className="w-2 h-2 text-white" />
          ) : (
            <Bot className="w-2 h-2 text-white" />
          )}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1 mb-0.5">
          <span
            className="text-sm font-semibold truncate"
            style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-primary)' }}
          >
            {conv.contact.name}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {lastMsg && (
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {formatTime(lastMsg.timestamp)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-1">
          <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
            {lastMsg
              ? lastMsg.senderType === 'BOT'
                ? `🤖 ${lastMsg.body}`
                : lastMsg.senderType === 'AGENT'
                ? `👤 You: ${lastMsg.body}`
                : lastMsg.body
              : 'No messages yet'}
          </p>
          {conv.unreadCount > 0 && (
            <span
              className="flex-shrink-0 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white pulse-green"
              style={{ background: 'var(--accent-green)', padding: '0 4px' }}
            >
              {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
