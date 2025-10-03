
'use server';
/**
 * @fileOverview An AI flow to parse bill information from unstructured text.
 * 
 * - importBillsFromText - A function that takes a block of text and returns structured bill data.
 */

import { ai } from '@/ai/genkit';
import { BillImportInput, BillImportInputSchema, BillImportOutput, BillImportOutputSchema } from '@/lib/types';
import { categories } from '@/lib/mock-data';

const categoryNames = categories.map(c => c.name);

// This is the prompt that instructs the AI on how to behave.
// It's configured to take text as input and return structured JSON that matches our output schema.
const importPrompt = ai.definePrompt({
  name: 'importBillsPrompt',
  input: { schema: BillImportInputSchema },
  output: { schema: BillImportOutputSchema },
  prompt: `You are an expert at parsing unstructured text and extracting financial information. The user has provided a block of text that contains a list of their bills. Your task is to analyze this text, identify each bill, and extract its details.

  The schema for a single parsed bill requires a category. Here are the available categories to choose from: ${categoryNames.join(', ')}.

  IMPORTANT: If a bill does not have a specific due date mentioned, you MUST set its 'dueDate' to the last day of the current month. Assume today is ${new Date().toLocaleDateString()}.

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
