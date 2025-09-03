const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Stripe = require('stripe');
const cors = require('cors')({ origin: true });
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize Stripe with secret key from environment variables
const stripe = Stripe(process.env.STRIPE_SECRET);

// Initialize Gemini with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// The pricing ID for your premium plan in Stripe
const premiumPriceId = 'price_1P85f92e9Fj1n0o9kH8Rk2o3';

/**
 * Creates a Stripe Checkout Session for a user.
 * This function is called from the client-side of the application.
 */
exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
    // Check if the user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'The function must be called while authenticated.'
        );
    }

    const userId = context.auth.uid;

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
                {
                    price: premiumPriceId,
                    quantity: 1,
                },
            ],
            // This metadata will be returned in the webhook event
            metadata: {
                userId: userId,
            },
            // You can define a success and cancel URL
            success_url: 'https://synergy-fitness.web.app/dashboard?payment=success',
            cancel_url: 'https://synergy-fitness.web.app/dashboard?payment=cancel',
        });

        // Return the session ID to the client
        return { sessionId: session.id };
    } catch (error) {
        console.error('Error creating Stripe Checkout session:', error);
        throw new functions.https.HttpsError(
            'internal',
            'Unable to create checkout session.'
        );
    }
});

/**
 * Handles webhook events from Stripe to update the user's subscription status.
 * This function is an HTTPS endpoint.
 */
exports.stripeWebhook = functions.https.onRequest((request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(request.rawBody, sig, functions.config().stripe.webhook_secret);
    } catch (err) {
        console.error('Webhook signature verification failed.', err);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;

        if (!userId) {
            console.error('No userId found in session metadata.');
            return response.status(400).send('No userId found in session metadata.');
        }

        // Update the user's Firestore document
        admin.firestore().collection('users').doc(userId).collection('profile').doc('data').update({
            'subscription.status': 'premium',
        })
            .then(() => {
                console.log(`User ${userId} subscription status updated to premium.`);
            })
            .catch((error) => {
                console.error('Error updating subscription status:', error);
            });
    }

    // Respond to Stripe to acknowledge receipt of the event
    response.status(200).send('Received');
});


/**
 * Calls the Gemini API to generate a personalized workout plan.
 * This function is called from the client-side.
 */
exports.generateAiWorkoutPlan = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const { goal, level, days } = data;

    const prompt = `You are an expert fitness coach. Your task is to create a ${level} level workout plan for ${goal} that a user can do on ${days.join(', ')}. Provide a list of exercises. Each exercise must have a name, muscle group, and a gif URL from wikimedia commons. The response must be a valid JSON object only, with no extra text. The JSON object should have a single key called "plan" which is an object with two keys: "name" (a string like "3-Day Fat Loss Plan") and "exercises" (an array of exercise objects). Each exercise object must have a "name" (string), "muscle" (string), and "gif" (string) field. The "sets" field should be an empty array.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonString = response.text().replace(/```json\n|```/g, '').trim();
        const parsedPlan = JSON.parse(jsonString);

        if (!parsedPlan.plan || !parsedPlan.plan.exercises) {
            throw new Error("Invalid JSON structure returned by AI.");
        }

        // Add the empty sets array to each exercise as a default
        const finalPlan = {
            name: parsedPlan.plan.name,
            exercises: parsedPlan.plan.exercises.map(ex => ({
                ...ex,
                sets: []
            }))
        };

        return finalPlan;
    } catch (error) {
        console.error('Error generating AI plan:', error);
        throw new functions.https.HttpsError('internal', 'Failed to generate plan from AI.');
    }
});

/**
 * Calls the Gemini API to act as a general fitness assistant.
 * This function is called from the client-side.
 */
exports.askAiAssistant = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const { question, context: pageContext } = data;

    if (!question) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a "question".');
    }

    // AI'a rolünü ve göreviyle ilgili bağlamı veriyoruz.
    const prompt = `You are a helpful and encouraging fitness and nutrition assistant named Synergy AI. 
  A user is asking a question from the "${pageContext}" page of their fitness app. 
  User's question: "${question}".
  Provide a helpful, concise, and motivating answer. If the question is outside of fitness, nutrition, or health, politely decline to answer.
  Answer in Turkish.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();

        return { answer: answer };
    } catch (error) {
        console.error('Error with AI Assistant:', error);
        throw new functions.https.HttpsError('internal', 'Failed to get a response from the AI assistant.');
    }
});