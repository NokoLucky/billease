"use client";
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { bills as initialBills } from "@/lib/mock-data";
import { categories } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function RecentBills() {
    const [bills, setBills] = useState(initialBills.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()).slice(0, 5));

    const togglePaid = (id: string) => {
        setBills(bills.map(bill => bill.id === id ? { ...bill, isPaid: !bill.isPaid } : bill));
    };

    const getCategoryIcon = (categoryName: string) => {
        const category = categories.find(c => c.name === categoryName);
        return category ? <category.icon className="w-5 h-5" /> : null;
    }

    return (
        <Card>
            <CardContent className="p-0">
                <div className="divide-y divide-border">
                {bills.map(bill => (
                    <div key={bill.id} className={cn("flex items-center gap-4 p-4 transition-all duration-300", bill.isPaid && "bg-secondary/50")}>
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-secondary-foreground">
                            {getCategoryIcon(bill.category)}
                        </div>
                        <div className="flex-1">
                            <p className={cn("font-semibold", bill.isPaid && "line-through text-muted-foreground")}>{bill.name}</p>
                            <p className="text-sm text-muted-foreground">Due {format(new Date(bill.dueDate), 'MMM dd, yyyy')}</p>
                        </div>
                        <div className="text-right">
                           <p className={cn("font-bold text-lg", bill.isPaid && "line-through text-muted-foreground")}>${bill.amount.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center pl-4">
                            <Checkbox id={`paid-${bill.id}`} checked={bill.isPaid} onCheckedChange={() => togglePaid(bill.id)} className="w-6 h-6"/>
                            <label htmlFor={`paid-${bill.id}`} className="sr-only">Mark {bill.name} as paid</label>
                        </div>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
    )
}
