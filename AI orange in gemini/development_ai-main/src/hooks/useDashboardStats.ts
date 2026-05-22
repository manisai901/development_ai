import { useState, useEffect } from 'react';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface DashboardStats {
  totalChats: number;
  tokensUsed: number;
  activeSessions: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalChats: 0,
    tokensUsed: 0, // In a real app, this would be aggregated in a user document
    activeSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch total number of chat documents for this user
        const chatsRef = collection(db, 'users', user.uid, 'chats');
        const snapshot = await getCountFromServer(chatsRef);
        const chatCount = snapshot.data().count;

        // Note: For tokens and other complex aggregations, you typically maintain 
        // a running total in the user's root document (e.g., users/{userId}) via Cloud Functions
        // rather than summing up all messages on the client side.

        setStats({
          totalChats: chatCount,
          tokensUsed: 0, // Placeholder
          activeSessions: 1, // Placeholder
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}
