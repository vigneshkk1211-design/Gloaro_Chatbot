'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ConversationSummary, ConversationStatus } from '@/types/api';
import { api } from '@/lib/api';
import ConversationList from '@/components/ConversationList';
import ChatPanel from '@/components/ChatPanel';
import { MessageCircle, Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { formatTime } from '@/lib/utils';

const POLL_INTERVAL_MS = 8_000;

export default function InboxPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'BOT' | 'HUMAN_TAKEOVER'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchConversations = useCallback(async (opts: { silent?: boolean; manual?: boolean } = {}) => {
    const { silent = false, manual = false } = opts;
    try {
      if (!silent) setIsLoading(true);
      if (manual) setIsRefreshing(true);

      const data = await api.conversations.list();
      setConversations(data);
      setIsConnected(true);
      setConnectionError(null);
      setLastUpdated(new Date());
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not reach backend';
      console.error('Failed to fetch conversations:', msg);
      setIsConnected(false);
      setConnectionError(msg);
    } finally {
      if (!silent) setIsLoading(false);
      if (manual) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();

    const interval = setInterval(() => {
      fetchConversations({ silent: true });
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchConversations]);

  const handleStatusChange = useCallback(
    (id: string, status: ConversationStatus) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c)),
      );
    },
    [],
  );

  const stats = {
    total: conversations.length,
    bot:   conversations.filter((c) => c.status === 'BOT').length,
    human: conversations.filter((c) => c.status === 'HUMAN_TAKEOVER').length,
    unread: conversations.reduce((sum, c) => sum + c.unreadCount, 0),
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Top Navigation Bar ───────────────────────────────────────── */}
      <nav
        className="flex items-center justify-between px-6 py-3 flex-shrink-0 z-20"
        style={{
          background: 'var(--bg-panel)',
          borderBottom: '1px solid var(--border-subtle)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #25d366, #1aa64e)',
              boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
            }}
          >
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            WhatsApp <span style={{ color: 'var(--accent-green)' }}>Inbox</span>
          </span>
        </div>

        {/* Stats row */}
        <div className="hidden md:flex items-center gap-6">
          <StatPill label="Total"      value={stats.total}  color="var(--text-secondary)" />
          <StatPill label="Bot Active" value={stats.bot}    color="var(--accent-blue)"    />
          <StatPill label="Human"      value={stats.human}  color="var(--accent-amber)"   />
          <StatPill label="Unread"     value={stats.unread} color="var(--accent-green)"   />
        </div>

        {/* Connection status + refresh */}
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="hidden lg:block text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Updated {formatTime(lastUpdated.toISOString())}
            </span>
          )}

          <button
            id="refresh-conversations-btn"
            onClick={() => fetchConversations({ manual: true })}
            disabled={isRefreshing}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-hover)] disabled:opacity-50"
            style={{ color: 'var(--text-muted)' }}
            title="Refresh conversations"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style={{
              background: isConnected ? 'rgba(37,211,102,0.08)' : 'rgba(239,68,68,0.08)',
              color:      isConnected ? 'var(--accent-green)'   : '#ef4444',
              border: `1px solid ${isConnected ? 'rgba(37,211,102,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}
          >
            {isConnected
              ? <Wifi    className="w-3 h-3" />
              : <WifiOff className="w-3 h-3" />
            }
            {isConnected ? 'Connected' : 'Offline'}
          </div>
        </div>
      </nav>

      {/* ── Backend unreachable banner ────────────────────────────────── */}
      {!isConnected && connectionError && (
        <div
          className="flex items-center gap-3 px-6 py-2.5 text-xs"
          style={{
            background: 'rgba(239,68,68,0.08)',
            borderBottom: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#f87171' }} />
          <span style={{ color: '#fca5a5' }}>
            <strong>Backend unreachable:</strong> {connectionError}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>—</span>
          <span style={{ color: 'var(--text-muted)' }}>
            Make sure <code className="px-1 rounded" style={{ background: 'var(--bg-card)' }}>npm run dev</code> is running in{' '}
            <code className="px-1 rounded" style={{ background: 'var(--bg-card)' }}>apps/backend</code>
          </span>
          <button
            onClick={() => fetchConversations({ manual: true })}
            className="ml-auto text-xs px-3 py-1 rounded-lg transition-all"
            style={{
              background: 'rgba(239,68,68,0.15)',
              color: '#f87171',
              border: '1px solid rgba(239,68,68,0.3)',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane — Conversation list */}
        <div
          className="w-80 flex-shrink-0 border-r"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onSelect={setSelectedId}
            onSearchChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
            isLoading={isLoading}
          />
        </div>

        {/* Right Pane — Chat */}
        <div className="flex-1 overflow-hidden">
          {selectedId ? (
            <ChatPanel
              key={selectedId}
              conversationId={selectedId}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <EmptyState
              onSelect={setSelectedId}
              conversations={conversations}
              isBackendDown={!isConnected}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="text-xs font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

function EmptyState({
  onSelect,
  conversations,
  isBackendDown,
}: {
  onSelect: (id: string) => void;
  conversations: ConversationSummary[];
  isBackendDown: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 50% 50%, rgba(37,211,102,0.04) 0%, transparent 70%)',
      }}
    >
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{
          background: isBackendDown ? 'rgba(239,68,68,0.08)' : 'rgba(37,211,102,0.08)',
          border: `1px solid ${isBackendDown ? 'rgba(239,68,68,0.15)' : 'rgba(37,211,102,0.15)'}`,
          boxShadow: `0 0 40px ${isBackendDown ? 'rgba(239,68,68,0.06)' : 'rgba(37,211,102,0.08)'}`,
        }}
      >
        {isBackendDown
          ? <WifiOff className="w-9 h-9" style={{ color: '#f87171' }} />
          : <MessageCircle className="w-10 h-10" style={{ color: 'var(--accent-green)' }} />
        }
      </div>

      <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        {isBackendDown ? 'Backend offline' : 'Select a conversation'}
      </h2>
      <p className="text-sm mb-8 text-center max-w-xs" style={{ color: 'var(--text-muted)' }}>
        {isBackendDown
          ? 'Run npm run dev in apps/backend, then refresh.'
          : 'Choose a conversation from the left panel to view messages and respond to customers.'}
      </p>

      {!isBackendDown && conversations.length > 0 && (
        <div className="flex flex-col gap-2 w-64">
          {conversations.slice(0, 3).map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className="flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:scale-[1.01]"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: 'rgba(37,211,102,0.15)', color: 'var(--accent-green)' }}
              >
                {c.contact.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {c.contact.name}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {c.lastMessage?.body ?? 'No messages'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


