//@ts-nocheck
import * as React from 'react';

export default function Subscriptions() {
  return (
    <div
      id="pricing"
      // className="flex overflow-hidden relative flex-col justify-center items-center p-20 min-h-[1147px] max-md:px-5"
    >
      <div className="relative mt-10 text-6xl font-bold text-center bg-clip-text leading-[59.4px] max-md:max-w-full max-md:text-4xl">
        Our Plans
      </div>
      <div className="relative text-3xl font-medium text-center text-white leading-[54.08px] max-md:max-w-full">
        Choose the best for you
      </div>
      <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      <stripe-pricing-table
        pricing-table-id="prctbl_1P0jcqJ6cfD2tzfxvipFBubn"
        publishable-key="pk_live_51MMjZyJ6cfD2tzfx6TK9Qyy1Hjrnuj1QvjGHRTlFUexR4ulQyJLuR9R9zDCWG9kDYf3vJvF5Cdy92TAEsxekKWQL00CnN6xjcB"
      ></stripe-pricing-table>
    </div>
  );
}

interface SubscriptionCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  duration: string;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  price,
  description,
  features,
  duration
}) => {
  return (
    <div className="flex flex-col w-[33%] max-md:w-full">
      <div className="flex relative flex-col grow justify-center px-8 py-14 w-full bg-gray-900 rounded-[25px] max-md:px-5 max-md:mt-10">
        <div className="flex flex-col items-center max-md:px-5">
          <div className="z-10 mt-0 text-4xl font-semibold bg-clip-text text-center">
            {title}
          </div>
          <div className="mt-4 text-2xl font-bold leading-6 text-center text-white">
            {price}
          </div>
          <div className="mt-4 text-md text-justify text-white">
            {description}
          </div>

          <a
            href={'#pricing'}
            className="text-center self-stretch px-6 py-4 mt-4 text-xs font-medium leading-4 text-white bg-indigo-600 border border-violet-600 border-solid rounded-[50px] tracking-[2px] max-md:px-5 hover:bg-indigo-700 hover:border-violet-700 transition-colors duration-300 ease-in-out"
            target="_blank"
            rel="noopener noreferrer"
          >
            SUBSCRIBE
          </a>
        </div>
        <div className="shrink-0 mt-6 h-px bg-neutral-100" />
        <div className="flex flex-col mt-6 text-sm leading-5 text-white max-md:px-5">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2.5 p-0.5 mt-4">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a76418dc4376a07ac17ec9100bb26c27f66112c38ca16a4fd0d6cd538acefc6f?"
                className="shrink-0 self-start w-5 aspect-square fill-indigo-50"
              />
              <div className="flex-auto">{feature}</div>
            </div>
          ))}
        </div>
        {/* <div className="mt-4 text-md text-center text-white">
          {duration}
        </div> */}
      </div>
    </div>
  );
};
