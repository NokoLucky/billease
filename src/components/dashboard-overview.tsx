
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import type { Bill } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";

type DashboardOverviewProps = {
  bills: Bill[];
  loading: boolean;
}

export function DashboardOverview({ bills, loading }: DashboardOverviewProps) {
  const upcomingBills = bills.filter(b => !b.isPaid && new Date(b.dueDate) >= new Date());
  
  const nextDueBill = upcomingBills.length > 0 ? upcomingBills.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0] : null;

  const totalUpcoming = upcomingBills.reduce((acc, bill) => acc + bill.amount, 0);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Next Due Bill</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
        <Card className="flex items-center justify-center bg-primary/10 border-dashed" data-ai-hint="savings chart">
          <div className="text-center">
              <p className="font-semibold text-primary">Savings Goal Progress</p>
              <p className="text-sm text-muted-foreground">Coming Soon</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Next Due Bill</CardTitle>
        </CardHeader>
        <CardContent>
          {nextDueBill ? (
            <>
              <p className="text-2xl font-bold font-headline">R{nextDueBill.amount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">{nextDueBill.name} - Due {format(new Date(nextDueBill.dueDate), 'PPP')}</p>
            </>
          ) : (
            <p className="text-muted-foreground">No upcoming bills!</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Upcoming</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold font-headline">R{totalUpcoming.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">{upcomingBills.length} bills remaining</p>
        </CardContent>
      </Card>
      <Card className="flex items-center justify-center bg-primary/10 border-dashed" data-ai-hint="savings chart">
        <div className="text-center">
            <p className="font-semibold text-primary">Savings Goal Progress</p>
            <p className="text-sm text-muted-foreground">Coming Soon</p>
        </div>
      </Card>
    </div>
  );
}
