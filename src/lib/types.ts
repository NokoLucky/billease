
import type { LucideIcon } from 'lucide-react';

export type BillCategory = 'Housing' | 'Utilities' | 'Transportation' | 'Groceries' | 'Subscription' | 'Other';

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // ISO string for client-side use
  category: BillCategory;
  isPaid: boolean;
  frequency: 'monthly' | 'yearly' | 'one-time';
}

// For adding/updating bills, dueDate can be a Date object for Firestore
export interface BillInput extends Omit<Bill, 'id' | 'dueDate'> {
    dueDate: Date;
}


export interface Category {
  name: BillCategory;
  icon: LucideIcon;
}
