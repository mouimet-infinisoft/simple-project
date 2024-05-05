import { core } from '@/utils/BrainStackProvider';
import { AbstractTool } from '../abstraction';

// Define the arguments interface for explaining pricing
interface PricingArguments {
  plan?: string; // Name of the pricing plan
}

// Implementation for PricingTool
export class PricingTool extends AbstractTool<PricingArguments> {
  constructor() {
    super(
      'explainPricing', // Tool name
      'Provides information about the pricing plans offered by iBrain Data in the current speaking language.', // Tool description
      {
        plan: {
          type: 'string',
          description: 'Name of the pricing plan (optional).'
        }
      }, // Argument specification
      ['plan'] // Required parameters
    );
  }

  // Method to execute the tool
  async execute(args?: PricingArguments) {
    let pricingInfo: string;
    const plan = args?.plan?.toLowerCase() ?? 'all';
    switch (plan) {
      case 'basic':
        pricingInfo = `The Basic Subscription starts with a 14-day free trial, no credit card required. It's designed for individuals and small businesses, offering full access to voice-based data interaction, up to 3 database integrations, advanced query generation and visualization capabilities, and multi-language support for common languages. After the trial, continue for $19.99 per month or $199.90 per year (equivalent to one month free). Creating an account is easy and takes just a few seconds, with options to sign up using Google, email, or GitHub. Do you want to get started?`;
        break;
      case 'business':
        pricingInfo = `Start with a 14-day free trial of the Business Subscription, without needing a credit card. This plan empowers teams and enterprises with unlimited database connectivity options, customizable dashboards and reporting, priority support, multi-tenant functionality, and user management. After the trial, the subscription is $99.99 per month or $1099.89 per year (equivalent to one month free). Adding additional users is simple at $15.99 per user per month. Sign up in seconds using Google, email, or GitHub. Should we get started?`;
        break;
      default:
        pricingInfo = `Every journey with iBrain Data begins with a 14-day free trial, available for both Basic and Business subscriptions, no credit card required. This allows you to explore the full capabilities of our platform and find the plan that best suits your needs. Signing up is quick and easy, requiring just an email, or you can use your Google or GitHub account. Ready to dive in and discover what iBrain Data can do for you?`;
    }

    // Return the pricing information
    return pricingInfo;
  }
}
