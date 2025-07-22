
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize Genkit
const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});

const SavingsTipsInputSchema = z.object({
    leftoverFunds: z.number().describe("The amount of money left after all bills and savings goals for the month."),
    currency: z.string().describe("The user's display currency (e.g., ZAR, USD)."),
});

const SavingsTipsOutputSchema = z.object({
    tip: z.string().describe("A short, actionable savings tip based on the user's leftover funds. The tip should be encouraging and practical."),
});

const savingsPrompt = ai.definePrompt({
    name: 'savingsPrompt',
    input: { schema: SavingsTipsInputSchema },
    output: { schema: SavingsTipsOutputSchema },
    prompt: `You are a friendly financial advisor. Based on the user's leftover funds of {{{leftoverFunds}}} {{{currency}}}, provide a single, short, actionable savings tip. Be encouraging. If the leftover amount is negative, the tip should focus on small ways to cut back on spending.`
});

// HTTP-triggered function to get savings tips
export const getSavingsTips = functions.https.onCall(async (data, context) => {
    // Validate input
    const inputParse = SavingsTipsInputSchema.safeParse(data);
    if (!inputParse.success) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid input.');
    }

    try {
        const { output } = await savingsPrompt(inputParse.data);
        if (!output) {
            throw new functions.https.HttpsError('internal', 'Failed to generate savings tip.');
        }
        return output;
    } catch (error) {
        console.error("Error generating savings tip:", error);
        throw new functions.https.HttpsError('internal', 'An unexpected error occurred while generating the tip.');
    }
});


// Scheduled function to check for due bills
export const checkDueBills = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    console.log('Running daily due bill check...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const usersSnapshot = await admin.firestore().collection('users').get();

    for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const userProfile = userDoc.data();

        // Check if user has enabled notifications for due bills
        if (!userProfile.notifications?.dueSoon) {
            console.log(`User ${userId} has notifications disabled. Skipping.`);
            continue;
        }

        const billsSnapshot = await admin.firestore().collection('users').doc(userId).collection('bills').get();
        const fcmTokens = userProfile.fcmTokens || [];
        
        if (fcmTokens.length === 0) {
            console.log(`User ${userId} has no FCM tokens. Skipping.`);
            continue;
        }

        for (const billDoc of billsSnapshot.docs) {
            const bill = billDoc.data();
            const dueDate = (bill.dueDate as admin.firestore.Timestamp).toDate();
            
            // Check if bill is unpaid and due tomorrow
            if (!bill.isPaid && 
                dueDate.getDate() === tomorrow.getDate() &&
                dueDate.getMonth() === tomorrow.getMonth() &&
                dueDate.getFullYear() === tomorrow.getFullYear()) 
            {
                const payload: admin.messaging.MessagingPayload = {
                    notification: {
                        title: 'Bill Due Tomorrow!',
                        body: `${bill.name} for ${userProfile.currency}${bill.amount.toFixed(2)} is due tomorrow.`,
                        icon: 'https://your-app-url.com/icon.png', // Replace with your app's icon URL
                        click_action: 'https://your-app-url.com/bills' // Replace with a link to your app
                    }
                };
                
                console.log(`Sending notification to user ${userId} for bill ${bill.name}`);
                try {
                    await admin.messaging().sendToDevice(fcmTokens, payload);
                } catch (error) {
                    console.error('Failure sending notification:', error);
                }
            }
        }
    }
    return null;
});
