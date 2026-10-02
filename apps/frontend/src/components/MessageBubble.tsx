'use client';

import React from 'react';
import { Message } from '@/types/api';
import { cn, formatFullTime } from '@/lib/utils';
import { CheckCheck, Check, Clock, Bot, User, Headphones } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const statusIcon = (status: Message['status']) => {
  switch (status) {
    case 'READ':
      return <CheckCheck className="w-3 h-3" style={{ color: 'var(--accent-green)' }} />;
    case 'DELIVERED':
      return <CheckCheck className="w-3 h-3" style={{ color: 'var(--accent-blue)' }} />;
    case 'SENT':
      return <Check className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />;
    default:
      return <Clock className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />;
  }
};

const senderIcon = (senderType: Message['senderType']) => {
  switch (senderType) {
    case 'BOT':
      return <Bot className="w-3 h-3" style={{ color: 'var(--accent-green)' }} />;
    case 'AGENT':
      return <Headphones className="w-3 h-3" style={{ color: 'var(--accent-blue)' }} />;
    default:
      return <User className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />;
  }
};

const senderLabel = (senderType: Message['senderType']) => {
  switch (senderType) {
    case 'BOT':
      return { label: 'Bot', color: 'var(--accent-green)' };
    case 'AGENT':
      return { label: 'Agent', color: 'var(--accent-blue)' };
    default:
      return { label: 'User', color: 'var(--text-muted)' };
  }
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isOutgoing = message.senderType !== 'USER';
  const { label, color } = senderLabel(message.senderType);

  return (
    <div
      className={cn(
        'flex items-end gap-2 fade-in-up',
        isOutgoing ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* Avatar icon */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-1"
        style={{
          background:
            message.senderType === 'BOT'
              ? 'rgba(37,211,102,0.15)'
              : message.senderType === 'AGENT'
              ? 'rgba(59,130,246,0.15)'
              : 'rgba(148,163,184,0.1)',
          border: `1px solid ${color}30`,
        }}
      >
        {senderIcon(message.senderType)}
      </div>

      {/* Bubble */}
      <div className={cn('max-w-[72%] flex flex-col', isOutgoing ? 'items-end' : 'items-start')}>
        {/* Sender label */}
        <span className="text-[10px] font-medium mb-1 px-1" style={{ color }}>
          {label}
        </span>

        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            message.senderType === 'USER'
              ? 'bubble-user rounded-bl-sm'
              : message.senderType === 'BOT'
              ? 'bubble-bot rounded-br-sm'
              : 'bubble-agent rounded-br-sm',
          )}
          style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        >
          {message.body}
        </div>

        {/* Timestamp + status */}
        <div className="flex items-center gap-1.5 mt-1 px-1">
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {formatFullTime(message.timestamp)}
          </span>
          {isOutgoing && statusIcon(message.status)}
        </div>
      </div>
    </div>
  );
}
