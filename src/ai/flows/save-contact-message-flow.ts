'use server';
/**
 * @fileOverview A flow for saving a contact message to Firestore after AI evaluation.
 *
 * - saveContactMessage - A function that evaluates and saves a contact form submission.
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

const AIEvaluationSchema = z.object({
  classification: z.enum(['Useful', 'Spam']).describe("Classify the message as 'Useful' or 'Spam'."),
  reasoning: z.string().describe("A brief explanation for the classification."),
});

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
      // Step 1: Evaluate the message with AI
      const { output: evaluation } = await ai.generate({
          prompt: `You are a highly intelligent spam filter for a professional portfolio contact form.
          Analyze the following message and classify it. A "Useful" message is a legitimate inquiry about work, collaborations, or questions about the portfolio.
          A "Spam" message is unsolicited marketing, gibberish, or anything irrelevant.
          
          Message Details:
          - Name: ${data.name}
          - Email: ${data.email}
          - Phone: ${data.phone || 'Not provided'}
          - Message: ${data.message}
          
          Provide your classification and a brief reasoning.`,
          output: {
            schema: AIEvaluationSchema,
          },
          config: {
              temperature: 0.2, // Be more deterministic
          }
      });

      if (!evaluation) {
          throw new Error('AI evaluation failed.');
      }

      // Step 2: Save the message and the AI evaluation to Firestore
      const contactMessagesRef = collection(db, 'contacts');
      const newContactDocRef = doc(contactMessagesRef);

      await setDoc(newContactDocRef, {
        ...data,
        id: newContactDocRef.id,
        createdAt: serverTimestamp(),
        isRead: false,
        isPinned: false,
        aiAssessment: evaluation,
      });

      return {
        success: true,
        message: 'Message sent successfully! Ritesh will get back to you soon.',
      };
    } catch (error) {
      console.error('Error saving contact message:', error);
      // Still save the message even if AI fails, but without assessment
      try {
        const contactMessagesRef = collection(db, 'contacts');
        const newContactDocRef = doc(contactMessagesRef);
        await setDoc(newContactDocRef, {
            ...data,
            id: newContactDocRef.id,
            createdAt: serverTimestamp(),
            isRead: false,
            isPinned: false,
            aiAssessment: { classification: 'Useful', reasoning: 'AI evaluation failed, defaulted to useful.' },
        });
        return {
            success: true,
            message: 'Message sent successfully! Ritesh will get back to you soon.',
        };
      } catch (saveError) {
          console.error('Error saving contact message after AI failure:', saveError);
          return {
            success: false,
            message: 'There was an error sending your message. Please try again later.',
          };
      }
    }
  }
);
