
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { getContactMessages, updateContactMessage, deleteContactMessage } from '@/lib/firestore';
import type { ContactMessage } from '@/lib/types';
import { Loader2, Inbox, Trash2, Pin, PinOff, Eye, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedMessages = await getContactMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not load messages.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchMessages();
      } else {
        router.push('/'); // Redirect to home if not logged in
      }
    }
  }, [user, authLoading, router, fetchMessages]);

  const handleTogglePin = async (id: string, isPinned: boolean) => {
    try {
      await updateContactMessage(id, { isPinned: !isPinned });
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, isPinned: !isPinned } : msg));
      toast({ description: `Message ${!isPinned ? 'pinned' : 'unpinned'}.` });
    } catch {
      toast({ variant: 'destructive', description: 'Failed to update pin status.' });
    }
  };
  
  const handleToggleRead = async (id: string, isRead: boolean) => {
    try {
      await updateContactMessage(id, { isRead: !isRead });
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, isRead: !isRead } : msg));
      toast({ description: `Message marked as ${!isRead ? 'read' : 'unread'}.` });
    } catch {
       toast({ variant: 'destructive', description: 'Failed to update read status.' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContactMessage(id);
      setMessages(prev => prev.filter(msg => msg.id !== id));
      toast({ description: 'Message deleted.' });
    } catch {
       toast({ variant: 'destructive', description: 'Failed to delete message.' });
    }
  };

  const sortedMessages = [...messages].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.createdAt.seconds > b.createdAt.seconds) return -1;
      if (a.createdAt.seconds < b.createdAt.seconds) return 1;
      return 0;
  });

  if (authLoading || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <div className="container mx-auto p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h1 className="text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4 sm:mb-0">
            Message Dashboard
            </h1>
            <Button onClick={() => router.push('/')}>Back to Portfolio</Button>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-20">
            <Inbox className="mx-auto h-24 w-24 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-semibold">Inbox is Empty</h2>
            <p className="mt-2 text-muted-foreground">You have no new messages at this time.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedMessages.map(msg => (
              <Card key={msg.id} className={`glass-effect ${msg.isRead ? 'opacity-60' : ''} ${msg.isPinned ? 'border-accent' : 'border-primary/20'}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">{msg.name}</CardTitle>
                        <CardDescription>{msg.email}</CardDescription>
                         {msg.phone && <CardDescription>{msg.phone}</CardDescription>}
                    </div>
                    <Badge variant={msg.aiAssessment.classification === 'Useful' ? 'secondary' : 'destructive'}>
                      {msg.aiAssessment.classification}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm italic text-muted-foreground">
                    &quot;{msg.aiAssessment.reasoning}&quot;
                  </p>
                  <p className="mb-4">{msg.message}</p>
                  <p className="text-xs text-muted-foreground text-right">
                    Received on {format(new Date(msg.createdAt.seconds * 1000), 'PPP p')}
                  </p>
                  <div className="mt-4 flex justify-end gap-2 border-t border-border/20 pt-4">
                    <Button variant="ghost" size="icon" onClick={() => handleTogglePin(msg.id, msg.isPinned)}>
                      {msg.isPinned ? <PinOff className="w-4 h-4 text-accent"/> : <Pin className="w-4 h-4"/>}
                    </Button>
                     <Button variant="ghost" size="icon" onClick={() => handleToggleRead(msg.id, msg.isRead)}>
                      {msg.isRead ? <Eye className="w-4 h-4"/> : <Check className="w-4 h-4 text-green-500"/>}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the message from your database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(msg.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
