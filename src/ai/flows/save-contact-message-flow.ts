'use server';
/**
 * @fileOverview A flow for saving a contact message to Firestore.
 *
 * - saveContactMessage - A function that saves a contact form submission.
 * - ContactFormInput - The input type for the saveContactMessage function.
 * - ContactFormOutput - The return type for the saveContactMessage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ContactFormInputSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});
export type ContactFormInput = z.infer<typeof ContactFormInputSchema>;

const ContactFormOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type ContactFormOutput = z.infer<typeof ContactFormOutputSchema>;

export async function saveContactMessage(
  input: ContactFormInput
): Promise<ContactFormOutput> {
  return saveContactMessageFlow(input);
}

const saveContactMessageFlow = ai.defineFlow(
  {
    name: 'saveContactMessageFlow',
    inputSchema: ContactFormInputSchema,
    outputSchema: ContactFormOutputSchema,
  },
  async (data) => {
    try {
      const contactMessagesRef = collection(db, 'contacts');
      const newContactDocRef = doc(contactMessagesRef);

      await setDoc(newContactDocRef, {
        ...data,
        createdAt: serverTimestamp(),
        read: false,
      });

      return {
        success: true,
        message: 'Message sent successfully! Ritesh will get back to you soon.',
      };
    } catch (error) {
      console.error('Error saving contact message:', error);
      return {
        success: false,
        message: 'There was an error sending your message. Please try again later.',
      };
    }
  }
);
