'use client';
import { HomeComponent } from '@/components/ui/Home';
import Subscriptions from '@/components/ui/Subscriptions/Subscriptions';

export default function HomePage() {
  return (
    <>
      <HomeComponent />
      <Subscriptions />
      <MyComponent />
      <MyComponent2 />
    </>
  );
}

function MyComponent() {
  return (
    <div className="flex overflow-hidden relative flex-col justify-center self-stretch p-20 min-h-[1696px] max-md:px-5">
      <img
        loading="lazy"
        srcSet="..."
        className="object-cover absolute inset-0 size-full"
      />
      <div className="relative self-center text-6xl font-semibold leading-8 text-center bg-clip-text max-md:max-w-full max-md:text-4xl max-md:leading-6">
        Personalized AI for the Unique You
        <br />
      </div>
      <div className="relative self-center text-3xl font-medium text-center text-white leading-[54.08px] max-md:max-w-full">
        Stay One-of-a-Kind Content:
      </div>
      <div className="relative py-16 mt-20 max-md:pr-5 max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col w-[63%] max-md:ml-0 max-md:w-full">
            <img
              loading="lazy"
              srcSet="..."
              className="grow w-full aspect-[1.19] max-md:mt-10 max-md:max-w-full"
            />
          </div>
          <div className="flex flex-col ml-5 w-[37%] max-md:ml-0 max-md:w-full">
            <div className="flex relative flex-col justify-center self-stretch my-auto max-md:mt-10">
              <div className="text-lg font-medium leading-7 text-indigo-600">
                Features
              </div>
              <div className="mt-6 text-5xl font-semibold tracking-tighter text-white bg-clip-text leading-[50px]">
                <span className="font-medium leading-10">Reflect </span>
                <span className="font-medium leading-10">
                  your personal style, tone, opinions, experiences, and insights
                  in your content
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative py-16 mt-20 max-md:pl-5 max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col max-md:gap-0">
          <div className="flex flex-col w-[42%] max-md:ml-0 max-md:w-full">
            <div className="flex relative flex-col justify-center self-stretch my-auto max-md:mt-10">
              <div className="text-lg font-medium leading-7 text-indigo-600">
                Features
              </div>
              <div className="mt-6 text-5xl font-semibold tracking-tighter text-white bg-clip-text leading-[50px]">
                <span className="font-medium leading-10">Reflect </span>
                <span className="font-medium leading-10">
                  your personal style, tone, opinions, experiences, and insights
                  in your content
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-5 w-[58%] max-md:ml-0 max-md:w-full">
            <img
              loading="lazy"
              srcSet="..."
              className="grow w-full aspect-[1.25] max-md:mt-10 max-md:max-w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


function MyComponent2() {
  return (
    <div className="flex flex-col py-20 text-center bg-black bg-opacity-0">
      <div className="w-full text-6xl font-semibold bg-clip-text leading-[61.6px] max-md:max-w-full max-md:text-4xl">
        Full Power Personal Branding
      </div>
      <div className="w-full text-3xl font-medium leading-10 text-white max-md:max-w-full">
        revolutionizing businesses with seamless AI integration
      </div>
      <img
        loading="lazy"
        srcSet="..."
        className="mt-36 w-full rounded-2xl aspect-[4.35] bg-black bg-opacity-0 max-md:mt-10 max-md:max-w-full"
      />
      <img
        loading="lazy"
        srcSet="..."
        className="mt-36 w-full rounded-2xl aspect-[4.35] max-md:mt-10 max-md:max-w-full"
      />
    </div>
  );
}
