import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, FileText, CheckCheck, UserCheck, AlertTriangle, MessageSquareCode, ShieldAlert } from 'lucide-react';
import { ChatMessage, Role, Language } from '../types';
import { TRANSLATE_DICT } from '../data/initialData';

interface ChatWindowProps {
  language: Language;
  currentUser: { id: string; name: string; role: Role };
  messages: ChatMessage[];
  onSendMessage: (content: string, type: 'text' | 'file', fileName?: string, fileSize?: string) => void;
  activeChannelName: string;
  isGroup: boolean;
  smsGatewayActive?: boolean;
  onSendSmsAlert?: (msg: string) => void;
}

export default function ChatWindow({
  language,
  currentUser,
  messages,
  onSendMessage,
  activeChannelName,
  isGroup,
  smsGatewayActive = false,
  onSendSmsAlert
}: ChatWindowProps) {
  const t = TRANSLATE_DICT[language];
  const [typedMsg, setTypedMsg] = useState('');
  const [showSmsBanner, setShowSmsBanner] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMsg.trim()) return;

    onSendMessage(typedMsg, 'text');
    setTypedMsg('');
  };

  const handleSimulateAttachment = (fileType: 'pdf' | 'img') => {
    if (fileType === 'pdf') {
      onSendMessage(
        'HSC_Syllabus_Physics_Draft2026.pdf',
        'file',
        'HSC_Syllabus_Physics_Draft2026.pdf',
        '2.4 MB'
      );
    } else {
      onSendMessage(
        'ClassNote_Electrostatics_Formulas.png',
        'file',
        'ClassNote_Electrostatics_Formulas.png',
        '840 KB'
      );
    }
  };

  const handleSmsBlast = () => {
    if (!typedMsg.trim() || !onSendSmsAlert) return;
    onSendSmsAlert(typedMsg);
    onSendMessage(typedMsg + " (SMS Sent to parents)", 'text');
    setTypedMsg('');
    setShowSmsBanner(true);
    setTimeout(() => setShowSmsBanner(false), 4000);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
      
      {/* Thread Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white font-semibold">
            {activeChannelName.slice(0, 2)}
          </div>
          <div>
            <h4 className="font-display font-semibold text-slate-900 dark:text-white text-base leading-tight">
              {activeChannelName}
            </h4>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-500 font-medium">
                {isGroup ? `${t.groupMessages}` : `${t.directMessages}`} • {t.online}
              </span>
            </div>
          </div>
        </div>

        {/* SMS gateway alert toggler (only for Teacher in Batch group chats) */}
        {currentUser.role === 'teacher' && isGroup && onSendSmsAlert && (
          <div className="relative">
            <button
              onClick={() => setShowSmsBanner(!showSmsBanner)}
              className="px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs font-semibold flex items-center space-x-1.5 hover:bg-amber-100 transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>SMS Gateway</span>
            </button>
          </div>
        )}
      </div>

      {showSmsBanner && currentUser.role === 'teacher' && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-100 dark:border-amber-900/40 px-6 py-3 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-2.5 animate-slide-down">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">{t.emergencyNotice}</span>: {t.smsWarning}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div 
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`max-w-[75%] flex flex-col space-y-1`}>
                {!isMe && (
                  <span className="text-[10px] text-slate-500 font-semibold ml-1.5">
                    {msg.senderName} ({msg.senderRole === 'teacher' ? t.teacher.split(' ')[0] : msg.senderRole === 'parent' ? t.parent.split(' ')[0] : t.student.split(' ')[0]})
                  </span>
                )}
                <div 
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isMe 
                      ? 'bg-brand-purple text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
                  }`}
                >
                  {msg.type === 'file' ? (
                    <div className="flex items-center space-x-3.5 py-1">
                      <div className={`p-2.5 rounded-xl ${isMe ? 'bg-white/10 text-white' : 'bg-brand-purple/10 text-brand-purple'}`}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-xs truncate max-w-[150px]">{msg.content}</p>
                        <p className={`text-[10px] ${isMe ? 'text-white/70' : 'text-slate-500'} font-mono`}>{msg.fileSize || 'Unknown Size'}</p>
                      </div>
                    </div>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
                <div className={`flex items-center space-x-1 justify-end text-[9px] text-slate-400 px-1`}>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && (
                    <div className="flex">
                      <CheckCheck className={`w-3.5 h-3.5 ${msg.isSeen ? 'text-cyan-500' : 'text-slate-400'}`} />
                      {msg.offlineSmsSent && (
                        <span className="ml-1 text-[8px] bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-1 rounded-sm">SMS</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Footer Box */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <form onSubmit={handleSend} className="space-y-3">
          <div className="flex items-center space-x-2">
            
            {/* Attachment Actions */}
            <div className="flex space-x-1.5">
              <button
                type="button"
                onClick={() => handleSimulateAttachment('img')}
                title="Attach Picture"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all flex items-center justify-center cursor-pointer"
                id="attach-pic-btn"
              >
                <Image className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleSimulateAttachment('pdf')}
                title="Attach Document PDF"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all flex items-center justify-center cursor-pointer"
                id="attach-pdf-btn"
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>

            {/* Input message field */}
            <input
              type="text"
              value={typedMsg}
              onChange={(e) => setTypedMsg(e.target.value)}
              placeholder={t.typingPlaceholder}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
              id="chat-message-input"
            />

            {/* Trigger Actions */}
            <div className="flex items-stretch space-x-1.5 self-center">
              {currentUser.role === 'teacher' && isGroup && typedMsg.length > 0 && onSendSmsAlert && (
                <button
                  type="button"
                  onClick={handleSmsBlast}
                  title="Force Offline SMS Deliver"
                  className="px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                  id="sms-blast-button"
                >
                  <span>SMS</span>
                </button>
              )}

              <button
                type="submit"
                disabled={!typedMsg.trim()}
                className="p-2.5 rounded-xl bg-brand-purple hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white transition-all shadow-md shadow-brand-purple/20 flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:shadow-none"
                id="chat-send-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        </form>
      </div>

    </div>
  );
}
