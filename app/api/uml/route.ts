import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe/config';
import { DiagramModule } from '@brainstack/diagram';

// Function to validate subscription status in Stripe
async function validateSubscription(email: string): Promise<boolean> {
  try {
    // Retrieve customer details based on the email address
    const customer = await stripe.customers.list({ email });

    if (customer.data.length === 0) {
      // No customer found with the given email
      return false;
    }

    const customerId = customer.data[0].id;

    // Retrieve active subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId
      //   status: 'active'
    });

    if (subscriptions.data.length === 0) {
      // No active subscriptions found for the customer
      return false;
    }

    // At least one active subscription found
    return true;
  } catch (error) {
    console.error('An error occurred:', error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  const { email, message } = await req.json();

  try {
    const isValidSubscription = await validateSubscription(email);
    const response = isValidSubscription
      ? 'Subscription is valid'
      : 'Subscription is invalid';

    const umlCode = message; // Assuming message contains PlantUML code
    const diagramUrl = DiagramModule.generate_png(umlCode);

    return new Response(JSON.stringify({ url: diagramUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('An error occurred:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
