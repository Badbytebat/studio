
"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ContactMethod } from "@/lib/types";
import { Github, Linkedin, Mail, Instagram, Loader2, Send, Phone, User } from "lucide-react";
import { WhatsappIcon, KaggleIcon, HackerRankIcon, GeeksforGeeksIcon, LeetCodeIcon } from "@/components/layout/custom-icons";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { saveContactMessage } from '@/ai/flows/save-contact-message-flow';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});
type ContactFormData = z.infer<typeof formSchema>;


// Available icons: Mail, Linkedin, Github, Instagram, Whatsapp, Kaggle, HackerRank, GeeksforGeeks, LeetCode
const ICONS: { [key: string]: React.ElementType } = {
  Mail,
  Linkedin,
  Github,
  Instagram,
  Whatsapp: WhatsappIcon,
  Kaggle: KaggleIcon,
  HackerRank: HackerRankIcon,
  GeeksforGeeks: GeeksforGeeksIcon,
  LeetCode: LeetCodeIcon,
};

type AnimatedCardProps = {
  method: ContactMethod;
  index: number;
  formatHref: (url: string) => string;
  darkMode: boolean;
};

const AnimatedContactCard: React.FC<AnimatedCardProps> = ({ method, index, formatHref, darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const IconComponent = ICONS[method.icon] || Mail;

  const transition = darkMode 
    ? { duration: 0.8, delay: index * 0.1, ease: "easeOut" } 
    : { type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 };
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={transition}
    >
      <a href={formatHref(method.href)} target="_blank" rel="noopener noreferrer" className="block h-full">
        <Card key={method.id} className={cn(
          "text-center p-6 transition-all duration-300 h-full",
          darkMode
            ? "bg-card/50 border-primary/20 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 hover:scale-105 hover:-rotate-1"
            : "bg-card border light-card"
        )}>
            <CardContent className="flex flex-col items-center justify-center gap-4 p-0">
                <IconComponent className={cn("w-10 h-10 text-accent", !darkMode && "light-icon-pop")} style={{ animationDelay: `${index * 100}ms` }}/>
                <p className="font-bold text-lg">{method.label}</p>
                <p className="text-sm text-muted-foreground">{method.value}</p>
            </CardContent>
        </Card>
      </a>
    </motion.div>
  );
};


type Props = {
  data: ContactMethod[];
  editMode: boolean; // editMode is kept for potential future use but the form will be visible always
  updateEntry: (section: 'contact', id: number, field: string, value: any) => void;
  addEntry: (section: 'contact') => void;
  deleteEntry: (section: 'contact', id: number) => void;
  darkMode: boolean;
};

const ContactSection: React.FC<Props> = ({ data, editMode, darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ContactFormData) => {
    try {
      const result = await saveContactMessage(values);
      if (result.success) {
        toast({
          title: 'Message Sent!',
          description: result.message,
        });
        form.reset();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not send message. Please try again.',
      });
    }
  };
  
  const formatHref = (url: string = ''): string => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) {
      return url;
    }
    if (url.includes('@')) {
      return `mailto:${url}`;
    }
    return `https://${url}`;
  };

  const transition = darkMode 
    ? { duration: 0.8, ease: "easeOut" } 
    : { type: "spring", stiffness: 100, damping: 20 };

  return (
    <motion.section 
      ref={ref}
      id="contact" 
      className="py-20 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={transition}
    >
      <div className="max-w-4xl mx-auto text-center mb-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Contact Me
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {darkMode ? "Have a question or want to work together? Send a signal." : "Let's connect. I'm available for new opportunities."}
        </p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 sm:px-6 lg:px-8">
        {/* Contact Form */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -50 }} transition={{ ...transition, delay: 0.2 }}>
          <Card className={cn("p-6 sm:p-8 transition-all duration-300", darkMode ? "glass-effect" : "bg-card border")}>
            <CardContent className="p-0">
              <h3 className="text-2xl font-headline mb-6">Send a Direct Message</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Your Name" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                           <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="your.email@example.com" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                           <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="+1 (555) 123-4567" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell me how I can help you..." {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                     {isSubmitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                    Send Message
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Links */}
        <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 50 }} 
            transition={{ ...transition, delay: 0.4 }}
        >
          <h3 className="text-2xl font-headline text-center lg:text-left">...Or Find Me Here</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {data.map((method, index) => (
              <AnimatedContactCard
                key={method.id}
                method={method}
                index={index}
                formatHref={formatHref}
                darkMode={darkMode}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ContactSection;
