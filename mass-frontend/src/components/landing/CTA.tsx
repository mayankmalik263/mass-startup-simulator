'use client';

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';

const users = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE3q6MkmZMswsCP3zGznw8w5rgw5o3e-b6DdTHJZzg9kn4ym2SrRHZG8ZtByWgJdDviZJIMdBRqfRtwCjaY8Z04etp1X5rZLtrC8ZZPpC5AhjS1SozMyWA7hnHVzQ24q_fb9rc_1XrEMCFgBv9N9UWdT9cFn8Xs1CWwuLhMxdO_xn2WQ04T01Oz4nhjNXWWH2co6gvMczvgwhhkmMZ5meiVyDUfYAxAhQcwVUMyv95kuDvJeemYTmS_mrHzSpeO84EdVR05pDsBOGV',
    alt: 'A focused digital entrepreneur in a dark, minimalist office environment with subtle neon accents.',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV0JNHGRaSNqDqZjrJLc6l9qvjC3uxvr1LkT7NDP39OF2yzk56lQQ2ixNnuEC5egprcxowIxOR9d-zWAV80xdwF6CLk4watPTxQftoMpiUs0ZPYEBkEeTWU_ZciF3SlKOuQUk7bJJ8W680GPTZ4EnfFwXjg3JWm7NMs0xSgjH2z5IvVxgP_AU5SH6wLcoxemRPC6YVMDmkE8LQxQ7oUFzoqiXWer8WzX8FnmbfDGZjgSxU_yAkpeLK3wjZD3uvddwOeGPtDJH2NgG4',
    alt: 'A tech founder smiling confidently in a modern studio setting.',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO9u1tNNrJ0UMLY-BvCGbNMgsfSo9Vpi3-4v615zzto137RZ7x5KWS8t9erHhYqXHpCD3SrItftV_urgxDVg0nYP2mGLe_Nv2sS1Nij9sEl__W8VqiH5gdoCiEjmWmZWPNsWeRj-8iY5QYXuj1t4ta2yf74TpWVojkI2sWmxhzQIvL2MYJX6LPEafpf-9-siitEsnJoYblQDSbggUNogZ5HSEDtDQDeW2otQPKAEYlx2DSwo_lp4z27dsuqFbsm-2A9g0z5zQ20Ey1',
    alt: 'A portrait of a visionary female developer in a high-tech lab.',
  },
];

export default function CTA() {
  return (
    <section className="py-2xl px-margin-mobile md:px-margin-desktop bg-surface-container-low border-t border-outline-variant relative overflow-hidden">
      <div className="max-w-[56rem] mx-auto text-center relative z-10">
        <h2 className="font-display text-[48px] md:text-[64px] font-extrabold mb-lg leading-tight">
          Ready to pressure-test your startup idea?
        </h2>
        <Link
          href="/simulate"
          className="inline-block bg-primary text-on-primary font-label-mono px-2xl py-md rounded border border-primary-container hover:scale-105 transition-transform mb-xl"
        >
          Start Free
        </Link>
        <div className="flex items-center justify-center gap-md">
          <div className="flex -space-x-2">
            {users.map((user, index) => (
              <img
                key={index}
                className="w-10 h-10 rounded-full border-2 border-black object-cover"
                src={user.src}
                alt={user.alt}
              />
            ))}
          </div>
          <span className="font-label-mono text-xs text-on-surface-variant">
            Joined by 1,200+ founders this week
          </span>
        </div>
      </div>
    </section>
  );
}
