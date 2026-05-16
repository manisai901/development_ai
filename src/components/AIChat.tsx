import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatHistory, ChatMessage } from '../hooks/useChatHistory';
import { streamChatCompletion } from '../lib/api';
import {
  Send,
  Copy,
  Check,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Settings,
  RefreshCw,
  User,
  Bot,
  Code,
  FileText,
  Sparkles,
  Plus,

interface AIChatProps {
  onNavigate?: (page: string) => void;
}

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-orange-50 border border-orange-200 text-gray-500 hover:text-orange-600 transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="bg-orange-50 rounded-xl p-4 overflow-x-auto border border-orange-100">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-orange-200">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-gray-500 ml-2">{language}</span>
        </div>
        <pre className="text-sm">
          <code className="text-gray-700">{code}</code>
        </pre>
      </div>
    </div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: 'reverse',
          delay: i * 0.2,
        }}
        className="w-2 h-2 rounded-full bg-primary"
      />
    ))}
  </div>
);

const MessageBubble: React.FC<{ message: ChatMessage; onCopyCode?: () => void }> = ({
  message,
  onCopyCode,
}) => {
  const [liked, setLiked] = useState<boolean | null>(null);

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
        if (match) {
          return (
            <CodeBlock
              key={index}
              code={match[2]}
              language={match[1] || 'javascript'}
            />
          );
        }
      }

      // Simple bold and italic handling
      let processed = part
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-orange-100 text-primary">$1</code>');

      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{ __html: processed }}
          className="leading-relaxed"
        />
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] lg:max-w-[70%] ${
          message.role === 'user' ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`flex gap-3 ${
            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-primary to-accent'
                : 'bg-gradient-to-r from-amber-400 to-orange-400'
            }`}
          >
            {message.role === 'user' ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-white" />
            )}
          </div>

          <div className="space-y-2">
            <div
              className={`px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-primary to-orange-500 text-white rounded-tr-md'
                  : 'bg-white rounded-tl-md border border-orange-100 shadow-sm'
              }`}
            >
              {message.isTyping ? (
                <TypingIndicator />
              ) : (
                <div className={`text-sm sm:text-base whitespace-pre-wrap ${message.role === 'assistant' ? 'text-gray-700' : 'text-white'}`}>
                  {renderContent(message.content)}
                </div>
              )}
            </div>

            <div
              className={`flex items-center gap-2 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <span className="text-xs text-gray-400">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>

              {message.role === 'assistant' && !message.isTyping && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setLiked(true)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      liked === true
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLiked(false)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      liked === false
                        ? 'text-red-500 bg-red-50'
                        : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AIChat: React.FC<AIChatProps> = ({ onNavigate }) => {
  const [chatId, setChatId] = useState('default_chat');
  const { messages, loading, addMessage } = useChatHistory(chatId);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const streamingContentRef = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, isTyping]);

  const handleNewChat = () => {
    setChatId('chat_' + Date.now().toString());
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);
    streamingContentRef.current = '';
    setStreamingContent('');

    try {
      // Add user message to Firestore
      await addMessage('user', currentInput);

      await streamChatCompletion(
        currentInput,
        (chunk) => {
          setIsTyping(false);
          streamingContentRef.current += chunk;
          setStreamingContent(streamingContentRef.current);
        },
        async () => {
          if (streamingContentRef.current) {
            await addMessage('assistant', streamingContentRef.current);
          }
          setStreamingContent('');
          streamingContentRef.current = '';
        },
        async (error) => {
          console.error('Streaming error:', error);
          setIsTyping(false);
          setStreamingContent('');
          await addMessage('assistant', `⚠️ Error: ${error.message || 'Failed to connect to AI. Please check your API key and connection.'}`);
        }
      );
    } catch (error: any) {
      console.error('Chat error:', error);
      setIsTyping(false);
      setStreamingContent('');
      // We can't save the error to Firestore if Firestore itself is failing, so we use local state or just alert.
      // But we will try to add it just in case it was a different kind of error.
      try {
        await addMessage('assistant', `⚠️ Database Error: ${error.message || 'Failed to save message. Check Firestore Security Rules.'}`);
      } catch (e) {
        alert(`Failed to send message: ${error.message || 'Check Firestore Security Rules (Test Mode needed).'}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { icon: <Code className="w-4 h-4" />, label: 'Write Code' },
    { icon: <FileText className="w-4 h-4" />, label: 'Explain' },
    { icon: <Sparkles className="w-4 h-4" />, label: 'Optimize' },
    { icon: <FileText className="w-4 h-4" />, label: 'Debug' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-orange-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-accent">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-sora font-semibold text-gray-900">AI Chat</h2>
            <p className="text-xs text-gray-500">Powered by Mani AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleNewChat}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
          <button className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-gray-500 hover:text-orange-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-orange-50/30">
        {!loading && messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {streamingContent && (
          <MessageBubble
            message={{
              id: 'streaming',
              role: 'assistant',
              content: streamingContent,
              timestamp: new Date(),
            }}
          />
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl border border-orange-100 shadow-sm">
                <TypingIndicator />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {quickActions.map((action, i) => (
            <button
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-200 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors whitespace-nowrap shadow-sm"
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-orange-100 bg-white">
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="w-full px-4 py-3 pr-12 bg-orange-50 border border-orange-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary resize-none"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="absolute right-2 bottom-2 p-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Mani AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default AIChat;