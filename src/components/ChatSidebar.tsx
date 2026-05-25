import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chat } from '../hooks/useChatList';
import { Logo } from './Navbar';
import {
  Trash2,
  Plus,
  MoreHorizontal,
  Edit2,
  Check,
  X,
  Home,
} from 'lucide-react';

interface ChatSidebarProps {
  chats: Chat[];
  activeChat?: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newName: string) => void;
  onNavigate?: (page: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onNavigate,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleRenameClick = (chat: Chat) => {
    setEditingId(chat.id);
    setEditingName(chat.name);
    setOpenMenuId(null);
  };

  const handleSaveRename = (chatId: string) => {
    if (editingName.trim()) {
      onRenameChat(chatId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-orange-100">
      {/* Brand Header */}
      <div className="p-4 border-b border-orange-100 flex items-center justify-between">
        <button
          onClick={() => onNavigate && onNavigate('landing')}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <Logo size="sm" />
          <span className="font-sora font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">
            Mani AI
          </span>
        </button>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-orange-100">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity font-medium"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            No chats yet. Create one to get started!
          </div>
        ) : (
          <div className="space-y-2 p-2">
            <AnimatePresence>
              {chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="group"
                >
                  {editingId === chat.id ? (
                    <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-xl border border-primary/30">
                      <input
                        autoFocus
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(chat.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="flex-1 bg-transparent border-0 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
                        placeholder="Chat name..."
                      />
                      <button
                        onClick={() => handleSaveRename(chat.id)}
                        className="p-1 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => onSelectChat(chat.id)}
                      className={`relative p-3 rounded-xl cursor-pointer transition-all ${
                        activeChat === chat.id
                          ? 'bg-primary/10 border border-primary/30'
                          : 'hover:bg-orange-50 border border-transparent'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                          {chat.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {chat.preview}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(chat.updatedAt)}
                        </p>
                      </div>

                      {/* Menu */}
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(
                                openMenuId === chat.id ? null : chat.id
                              );
                            }}
                            className="p-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </button>

                          {/* Dropdown Menu */}
                          <AnimatePresence>
                            {openMenuId === chat.id && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 top-full mt-1 bg-white border border-orange-100 rounded-lg shadow-lg z-50 min-w-[150px]"
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRenameClick(chat);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors border-b border-orange-50"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Rename
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteChat(chat.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Go to Dashboard */}
      {onNavigate && (
        <div className="p-4 border-t border-orange-100 bg-orange-50/30 flex-shrink-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-orange-200 text-gray-700 hover:bg-orange-50 hover:text-primary transition-all font-semibold text-sm shadow-sm"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
