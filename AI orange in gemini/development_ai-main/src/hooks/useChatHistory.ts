import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export function useChatHistory(chatId: string = 'default') {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const messagesRef = collection(db, 'users', user.uid, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedMessages.push({
          id: doc.id,
          role: data.role,
          content: data.content,
          timestamp: data.timestamp ? (data.timestamp as Timestamp).toDate() : new Date(),
        });
      });
      setMessages(fetchedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const addMessage = async (role: 'user' | 'assistant', content: string) => {
    const user = auth.currentUser;
    if (!user) return null;

    const messagesRef = collection(db, 'users', user.uid, 'chats', chatId, 'messages');
    const docRef = await addDoc(messagesRef, {
      role,
      content,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  };

  return { messages, loading, addMessage };
}
