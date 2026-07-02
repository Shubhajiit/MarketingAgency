import * as React from "react";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
};

type LogoCloudProps = React.ComponentProps<"div">;

export function LogoCloud({ className, ...props }: LogoCloudProps) {
  const logos: Logo[] = [
    { src: "/WorkshopsAILogos/ChatGPT.webp", alt: "ChatGPT" },
    { src: "/Logo/ScrollingLogo/ClaudeAI.png", alt: "Claude AI" },
    { src: "/Logo/ScrollingLogo/Gemini.png", alt: "Gemini" },
    { src: "/WorkshopsAILogos/AdobeFirefly.png", alt: "Adobe Firefly" },
    { src: "/WorkshopsAILogos/Canva.png", alt: "Canva" },
    { src: "/WorkshopsAILogos/DescriptAI.png", alt: "Descript AI" },
    { src: "/WorkshopsAILogos/ElevenLabs.webp", alt: "ElevenLabs" },
    { src: "/WorkshopsAILogos/Grammerly.png", alt: "Grammarly" },
    { src: "/WorkshopsAILogos/Jasper.png", alt: "Jasper" },
    { src: "/WorkshopsAILogos/Lumen5.png", alt: "Lumen5" },
    { src: "/WorkshopsAILogos/MidJourney.jpg", alt: "MidJourney" },
    { src: "/WorkshopsAILogos/NotionAI.png", alt: "Notion AI" },
    { src: "/WorkshopsAILogos/OpusClip.png", alt: "OpusClip" },
    { src: "/WorkshopsAILogos/PeechAI.jpg", alt: "Peech AI" },
    { src: "/WorkshopsAILogos/PictoryAI.png", alt: "Pictory AI" },
    { src: "/WorkshopsAILogos/QuillBot.png", alt: "QuillBot" },
    { src: "/WorkshopsAILogos/Runway.png", alt: "Runway" },
    { src: "/WorkshopsAILogos/SurferAI.webp", alt: "Surfer AI" },
    { src: "/WorkshopsAILogos/Synthesia.webp", alt: "Synthesia" },
    { src: "/WorkshopsAILogos/TomeAI.webp", alt: "Tome AI" },
    { src: "/WorkshopsAILogos/copyAI.png", alt: "Copy AI" },
    { src: "/WorkshopsAILogos/Tool/Google-Ads.webp", alt: "Google Ads" },
    { src: "/WorkshopsAILogos/Tool/GoogleAnalytics.jpg", alt: "Google Analytics" },
    { src: "/WorkshopsAILogos/Tool/Meta-Ads.webp", alt: "Meta Ads" },
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-x-3 gap-y-5 bg-white",
        className
      )}
      {...props}
    >
      {logos.map((logo, index) => (
        <div
          key={index}
          className="flex items-center justify-center bg-white p-2 h-28 transition-all duration-300 hover:scale-105"
        >
          <img
            alt={logo.alt}
            src={logo.src}
            className="pointer-events-none select-none max-w-full max-h-24 object-contain transition-all duration-300"
          />
        </div>
      ))}
    </div>
  );
}