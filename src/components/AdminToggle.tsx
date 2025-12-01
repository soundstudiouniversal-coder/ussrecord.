
"use client";

import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function AdminToggle() {
  const { isAdmin, logout, userId } = useAdmin();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast({ title: "Logged Out", description: "You have been logged out." });
    router.push('/');
  };

  if (isAdmin) {
    return (
        <div className="flex items-center space-x-2 border border-primary p-1 rounded-full">
            <span className="text-xs px-2">User: <span className="font-bold">{userId.substring(0, 8)}...</span></span>
             <Button onClick={handleLogout} variant="ghost" className="btn-style text-xs h-8">
                Logout
            </Button>
        </div>
    );
  }

  return (
    <Link href="/login">
        <Button variant="ghost" className="btn-style text-xs h-8">
            Admin Login
        </Button>
    </Link>
  );
}
