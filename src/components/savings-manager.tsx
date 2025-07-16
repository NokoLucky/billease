'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getSavingsTips, type SavingsTipsInput } from '@/ai/flows/savings-tips';
import { bills } from '@/lib/mock-data';
import { PiggyBank, Sparkles, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function SavingsManager() {
    const [income, setIncome] = useState(25000);
    const [savingsGoal, setSavingsGoal] = useState(2500);
    const [tips, setTips] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const upcomingBills = bills.filter(b => !b.isPaid).map(b => ({ name: b.name, amount: b.amount }));
    const totalBills = upcomingBills.reduce((acc, bill) => acc + bill.amount, 0);
    const leftoverFunds = income - totalBills - savingsGoal;

    const handleGetTips = () => {
        const input: SavingsTipsInput = {
            income,
            upcomingBills,
            savingsGoal,
        };
        startTransition(async () => {
            const result = await getSavingsTips(input);
            setTips(result.savingsTips);
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Financials</CardTitle>
                        <CardDescription>Adjust your monthly income and savings goal.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="income">Monthly Income</Label>
                            <Input id="income" type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="savings-goal">Monthly Savings Goal</Label>
                            <Input id="savings-goal" type="number" value={savingsGoal} onChange={(e) => setSavingsGoal(Number(e.target.value))} />
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={handleGetTips} disabled={isPending} className="w-full">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Get Savings Tips
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Leftover Funds</CardTitle>
                        <CardDescription>Estimated funds after bills and savings.</CardDescription>
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
                        <CardTitle className="flex items-center gap-2">
                            <PiggyBank className="text-accent" />
                            Smart Savings Tips
                        </CardTitle>
                        <CardDescription>AI-powered suggestions to help you reach your goals.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isPending && (
                             <div className="flex items-center justify-center h-48">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                             </div>
                        )}
                        {tips && !isPending && (
                            <Alert>
                                <Sparkles className="h-4 w-4" />
                                <AlertTitle>Your Personalized Tips!</AlertTitle>
                                <AlertDescription>
                                    <div className="prose-sm max-w-none prose-p:my-2"
                                         dangerouslySetInnerHTML={{ __html: tips.replace(/\n/g, '<br />') }} />
                                </AlertDescription>
                            </Alert>
                        )}
                        {!tips && !isPending && (
                            <div className="flex flex-col items-center justify-center text-center rounded-lg h-48 bg-secondary/50 p-4">
                                <p className="font-semibold">Ready for some advice?</p>
                                <p className="text-sm text-muted-foreground">Click "Get Savings Tips" to see what our AI suggests.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
