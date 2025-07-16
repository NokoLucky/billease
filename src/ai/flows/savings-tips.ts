// savings-tips.ts
'use server';

/**
 * @fileOverview Provides personalized savings tips based on user income and bills.
 *
 * - getSavingsTips - A function that generates savings tips.
 * - SavingsTipsInput - The input type for the getSavingsTips function.
 * - SavingsTipsOutput - The return type for the getSavingsTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SavingsTipsInputSchema = z.object({
  income: z.number().describe('The user\'s monthly income.'),
  upcomingBills: z
    .array(z.object({name: z.string(), amount: z.number()}))
    .describe('An array of upcoming bills with their names and amounts.'),
  savingsGoal: z
    .number()
    .optional()
    .describe('The user\'s monthly savings goal.'),
});
export type SavingsTipsInput = z.infer<typeof SavingsTipsInputSchema>;

const SavingsTipsOutputSchema = z.object({
  savingsTips: z.string().describe('Personalized savings tips for the user.'),
});
export type SavingsTipsOutput = z.infer<typeof SavingsTipsOutputSchema>;

export async function getSavingsTips(input: SavingsTipsInput): Promise<SavingsTipsOutput> {
  return savingsTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'savingsTipsPrompt',
  input: {schema: SavingsTipsInputSchema},
  output: {schema: SavingsTipsOutputSchema},
  prompt: `You are a financial advisor providing personalized savings tips.

  Based on the user's income, upcoming bills, and savings goal, provide actionable savings tips.

  Income: {{{income}}}
  Upcoming Bills: {{#each upcomingBills}}{{{name}}}: {{{amount}}}, {{/each}}
  Savings Goal: {{{savingsGoal}}}

  Provide concise and practical advice to help the user better manage their finances and achieve their savings goals.
  Consider suggesting specific areas where they can cut expenses or optimize their spending.
  Structure your response in short paragraphs.
  Do not be overly verbose.
  Do not be too prescriptive or controlling, instead, give helpful suggestions.
`,
});

const savingsTipsFlow = ai.defineFlow(
  {
    name: 'savingsTipsFlow',
    inputSchema: SavingsTipsInputSchema,
    outputSchema: SavingsTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
