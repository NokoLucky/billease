
'use client';

import React from 'react';
import { db, firebaseApp } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import type { Bill, BillInput } from './types';
import { getAuth } from 'firebase/auth';

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
    // Firestore will automatically convert the JS Date object to a Timestamp.
    await addDoc(billsCollection, bill);
};

export const updateBill = async (userId: string, billId: string, updates: Partial<Bill>) => {
    const billDoc = doc(db, 'users', userId, 'bills', billId);
    await updateDoc(billDoc, updates);
};

export const deleteBill = async (userId: string, billId: string) => {
    const billDoc = doc(db, 'users', userId, 'bills', billId);
    await deleteDoc(billDoc);
};

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

    return { bills, loading, error, refetch, user };
}
