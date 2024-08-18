import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

/*
 * Utility function ensures that we only create 1 instance of Stripe,
 * reusing it if it already exists.
 */
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
  }
  return stripePromise;
};

export default getStripe;
