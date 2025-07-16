'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { bills as mockBills, categories } from '@/lib/mock-data';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from './ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Bill } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function BillsTable() {
    const [bills, setBills] = useState<Bill[]>(mockBills);
    const [filter, setFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Bill, direction: 'asc' | 'desc' } | null>({ key: 'dueDate', direction: 'asc' });

    const handleSort = (key: keyof Bill) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedBills = useMemo(() => {
        let sortableItems = [...bills];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [bills, sortConfig]);

    const filteredBills = useMemo(() => {
        return sortedBills.filter(bill => {
            const nameMatch = bill.name.toLowerCase().includes(filter.toLowerCase());
            const categoryMatch = categoryFilter === 'All' || bill.category === categoryFilter;
            return nameMatch && categoryMatch;
        });
    }, [sortedBills, filter, categoryFilter]);
    
    const togglePaid = (id: string) => {
        setBills(bills.map(bill => bill.id === id ? { ...bill, isPaid: !bill.isPaid } : bill));
    };
    
    const getCategoryIcon = (categoryName: string) => {
        const category = categories.find(c => c.name === categoryName);
        return category ? <category.icon className="w-5 h-5 mr-2" /> : null;
    }

  return (
    <div className="w-full">
        <div className="flex flex-col md:flex-row items-center gap-4 py-4">
            <Input
                placeholder="Filter bills by name..."
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="w-full md:max-w-sm"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        
        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
            {filteredBills.map(bill => (
                 <Card key={bill.id} data-state={bill.isPaid ? "selected" : ""}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">{bill.name}</CardTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => togglePaid(bill.id)}>
                                    {bill.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Edit Bill</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete Bill</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                             <Badge variant={bill.isPaid ? 'secondary' : 'destructive'}>
                                {bill.isPaid ? 'Paid' : 'Due'}
                            </Badge>
                             <p className="font-bold font-mono text-lg">R{bill.amount.toFixed(2)}</p>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-2">
                             <div className="flex items-center">
                                {getCategoryIcon(bill.category)}
                                {bill.category}
                            </div>
                            <p>Due: {format(new Date(bill.dueDate), 'MMM dd, yyyy')}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* Desktop Table View */}
        <Card className="hidden md:block">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('name')}>
                                Bill
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('category')}>
                                Category
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead className="text-right">
                             <Button variant="ghost" onClick={() => handleSort('amount')}>
                                Amount
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>
                             <Button variant="ghost" onClick={() => handleSort('dueDate')}>
                                Due Date
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredBills.map(bill => (
                        <TableRow key={bill.id} data-state={bill.isPaid ? "selected" : ""}>
                            <TableCell>
                                <Badge variant={bill.isPaid ? 'secondary' : 'destructive'}>
                                    {bill.isPaid ? 'Paid' : 'Due'}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{bill.name}</TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    {getCategoryIcon(bill.category)}
                                    {bill.category}
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">R{bill.amount.toFixed(2)}</TableCell>
                            <TableCell>{format(new Date(bill.dueDate), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => togglePaid(bill.id)}>
                                            {bill.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Edit Bill</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Delete Bill</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    </div>
  );
}
