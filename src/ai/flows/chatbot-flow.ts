
'use server';
/**
 * @fileOverview A flow for a chatbot that can answer questions about Ritesh Manandhar.
 *
 * - chatAboutRitesh - A function that takes a question and returns an answer.
 * - ChatbotInput - The input type for the chatbot function.
 * - ChatbotOutput - The return type for the chatbot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { defaultData } from '@/lib/data';

const ChatbotInputSchema = z.object({
  question: z.string().describe('The user\'s question about Ritesh Manandhar.'),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.string().describe('The chatbot\'s answer.');
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatAboutRitesh(
  input: ChatbotInput
): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

// Convert the portfolio data into a string context for the LLM
const portfolioContext = `
  About Ritesh Manandhar:
  - Title: ${defaultData.hero.title}
  - Subtitle: ${defaultData.hero.subtitle}
  - Bio: ${defaultData.about.description1} ${defaultData.about.description2} ${defaultData.about.description3}

  Experience:
  ${defaultData.experience.map(exp => `- ${exp.role} at ${exp.company} (${exp.duration}): ${exp.description}`).join('\n')}

  Skills:
  ${defaultData.skills.map(skill => `- ${skill.name} (Proficiency: ${skill.level}/100)`).join('\n')}

  Projects:
  ${defaultData.projects.map(proj => `- ${proj.title}: ${proj.description} (Technologies: ${proj.tags.join(', ')})`).join('\n')}

  Education:
  ${defaultData.qualifications.filter(q => q.type === 'education').map(edu => `- ${edu.title} from ${edu.institution} (${edu.duration})`).join('\n')}
`;


const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `You are a friendly and helpful chatbot on Ritesh Manandhar's personal portfolio website.
        Your goal is to answer questions about Ritesh based on the context provided below.
        Keep your answers concise and conversational. If you don't know the answer from the context,
        politely say that you don't have that information. Do not make things up.

        Context about Ritesh:
        ${portfolioContext}

        User's Question: "${input.question}"

        Your Answer:`,
      output: {
        schema: ChatbotOutputSchema,
      },
      config: {
        temperature: 0.5, // Make the responses a bit more focused
      }
    });

    return output!;
  }
);
