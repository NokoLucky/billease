'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from './ui/switch';

export function SettingsForm() {
  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Currency</CardTitle>
                <CardDescription>Select your default display currency.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="max-w-xs">
                    <Label htmlFor="currency" className="sr-only">Currency</Label>
                    <Select defaultValue="USD">
                        <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USD">USD - United States Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="due-soon" className="font-medium">Bills Due Soon</Label>
                    <Switch id="due-soon" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="bill-paid" className="font-medium">Bill Paid Confirmation</Label>
                    <Switch id="bill-paid" defaultChecked />
                </div>
                 <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="savings-tips" className="font-medium">Weekly Savings Tips</Label>
                    <Switch id="savings-tips" />
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button>Save Preferences</Button>
        </div>
    </div>
  );
}
