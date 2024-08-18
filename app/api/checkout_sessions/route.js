import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with your secret key and API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Helper function to format amount for Stripe (in cents)
const formatAmountForStripe = (amount, currency) => {
  return Math.round(amount * 100); // Convert dollars to cents
};

// Stripe checkout session API route
export async function POST(req) {
  // Define parameters for the checkout session
  const params = {
    mode: "subscription", // Subscription mode
    payment_method_types: ["card"], // Payment method types accepted
    line_items: [
      {
        price_data: {
          currency: "usd", // Currency for the price
          product_data: {
            name: "Pro Subscription", // Name of the product
          },
          unit_amount: formatAmountForStripe(5, "usd"), // Price in cents ($5.00)
          recurring: {
            interval: "month", // Recurring interval
            interval_count: 1, // Interval count (1 month)
          },
        },
        quantity: 1, // Quantity of the product
      },
    ],
    success_url: `${req.headers.get(
      "Referer"
    )}result?session_id={CHECKOUT_SESSION_ID}`, // URL to redirect after successful payment
    cancel_url: `${req.headers.get(
      "Referer"
    )}result?session_id={CHECKOUT_SESSION_ID}`, // URL to redirect if payment is canceled
  };

  // Create a new checkout session
  const checkoutSession = await stripe.checkout.sessions.create(params);

  // Return the checkout session details as JSON
  return NextResponse.json(checkoutSession, {
    status: 200,
  });
}

// Retrieve session details after payment
export async function GET(req) {
  // Extract session_id from query parameters
  const searchParams = req.nextUrl.searchParams;
  const session_id = searchParams.get("session_id");

  try {
    // Check if session_id is provided
    if (!session_id) {
      throw new Error("Session ID is required"); // Error if session_id is missing
    }

    // Retrieve the checkout session details from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    // Return the checkout session details as JSON
    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error("Error retrieving checkout session:", error); // Log errors
    // Return error details as JSON
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
