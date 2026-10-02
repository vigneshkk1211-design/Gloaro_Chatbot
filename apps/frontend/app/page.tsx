"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare, Bot, User, Send, RefreshCw,
  CheckCheck, Wifi, WifiOff, AlertCircle,
} from "lucide-react";

interface Message {
  id: string;
  senderType: "USER" | "BOT" | "AGENT";
  type: "TEXT" | "INTERACTIVE" | "TEMPLATE";
  body: string;
  status: "SENT" | "DELIVERED" | "READ";
  timestamp: string;
}

interface Conversation {
  id: string;
  contact: { name?: string; waId: string };
  status: "BOT" | "HUMAN_TAKEOVER";
  unreadCount: number;
  lastMessage?: { body: string } | null;
  updatedAt: string;
}

interface ConversationDetail {
  conversation: { id: string; status: string; contact: { name?: string; waId: string } };
  messages: Message[];
}

const BASE = "/api"; // Next.js proxy → http://127.0.0.1:3001

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Renders WhatsApp-style bold (*text*) and italic (_text_)
function WhatsAppText({ text }: { text: string }) {
  const formatted = text
    .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
}

export default function WhatsAppDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Fetch conversation list ───────────────────────────────────────────────
  const fetchChats = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/conversations`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Conversation[] = await res.json();
      setConversations(data);
      setIsConnected(true);
      // Auto-select first conversation
      setSelectedId((prev) => prev ?? (data[0]?.id || null));
    } catch {
      setIsConnected(false);
    }
  }, []);

  // ── Fetch messages for selected conversation ──────────────────────────────
  const fetchMessages = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${BASE}/conversations/${id}/messages`);
      if (!res.ok) return;
      const data: ConversationDetail = await res.json();
      setDetail(data);
    } catch (e) {
      console.error("fetchMessages:", e);
    }
  }, []);

  // ── Polling ───────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchChats();
    const t = setInterval(fetchChats, 5000);
    return () => clearInterval(t);
  }, [fetchChats]);

  useEffect(() => {
    if (!selectedId) return;
    fetchMessages(selectedId);
    const t = setInterval(() => fetchMessages(selectedId), 5000);
    return () => clearInterval(t);
  }, [selectedId, fetchMessages]);

  // ── Auto-scroll to latest message ─────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [detail?.messages]);

  // ── Send agent reply ──────────────────────────────────────────────────────
  const handleSendReply = async () => {
    if (!selectedId || !replyText.trim() || loading) return;
    const text = replyText.trim();
    setLoading(true);
    setReplyText("");
    try {
      await fetch(`${BASE}/conversations/${selectedId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      await fetchMessages(selectedId);
      await fetchChats();
    } catch (e) {
      console.error("send reply:", e);
      setReplyText(text);
    } finally {
      setLoading(false);
    }
  };

  // ── Toggle Bot ↔ Human Takeover ───────────────────────────────────────────
  const toggleStatus = async () => {
    if (!selectedId || !detail) return;
    const cur = detail.conversation.status;
    const newStatus = cur === "BOT" ? "HUMAN_TAKEOVER" : "BOT";
    try {
      await fetch(`${BASE}/conversations/${selectedId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setDetail((d) =>
        d ? { ...d, conversation: { ...d.conversation, status: newStatus } } : d
      );
      await fetchChats();
    } catch (e) {
      console.error("toggleStatus:", e);
    }
  };

  const isHuman = detail?.conversation.status === "HUMAN_TAKEOVER";

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* ── Left Sidebar ────────────────────────────────────────────────── */}
      <div className="w-80 flex-shrink-0 border-r border-slate-800 flex flex-col bg-slate-900">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-emerald-500 w-5 h-5" />
            <h1 className="font-bold text-base">Gloaro Inbox</h1>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                isConnected
                  ? "bg-emerald-900/40 text-emerald-400"
                  : "bg-red-900/40 text-red-400"
              }`}
            >
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? "Live" : "Offline"}
            </div>
            <button
              onClick={fetchChats}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm leading-relaxed">
              {isConnected
                ? "எந்த சாட்டும் இல்லை.\nவாட்ஸ்அப்பில் இருந்து மெசேஜ் வரும் போது இங்கு தோன்றும்."
                : "Backend offline — check apps/backend is running on port 3001."}
            </div>
          ) : (
            conversations.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedId(chat.id)}
                className={`p-4 cursor-pointer hover:bg-slate-800/60 transition-colors ${
                  selectedId === chat.id
                    ? "bg-slate-800 border-l-4 border-emerald-500"
                    : "border-l-4 border-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-slate-100 text-sm truncate flex-1 mr-2">
                    {chat.contact.name || `+${chat.contact.waId}`}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {chat.unreadCount > 0 && (
                      <span className="bg-emerald-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {chat.unreadCount}
                      </span>
                    )}
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        chat.status === "BOT"
                          ? "bg-blue-900/60 text-blue-400"
                          : "bg-amber-900/60 text-amber-400"
                      }`}
                    >
                      {chat.status === "BOT" ? "BOT" : "HUMAN"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {chat.lastMessage?.body ?? "No messages yet"}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  {timeAgo(chat.updatedAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Right Chat Area ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-slate-950 min-w-0">
        {detail ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 flex-shrink-0">
              <div>
                <h2 className="font-semibold text-slate-100 text-sm">
                  {detail.conversation.contact.name ||
                    `+${detail.conversation.contact.waId}`}
                </h2>
                <p className="text-xs text-slate-400">
                  +{detail.conversation.contact.waId} · WhatsApp Cloud API
                </p>
              </div>
              <button
                onClick={toggleStatus}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  isHuman
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "bg-amber-600 hover:bg-amber-500 text-white"
                }`}
              >
                {isHuman ? (
                  <><Bot className="w-3.5 h-3.5" /> Bot-ஐ இயக்கு</>
                ) : (
                  <><User className="w-3.5 h-3.5" /> Take Over (Agent)</>
                )}
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {detail.messages.map((msg) => {
                const isUser = msg.senderType === "USER";
                const isBot  = msg.senderType === "BOT";

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[72%] rounded-2xl px-3.5 py-2.5 text-sm shadow ${
                        isUser
                          ? "bg-slate-800 text-slate-100 rounded-tl-none"
                          : isBot
                          ? "bg-indigo-700/90 text-white rounded-tr-none"
                          : "bg-emerald-600 text-white rounded-tr-none"
                      }`}
                    >
                      {/* Sender label */}
                      <div className="text-[9px] font-mono uppercase opacity-60 mb-1 tracking-wider">
                        {msg.senderType}
                      </div>

                      {/* Message body — render WhatsApp bold/italic formatting */}
                      <div className="leading-relaxed break-words">
                        <WhatsAppText text={msg.body} />
                      </div>

                      {/* Interactive indicator */}
                      {msg.type === "INTERACTIVE" && !isUser && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded-full opacity-70">
                            🔘 Interactive buttons sent
                          </span>
                        </div>
                      )}

                      {/* Timestamp + read status */}
                      <div className="flex justify-end items-center gap-1 mt-1 text-[9px] opacity-50">
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {!isUser && (
                          <CheckCheck
                            className={`w-3 h-3 ${
                              msg.status === "READ"
                                ? "text-sky-300"
                                : msg.status === "DELIVERED"
                                ? "text-slate-300"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="flex-shrink-0 p-3 border-t border-slate-800 bg-slate-900">
              {!isHuman && (
                <div className="flex items-center gap-2 mb-2 text-xs text-amber-400 bg-amber-900/20 border border-amber-900/40 rounded-lg px-3 py-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  Bot active — "Take Over (Agent)" பட்டனை அழுத்தினால் reply அனுப்பலாம்
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={
                    isHuman
                      ? "பயனருக்கு ரிப்ளை டைப் செய்யவும்..."
                      : "Bot active-ல் உள்ளது..."
                  }
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendReply()}
                  disabled={!isHuman}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
                />
                <button
                  disabled={loading || !replyText.trim() || !isHuman}
                  onClick={handleSendReply}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 transition flex-shrink-0"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  அனுப்பு
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-3">
            <MessageSquare className="w-12 h-12 opacity-20" />
            <p className="text-sm">
              {isConnected
                ? "ஒரு உரையாடலை தேர்ந்தெடுக்கவும்."
                : "Backend offline — apps/backend-ல் npm run dev இயக்கவும்."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}