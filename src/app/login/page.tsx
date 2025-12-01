
'use client';
import { useState } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAdmin();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      toast({ title: 'Login Successful', description: 'Welcome, Admin!' });
      router.push('/');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid username or password.',
      });
    }
  };

  return (
    <main className="flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 uppercase border-b pb-2 border-primary text-center">
          ADMIN // Login
        </h2>
        <form
          onSubmit={handleLogin}
          className="space-y-6 p-6 border border-primary rounded-lg"
        >
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <Button type="submit" className="btn-style w-full">
            Sign In
          </Button>
        </form>
      </div>
    </main>
  );
}
