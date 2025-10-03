
'use server';
/**
 * @fileOverview An AI flow to parse bill information from unstructured text.
 * 
 * - importBillsFromText - A function that takes a block of text and returns structured bill data.
 * - BillImportInput - The input type for the import flow.
 * - BillImportOutput - The return type for the import flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { BillCategory } from '@/lib/types';
import { categories } from '@/lib/mock-data';

// Create a simple array of category names for the enum
const categoryNames = categories.map(c => c.name) as [BillCategory, ...BillCategory[]];

// Define the schema for a single parsed bill.
// This is what the AI will try to extract for each line item.
export const ParsedBillSchema = z.object({
  name: z.string().describe('The name of the bill (e.g., Netflix, Rent, Electricity).'),
  amount: z.number().describe('The amount due for the bill.'),
  dueDate: z.string().describe("The due date of the bill. It should be a valid date string. If a year isn't specified, assume the current year."),
  category: z.enum(categoryNames).describe('The category of the bill.'),
  frequency: z.enum(['one-time', 'monthly', 'yearly']).default('monthly').describe("The frequency of the bill (e.g., one-time, monthly, yearly). If not specified, 'monthly' is a good default."),
});
export type ParsedBill = z.infer<typeof ParsedBillSchema>;

// Define the input schema for the flow.
// It's just a single string of text.
export const BillImportInputSchema = z.object({
  text: z.string().describe('A block of text containing a list of bills, potentially from a user pasting from a notes app.'),
});
export type BillImportInput = z.infer<typeof BillImportInputSchema>;

// Define the output schema for the flow.
// It will be an array of the parsed bills found in the text.
export const BillImportOutputSchema = z.object({
  bills: z.array(ParsedBillSchema).describe('An array of bill objects parsed from the input text.'),
});
export type BillImportOutput = z.infer<typeof BillImportOutputSchema>;


// This is the prompt that instructs the AI on how to behave.
// It's configured to take text as input and return structured JSON that matches our output schema.
const importPrompt = ai.definePrompt({
  name: 'importBillsPrompt',
  input: { schema: BillImportInputSchema },
  output: { schema: BillImportOutputSchema },
  prompt: `You are an expert at parsing unstructured text and extracting financial information. The user has provided a block of text that contains a list of their bills. Your task is to analyze this text, identify each bill, and extract its details.

  Here are the available categories: ${categoryNames.join(', ')}.

  Analyze the following text and extract all the bills you can find:

  {{{text}}}

  Return the data as a JSON object with a "bills" array. Make sure dates are valid.
  `,
});

// This is the main Genkit flow.
// It takes the input, calls the AI prompt, and returns the structured output.
const importBillsFlow = ai.defineFlow(
  {
    name: 'importBillsFlow',
    inputSchema: BillImportInputSchema,
    outputSchema: BillImportOutputSchema,
  },
  async (input) => {
    const { output } = await importPrompt(input);
    if (!output) {
      return { bills: [] };
    }
    return output;
  }
);


// This is the exported function that our client-side code will call.
export async function importBillsFromText(input: BillImportInput): Promise<BillImportOutput> {
  return await importBillsFlow(input);
}
