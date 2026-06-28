import * as React from "react";
import { PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div">;

export function LogoCloud({ className, ...props }: LogoCloudProps) {
  return (
    <div
      className={cn(
        "relative grid grid-cols-2 border border-[#e5e7eb] bg-[#f4f4f5] md:grid-cols-4",
        className
      )}
      {...props}
    >
      <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t" />

      <LogoCard
        className="relative border-r border-b border-[#e5e7eb]"
        logo={{
          src: "/Logo/ScrollingLogo/ChatGPT.svg",
          alt: "ChatGPT Logo",
        }}
      />

      <LogoCard
        className="border-b md:border-r border-[#e5e7eb]"
        logo={{
          src: "/Logo/ScrollingLogo/ClaudeAI.png",
          alt: "Claude Logo",
        }}
      />

      <LogoCard
        className="relative border-r border-b border-[#e5e7eb]"
        logo={{
          src: "/Logo/ScrollingLogo/Gemini.png",
          alt: "Gemini Logo",
        }}
      />

      <LogoCard
        className="relative border-b border-[#e5e7eb]"
        logo={{
          src: "/Logo/ScrollingLogo/CanvaLogo.webp",
          alt: "Canva Logo",
        }}
      />

      <LogoCard
        className="relative border-r border-b md:border-b-0 border-[#e5e7eb]"
        logo={{
          src: "/Logo/ScrollingLogo/DescriptAI.webp",
          alt: "Descript AI Logo",
        }}
      />

      <LogoCard
        className="border-b md:border-r md:border-b-0 border-[#e5e7eb]"
        logo={{
          src: "/Logo/ScrollingLogo/jasperAI.png",
          alt: "Jasper AI Logo",
        }}
      />

      <LogoCard
        className="border-r border-[#e5e7eb]"
        logo={{
          src: "/Logo/ScrollingLogo/ChatGPT.svg",
          alt: "ChatGPT Logo",
        }}
      />

      <LogoCard
        logo={{
          src: "/Logo/ScrollingLogo/notionLOGO.png",
          alt: "Notion Logo",
        }}
      />

      <PlusIcon
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 size-5 -translate-x-1/2 -translate-y-1/2 text-[#0f0f0f]"
        strokeWidth={1.25}
      />

      <PlusIcon
        className="pointer-events-none absolute left-1/4 top-1/2 z-10 size-5 -translate-x-1/2 -translate-y-1/2 text-[#0f0f0f]"
        strokeWidth={1.25}
      />

      <PlusIcon
        className="pointer-events-none absolute left-3/4 top-1/2 z-10 size-5 -translate-x-1/2 -translate-y-1/2 text-[#0f0f0f]"
        strokeWidth={1.25}
      />

      <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b" />
    </div>
  );
}

type LogoCardProps = React.ComponentProps<"div"> & {
  logo: Logo;
};

function LogoCard({ logo, className, children, ...props }: LogoCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-white px-4 py-8 md:p-8 h-28 md:h-32",
        className
      )}
      {...props}
    >
      <img
        alt={logo.alt}
        src={logo.src}
        className="
          pointer-events-none
          select-none
          w-auto
          max-h-12
          object-contain
          md:max-h-14
        "
      />

      {children}
    </div>
  );
}