
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PiggyBank, Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Bill } from '@/lib/types';
import { useProfile } from '@/lib/firestore';
import { useAuth } from './auth-provider';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

export function SavingsManager({ bills }: { bills: Bill[] }) {
    const { profile, loading: profileLoading } = useProfile();
    const { user } = useAuth();
    const [tip, setTip] = useState('');
    const [tipLoading, setTipLoading] = useState(false);
    const [tipError, setTipError] = useState('');

    const totalBills = bills.filter(b => !b.isPaid).reduce((acc, bill) => acc + bill.amount, 0);
    const leftoverFunds = (profile?.income || 0) - totalBills - (profile?.savingsGoal || 0);

    const getTip = useCallback(async () => {
        if (!user || !profile || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) return;
        setTipLoading(true);
        setTipError('');
        try {
            const functionUrl = `https://us-central1-${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.cloudfunctions.net/getSavingsTips`;
            
            const idToken = await user.getIdToken();

            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    leftoverFunds: leftoverFunds,
                    currency: profile.currency,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to fetch savings tip');
            }

            const data = await response.json();
            setTip(data.tip);
        } catch (error: any) {
            console.error(error);
            setTipError(error.message || 'An unexpected error occurred.');
        } finally {
            setTipLoading(false);
        }
    }, [user, profile, leftoverFunds]);
    
    useEffect(() => {
        if (user && profile) {
            getTip();
        }
    }, [user, profile, getTip]);


    if (profileLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-2">
                    <Card className="min-h-full">
                         <CardHeader>
                             <Skeleton className="h-6 w-1/2" />
                             <Skeleton className="h-4 w-3/4" />
                         </CardHeader>
                         <CardContent>
                             <div className="flex items-center justify-center h-48">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                             </div>
                         </CardContent>
                    </Card>
                 </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Financials</CardTitle>
                        <CardDescription>You can adjust your monthly income and savings goal in settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="income">Monthly Income</Label>
                            <Input id="income" type="number" value={profile?.income || 0} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="savings-goal">Monthly Savings Goal</Label>
                            <Input id="savings-goal" type="number" value={profile?.savingsGoal || 0} disabled />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Leftover Funds</CardTitle>
                        <CardDescription>Estimated funds after all upcoming bills and savings for this month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-3xl font-bold font-headline ${leftoverFunds < 0 ? 'text-destructive' : 'text-primary'}`}>
                           R{leftoverFunds.toFixed(2)}
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card className="min-h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className='flex items-center gap-2'>
                                <PiggyBank className="text-accent" />
                                Savings Tip
                            </div>
                            <Button variant="ghost" size="icon" onClick={getTip} disabled={tipLoading}>
                                <RefreshCw className={cn("h-4 w-4", tipLoading && "animate-spin")} />
                            </Button>
                        </CardTitle>
                        <CardDescription>AI-powered suggestions to help you save.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center text-center rounded-lg min-h-48 bg-secondary/50 p-4">
                           {tipLoading ? (
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                           ) : tipError ? (
                                <Alert variant="destructive">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{tipError}</AlertDescription>
                                </Alert>
                           ) : (
                               <p className="font-semibold text-lg">{tip}</p>
                           )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
