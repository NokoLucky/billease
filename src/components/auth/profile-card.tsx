
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { getAuth, signOut } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogOut } from 'lucide-react';


export function ProfileCard() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    const auth = getAuth(firebaseApp);
    await signOut(auth);
    router.push('/auth/signin');
  };
  
  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-4'>
            <Avatar>
                <AvatarImage src={user.photoURL ?? undefined} />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
                 <CardTitle>{user.displayName || 'Welcome!'}</CardTitle>
                 <CardDescription>{user.email}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>Manage your profile details and settings here.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handleSignOut}>
            <LogOut className='mr-2' />
            Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
}
