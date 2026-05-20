"use client";

import React from "react";

type CardT = {
  image: string;
  name: string;
  handle: string;
  date?: string;
};

const DEFAULT_DATA: CardT[] = [
  {
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    name: "Briar Martin",
    handle: "@neilstellar",
  },
  {
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    name: "Avery Johnson",
    handle: "@averywrites",
  },
  {
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    name: "Jordan Lee",
    handle: "@jordantalks",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    name: "Avery Johnson",
    handle: "@averywrites",
  },
];

const VerifyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 48 48"
    className="inline-block"
  >
    <polygon
      fill="#42a5f5"
      points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"
    />
    <polygon
      fill="#fff"
      points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"
    />
  </svg>
);

const Card = ({ card }: { card: CardT }) => (
  <article className="w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
    <div className="flex gap-3">
      <img className="size-11 rounded-full object-cover" src={card.image} alt={card.name} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <p className="font-medium text-slate-900">{card.name}</p>
          <VerifyIcon />
        </div>
        <span className="text-xs text-slate-500">{card.handle}</span>
      </div>
    </div>
    <p className="pt-4 text-sm leading-6 text-slate-700">
      Radiant made undercutting all of our competitors an absolute breeze.
    </p>
  </article>
);

function MarqueeRow({
  data,
  reverse = false,
  speed = 25,
  mobileHidden = false,
}: {
  data: CardT[];
  reverse?: boolean;
  speed?: number;
  mobileHidden?: boolean;
}) {
  const doubled = React.useMemo(() => [...data, ...data], [data]);

  return (
    <div className={`relative mx-auto w-full max-w-[88rem] overflow-hidden py-2 ${mobileHidden ? "hidden md:block" : "block"}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-gradient-to-r from-white via-white/95 to-transparent md:block md:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-gradient-to-l from-white via-white/95 to-transparent md:block md:w-32" />
      <div
        className={`flex min-w-[200%] transform-gpu gap-4 px-0 md:gap-8 ${reverse ? "marquee-track marquee-track--reverse" : "marquee-track marquee-track--primary"}`}
        style={{
          ["--marquee-duration" as string]: `${speed}s`,
        }}
      >
        {doubled.map((card, index) => (
          <Card key={`${card.name}-${index}`} card={card} />
        ))}
      </div>
    </div>
  );
}

export default function MarqueeTestimonials({
  row1 = DEFAULT_DATA,
  row2 = DEFAULT_DATA,
}: {
  row1?: CardT[];
  row2?: CardT[];
}) {
  return (
    <>
      <style>{`
        .marquee-track--primary {
          animation: marqueeScroll var(--marquee-duration) linear infinite reverse;
        }

        .marquee-track--reverse {
          animation: marqueeScroll var(--marquee-duration) linear infinite normal;
        }

        @media (min-width: 768px) {
          .marquee-track--primary {
            animation: marqueeScroll var(--marquee-duration) linear infinite normal;
          }

          .marquee-track--reverse {
            animation: marqueeScroll var(--marquee-duration) linear infinite reverse;
          }
        }

        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="w-full bg-white px-2 py-12 md:px-4">
        <div className="mx-auto mb-6 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#009ee3]">
            Testimonials
          </p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Trusted by teams who wanted faster results
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            A quick social-proof strip to close the section with real names, clean motion, and a stronger finish.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          <MarqueeRow data={row1} reverse={false} speed={26} />
          <MarqueeRow data={row2} reverse={true} speed={26} mobileHidden />
        </div>
      </div>
    </>
  );
}
