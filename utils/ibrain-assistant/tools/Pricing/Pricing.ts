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

    // Check if a specific plan is asked
    // Generate pricing information based on the specified plan
    // switch (plan) {
    //   case 'free trial':
    //     pricingInfo = `The Free Trial Subscription allows you to explore the capabilities of iBrain Data with a 14-day free trial. You'll have access to basic voice-based data interaction, limited database connectivity for exploration, basic query generation and visualization tools, and multi-language support for common languages. The duration of this trial is 14 days, and it's completely free of charge.`;
    //     break;
    //   case 'basic':
    //     pricingInfo = `With the Basic Subscription, you can elevate your data experience for $19.99 per month or $199.90 per year (equivalent to one month free). This plan is designed for individuals and small businesses, offering full access to voice-based data interaction, up to 3 database integrations, advanced query generation and visualization capabilities, multi-language support for common languages, and priority email support. You can choose between monthly or annual billing.`;
    //     break;
    //   case 'business':
    //     pricingInfo = `The Business Subscription empowers teams and enterprises with the full potential of iBrain Data for $99.99 per month or $1099.89 per year (equivalent to one month free). This plan includes all features of the Basic subscription, plus unlimited database connectivity options, customizable dashboards and reporting, priority support, multi-tenant functionality, and user management. You can add additional users to your account for $15.99 per user per month, each getting their own login credentials and access to the full suite of iBrain Data features. You can choose between monthly or annual billing.`;
    //     break;
    //   case 'all':
    //     pricingInfo = `We offer three pricing plans: Free Trial, Basic, and Business. Each plan allows you to access different features tailored to your needs. For details about a specific plan, please specify the plan name.`;
    //     break;
    //   default:
    //     pricingInfo = `We offer three pricing plans: Free Trial, Basic, and Business. Each plan allows you to access different features tailored to your needs. For details about a specific plan, please specify the plan name.`;
    // }

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

    console.log(pricingInfo);

    console.log('Pricing information:');
    console.log(pricingInfo);
    core.store.emit(`tool.pricing`);

    // Return the pricing information
    return pricingInfo;
  }
}
