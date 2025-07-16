import type { LucideIcon } from 'lucide-react';

export type BillCategory = 'Housing' | 'Utilities' | 'Transportation' | 'Groceries' | 'Subscription' | 'Other';

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // ISO string
  category: BillCategory;
  isPaid: boolean;
  frequency: 'monthly' | 'yearly' | 'one-time';
}

export interface Category {
  name: BillCategory;
  icon: LucideIcon;
}
