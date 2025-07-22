
'use client';

import React from 'react';
import { db, firebaseApp } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp, setDoc, getDoc } from 'firebase/firestore';
import type { Bill, BillInput, UserProfile } from './types';
import { getAuth } from 'firebase/auth';

// Bills functions
const getBillsCollection = (userId: string) => {
    return collection(db, 'users', userId, 'bills');
}

export const getBills = async (userId: string): Promise<Bill[]> => {
    const billsCollection = getBillsCollection(userId);
    const snapshot = await getDocs(billsCollection);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            dueDate: (data.dueDate as Timestamp).toDate().toISOString(),
        } as Bill;
    });
};

export const addBill = async (userId: string, bill: BillInput) => {
    const billsCollection = getBillsCollection(userId);
    const billWithTimestamp = {
        ...bill,
        dueDate: Timestamp.fromDate(bill.dueDate)
    };
    await addDoc(billsCollection, billWithTimestamp);
};

export const updateBill = async (userId: string, billId: string, updates: Partial<Omit<Bill, 'id' | 'dueDate'> & { dueDate?: Date }>) => {
    const billDoc = doc(db, 'users', userId, 'bills', billId);
    const updateData: { [key: string]: any } = { ...updates };
    if (updates.dueDate) {
        updateData.dueDate = Timestamp.fromDate(updates.dueDate);
    }
    await updateDoc(billDoc, updateData);
};

export const deleteBill = async (userId: string, billId: string) => {
    const billDoc = doc(db, 'users', userId, 'bills', billId);
    await deleteDoc(billDoc);
};

// Profile functions
const getProfileDoc = (userId: string) => {
    return doc(db, 'users', userId);
}

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
    const profileDoc = await getDoc(getProfileDoc(userId));
    if (profileDoc.exists()) {
        const data = profileDoc.data() as UserProfile;
        // Ensure notifications object exists
        if (!data.notifications) {
            data.notifications = { dueSoon: true, paidConfirmation: true, savingsTips: false };
        }
        return data;
    }
    // Return default profile if none exists
    return { 
        income: 25000, 
        savingsGoal: 2500, 
        currency: 'ZAR',
        notifications: {
            dueSoon: true,
            paidConfirmation: true,
            savingsTips: false,
        }
    };
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
    await setDoc(getProfileDoc(userId), updates, { merge: true });
}

// Hooks
export const useBills = () => {
    const [bills, setBills] = React.useState<Bill[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    const refetch = React.useCallback(async () => {
        if (!user) {
            setBills([]);
            setLoading(false);
            return;
        };
        setLoading(true);
        try {
            const userBills = await getBills(user.uid);
            setBills(userBills);
        } catch (e) {
            setError(e as Error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    React.useEffect(() => {
        refetch();
    }, [refetch]);

    return { bills, loading, error, refetch };
}

export const useProfile = () => {
    const [profile, setProfile] = React.useState<UserProfile | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    const refetch = React.useCallback(async () => {
        if (!user) {
            setProfile(null);
            setLoading(false);
            return;
        };
        setLoading(true);
        try {
            const userProfile = await getUserProfile(user.uid);
            setProfile(userProfile);
        } catch (e) {
            setError(e as Error);
        } finally {
            setLoading(false);
        }
    }, [user]);
    
    const update = async (updates: Partial<UserProfile>) => {
        if (!user) return;
        await updateUserProfile(user.uid, updates);
        refetch();
    }

    React.useEffect(() => {
        refetch();
    }, [refetch]);

    return { profile, loading, error, refetch, update };
}
