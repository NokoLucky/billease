
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ReceiptText,
  Calendar,
  PiggyBank,
  BarChart3,
  Settings,
  Wallet,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Separator } from './ui/separator';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/bills', label: 'Bills', icon: ReceiptText },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/savings', label: 'Savings', icon: PiggyBank },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];

const settingsItem = { href: '/settings', label: 'Settings', icon: Settings };

export function SideNav() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Wallet className="w-8 h-8 text-primary" />
          <h1
            className={cn(
              'font-bold text-xl transition-opacity duration-200 font-headline',
              state === 'collapsed' && 'opacity-0'
            )}
          >
            BillEase
          </h1>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarMenu className="flex-1">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={item.label}
                as="a"
              >
                  <item.icon />
                  <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter>
         <Separator className="mb-2"/>
         <SidebarMenu>
            <SidebarMenuItem>
                <Link href={settingsItem.href} passHref>
                <SidebarMenuButton
                    isActive={pathname === settingsItem.href}
                    tooltip={settingsItem.label}
                    as="a"
                >
                    <settingsItem.icon />
                    <span>{settingsItem.label}</span>
                </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
