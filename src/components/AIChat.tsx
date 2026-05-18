import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatHistory, ChatMessage } from '../hooks/useChatHistory';
import { useChatList } from '../hooks/useChatList';
import ChatSidebar from './ChatSidebar';
import { streamChatCompletionViaProxy } from '../lib/api-proxy';
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
  Menu,
  X,
  LogOut,
  Mic,
  MicOff,
} from 'lucide-react';
import { auth } from '../lib/firebase';

interface AIChatProps {
  onNavigate?: (page: string) => void;
}

const CodeBlock: React.FC<{ code: string; language?: string }> = ({
  code,
  language = 'javascript',
}) => {
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
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```([\w+])?\n?([\s\S]*?)```/);
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

      let processed = part
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(
          /`(.*?)`/g,
          '<code class="px-1 py-0.5 rounded bg-orange-100 text-primary">$1</code>'
        );

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
                <div
                  className={`text-sm sm:text-base whitespace-pre-wrap ${
                    message.role === 'assistant'
                      ? 'text-gray-700'
                      : 'text-white'
                  }`}
                >
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
                  <button
                    onClick={handleCopy}
                    className={`p-1.5 rounded-lg transition-colors ${
                      copied
                        ? 'text-green-600 bg-green-50 border border-green-100'
                        : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
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

const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  userEmail?: string;
}> = ({ isOpen, onClose, onLogout, userEmail }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end pt-20"
        >
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-xs mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-orange-100">
              <h2 className="font-sora font-semibold text-gray-900">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* User Info */}
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">Account</p>
                    <p className="text-xs text-gray-500 truncate">
                      {userEmail || 'User'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AIChat: React.FC<AIChatProps> = ({ onNavigate }) => {
  const [chatId, setChatId] = useState('default_chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [modelType, setModelType] = useState<'default' | 'reasoning' | 'fast' | 'lite'>('default');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const { messages, loading, addMessage } = useChatHistory(chatId);
  const { chats, createChat, renameChat, deleteChat, updateChatPreview } =
    useChatList();

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const streamingContentRef = useRef('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-resize input textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, isTyping]);

  const handleNewChat = async () => {
    const newChatId = await createChat('New Chat');
    if (newChatId) {
      setChatId(newChatId);
      setSidebarOpen(false);
    }
  };

  const handleSelectChat = (id: string) => {
    setChatId(id);
    setSidebarOpen(false);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);
    streamingContentRef.current = '';
    setStreamingContent('');

    try {
      await addMessage('user', currentInput);

      // Update chat preview
      const preview = currentInput.substring(0, 50);
      await updateChatPreview(chatId, preview);

      await streamChatCompletionViaProxy({
        prompt: currentInput,
        modelType,
        onChunk: (chunk) => {
          setIsTyping(false);
          streamingContentRef.current += chunk;
          setStreamingContent(streamingContentRef.current);
        },
        onFinish: async () => {
          if (streamingContentRef.current) {
            await addMessage('assistant', streamingContentRef.current);
          }
          setStreamingContent('');
          streamingContentRef.current = '';
        },
        onError: async (error) => {
          console.error('Streaming error:', error);
          setIsTyping(false);
          setStreamingContent('');
          await addMessage(
            'assistant',
            `⚠️ Error: ${error.message || 'Failed to connect to AI.'}`
          );
        },
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      setIsTyping(false);
      setStreamingContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in your browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInputValue((prev) => {
          const space = prev.endsWith(' ') || prev.length === 0 ? '' : ' ';
          return prev + space + transcript;
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      if (onNavigate) onNavigate('auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const quickActions = [
    { icon: <Code className="w-4 h-4" />, label: 'Write Code' },
    { icon: <FileText className="w-4 h-4" />, label: 'Explain' },
    { icon: <Sparkles className="w-4 h-4" />, label: 'Optimize' },
    { icon: <FileText className="w-4 h-4" />, label: 'Debug' },
  ];

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-white">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r border-orange-100">
        <ChatSidebar
          chats={chats}
          activeChat={chatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={deleteChat}
          onRenameChat={renameChat}
        />
      </div>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div
              className="absolute left-0 top-0 h-full w-64 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <ChatSidebar
                chats={chats}
                activeChat={chatId}
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
                onDeleteChat={deleteChat}
                onRenameChat={renameChat}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-orange-100 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-orange-50 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-500" />
              ) : (
                <Menu className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-accent">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-sora font-semibold text-gray-900">AI Chat</h2>
              <p className="text-xs text-gray-500">Powered by Mani AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-orange-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-primary shadow-sm hover:border-orange-300 transition-colors cursor-pointer font-medium"
            >
              <option value="default">✨ Gemini 2.5 Flash</option>
              <option value="reasoning">🧠 Gemini 2.5 Pro</option>
              <option value="fast">⚡ Gemini 2.0 Flash</option>
              <option value="lite">🎈 Gemini 2.5 Lite</option>
            </select>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl bg-orange-50 border border-orange-200 text-gray-500 hover:text-orange-600 transition-colors"
            >
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
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-200 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-colors whitespace-nowrap"
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
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              className="w-full px-4 py-3 pr-24 bg-orange-50 border border-orange-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary resize-none transition-[height] duration-100"
              style={{ minHeight: '48px', maxHeight: '160px', height: 'auto' }}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
              <button
                onClick={handleVoiceInput}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-200 scale-105'
                    : 'bg-orange-50 border border-orange-200 text-gray-500 hover:text-orange-600 hover:bg-orange-100'
                }`}
                title={isListening ? "Listening... click to stop" : "Speak to type"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="p-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Mani AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onLogout={handleLogout}
        userEmail={auth.currentUser?.email || undefined}
      />
    </div>
  );
};

export default AIChat;
