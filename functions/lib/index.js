"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDueBills = exports.generateSavingsTip = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const genkit_1 = require("genkit");
const googleai_1 = require("@genkit-ai/googleai");
const cors_1 = __importDefault(require("cors"));
const corsHandler = (0, cors_1.default)({ origin: true });
// Initialize Firebase Admin SDK
admin.initializeApp();
// Initialize Genkit
const ai = (0, genkit_1.genkit)({
    plugins: [(0, googleai_1.googleAI)()],
    model: 'googleai/gemini-2.0-flash',
});
const SavingsTipsInputSchema = genkit_1.z.object({
    leftoverFunds: genkit_1.z.number().describe("The amount of money left after all bills and savings goals for the month."),
    currency: genkit_1.z.string().describe("The user's display currency (e.g., ZAR, USD)."),
});
const SavingsTipsOutputSchema = genkit_1.z.object({
    tip: genkit_1.z.string().describe("A short, actionable savings tip based on the user's leftover funds. The tip should be encouraging and practical."),
});
const savingsPrompt = ai.definePrompt({
    name: 'savingsPrompt',
    input: { schema: SavingsTipsInputSchema },
    output: { schema: SavingsTipsOutputSchema },
    prompt: `You are a friendly financial advisor. Based on the user's leftover funds of {{{leftoverFunds}}} {{{currency}}}, provide a single, short, actionable savings tip. Be encouraging. If the leftover amount is negative, the tip should focus on small ways to cut back on spending.`
});
// HTTP-triggered function to get savings tips
exports.generateSavingsTip = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }
        const inputParse = SavingsTipsInputSchema.safeParse(req.body);
        if (!inputParse.success) {
            res.status(400).json({
                error: {
                    message: 'Invalid request body.',
                    details: inputParse.error.format(),
                },
            });
            return;
        }
        try {
            const { output } = await savingsPrompt(inputParse.data);
            if (!output) {
                res.status(500).json({ error: { message: 'Failed to generate savings tip.' } });
                return;
            }
            res.status(200).json(output);
        }
        catch (error) {
            console.error("Error generating savings tip:", error);
            res.status(500).json({ error: { message: 'An unexpected error occurred.' } });
        }
    });
});
// Scheduled function to check for due bills
exports.checkDueBills = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
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
            const dueDate = bill.dueDate.toDate();
            // Check if bill is unpaid and due tomorrow
            if (!bill.isPaid &&
                dueDate.getDate() === tomorrow.getDate() &&
                dueDate.getMonth() === tomorrow.getMonth() &&
                dueDate.getFullYear() === tomorrow.getFullYear()) {
                const payload = {
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
                }
                catch (error) {
                    console.error('Failure sending notification:', error);
                }
            }
        }
    }
    return null;
});
//# sourceMappingURL=index.js.map