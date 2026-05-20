"use client";

import { useCallback, useEffect } from "react";

declare global {
  interface Window {
    particlesJS?: (id: string, options: Record<string, unknown>) => void;
    pJSDom?: Array<{
      pJS: {
        fn: {
          vendors: {
            destroypJS: () => void;
          };
        };
      };
    }>;
  }
}

export default function ParticlesBg() {
  const initParticles = useCallback((isDark: boolean) => {
    const oldCanvas = document.querySelector("#particles-js canvas");
    if (oldCanvas) oldCanvas.remove();

    if (window.pJSDom?.length > 0) {
      window.pJSDom.forEach((instance) => instance.pJS.fn.vendors.destroypJS());
      window.pJSDom = [];
    }

    const colors = isDark
      ? {
          particles: "#00f5ff",
          lines: "#00d9ff",
          accent: "#0096c7",
        }
      : {
          particles: "#0277bd",
          lines: "#0288d1",
          accent: "#039be5",
        };

    window.particlesJS?.("particles-js", {
      particles: {
        number: { value: 140, density: { enable: true, value_area: 800 } },
        color: { value: colors.particles },
        shape: { type: "circle", stroke: { width: 0.5, color: colors.accent } },
        opacity: {
          value: 0.7,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.3 },
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: true, speed: 2, size_min: 1 },
        },
        line_linked: {
          enable: true,
          distance: 160,
          color: colors.lines,
          opacity: 0.4,
          width: 1.2,
        },
        move: { enable: true, speed: 2, random: true, out_mode: "bounce" },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 220, line_linked: { opacity: 0.8 } },
          push: { particles_nb: 4 },
          repulse: { distance: 180, duration: 0.4 },
        },
      },
      retina_detect: true,
    });
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const detectDark = () =>
      html.classList.contains("dark") || html.getAttribute("data-theme") === "dark";

    const scriptId = "particles-js-script";
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    let observer: MutationObserver | null = null;
    let script: HTMLScriptElement | null = existingScript;

    const start = () => {
      initParticles(detectDark());

      observer = new MutationObserver(() => initParticles(detectDark()));
      observer.observe(html, {
        attributes: true,
        attributeFilter: ["class", "data-theme"],
      });
    };

    if (window.particlesJS) {
      start();
      return () => observer?.disconnect();
    }

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
      script.async = true;
      document.body.appendChild(script);
    }

    script.onload = start;

    return () => {
      observer?.disconnect();
      if (script && script.parentElement && !existingScript) {
        script.parentElement.removeChild(script);
      }
    };
  }, [initParticles]);

  return (
    <div
      id="particles-js"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-hidden bg-linear-to-tr from-[#e3f2fd] via-[#90caf9] to-[#64b5f6] transition-colors duration-500 dark:from-[#000814] dark:via-[#003566] dark:to-[#0077b6]"
    />
  );
}