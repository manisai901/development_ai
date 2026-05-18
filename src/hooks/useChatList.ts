import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
  getDocs,
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export interface Chat {
  id: string;
  name: string;
  preview: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

export function useChatList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setChats([]);
      setLoading(false);
      return;
    }

    const chatsRef = collection(db, 'users', user.uid, 'chats');
    const q = query(chatsRef, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedChats: Chat[] = [];

      for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data();

        // Get message count
        const messagesRef = collection(
          db,
          'users',
          user.uid,
          'chats',
          docSnapshot.id,
          'messages'
        );
        const messagesSnapshot = await getDocs(messagesRef);

        fetchedChats.push({
          id: docSnapshot.id,
          name: data.name || 'Untitled Chat',
          preview: data.preview || 'No messages yet',
          createdAt: data.createdAt
            ? (data.createdAt as Timestamp).toDate()
            : new Date(),
          updatedAt: data.updatedAt
            ? (data.updatedAt as Timestamp).toDate()
            : new Date(),
          messageCount: messagesSnapshot.size,
        });
      }

      setChats(fetchedChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createChat = async (name: string = 'New Chat'): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) return null;

    const chatsRef = collection(db, 'users', user.uid, 'chats');
    const docRef = await addDoc(chatsRef, {
      name,
      preview: 'No messages yet',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  };

  const renameChat = async (chatId: string, newName: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const chatRef = doc(db, 'users', user.uid, 'chats', chatId);
    await setDoc(chatRef, {
      name: newName,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  };

  const deleteChat = async (chatId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    // Delete all messages in the chat first
    const messagesRef = collection(
      db,
      'users',
      user.uid,
      'chats',
      chatId,
      'messages'
    );
    const messagesSnapshot = await getDocs(messagesRef);
    for (const messageDoc of messagesSnapshot.docs) {
      await deleteDoc(messageDoc.ref);
    }

    // Delete the chat
    const chatRef = doc(db, 'users', user.uid, 'chats', chatId);
    await deleteDoc(chatRef);
  };

  const updateChatPreview = async (
    chatId: string,
    preview: string
  ) => {
    const user = auth.currentUser;
    if (!user) return;

    const chatRef = doc(db, 'users', user.uid, 'chats', chatId);
    await setDoc(chatRef, {
      preview,
      name: chatId === 'default_chat' ? 'Default Chat' : 'New Chat',
      updatedAt: serverTimestamp(),
    }, { merge: true });
  };

  return { chats, loading, createChat, renameChat, deleteChat, updateChatPreview };
}
