"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";

interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

const Pupil = ({ 
  size = 12, 
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY
}: PupilProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };

    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }

    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;

    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

const EyeBall = ({ 
  size = 48, 
  pupilSize = 16, 
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  forceLookX,
  forceLookY
}: EyeBallProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };

    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }

    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;

    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor,
        overflow: 'hidden',
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
};

function SearchParamsSync({ setIsSignUp }: { setIsSignUp: React.Dispatch<React.SetStateAction<boolean>> }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const signupParam = searchParams.get("signup");
    setIsSignUp(signupParam === "true");
  }, [searchParams, setIsSignUp]);
  return null;
}

function LoginPageContent() {
  const router = useRouter();
  const { login, register, googleLogin, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      setIsLoading(true);
      try {
        const res = await googleLogin(tokenResponse.access_token);
        if (res?.data?.user?.role === 'admin') {
          router.push('/admin/workshops');
        } else {
          router.push(res?.data?.user?._id ? `/dashboard/${res.data.user._id}` : "/dashboard");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Google login failed. Please try again.");
        setIsLoading(false);
      }
    },
    onError: () => {
      setError("Google login failed. Please try again.");
    }
  });

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  // searchParams sync is handled by SearchParamsSync component to avoid page-level suspension

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Blinking effect for purple character
  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;

    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsPurpleBlinking(true);
        setTimeout(() => {
          setIsPurpleBlinking(false);
          scheduleBlink();
        }, 150);
      }, getRandomBlinkInterval());

      return blinkTimeout;
    };

    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // Blinking effect for black character
  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;

    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsBlackBlinking(true);
        setTimeout(() => {
          setIsBlackBlinking(false);
          scheduleBlink();
        }, 150);
      }, getRandomBlinkInterval());

      return blinkTimeout;
    };

    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // Looking at each other animation when typing starts
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => {
        setIsLookingAtEachOther(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  // Purple sneaky peeking animation when typing password and it's visible
  useEffect(() => {
    if (password.length > 0 && showPassword) {
      const schedulePeek = () => {
        const peekInterval = setTimeout(() => {
          setIsPurplePeeking(true);
          setTimeout(() => {
            setIsPurplePeeking(false);
          }, 800);
        }, Math.random() * 3000 + 2000);
        return peekInterval;
      };

      const firstPeek = schedulePeek();
      return () => clearTimeout(firstPeek);
    } else {
      setIsPurplePeeking(false);
    }
  }, [password, showPassword]);

  const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;

    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));

    return { faceX, faceY, bodySkew };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }

        // Register the user
        await register(name, email, password);
        // Automatically login on success
        const res = await login(email, password);
        if (res?.data?.user?.role === 'admin') {
          router.push('/admin/workshops');
        } else {
          router.push(res?.data?.user?._id ? `/dashboard/${res.data.user._id}` : "/dashboard");
        }
      } else {
        // Login the user
        const res = await login(email, password);
        if (res?.data?.user?.role === 'admin') {
          router.push('/admin/workshops');
        } else {
          router.push(res?.data?.user?._id ? `/dashboard/${res.data.user._id}` : "/dashboard");
        }
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(
        axiosError.response?.data?.message || 
        (isSignUp ? "Registration failed. Please try again." : "Login failed. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = (signUpMode: boolean) => {
    setError("");
    setIsSignUp(signUpMode);
    // Update the URL without a full page reload so it stays consistent
    const newUrl = signUpMode ? "/login?signup=true" : "/login";
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white text-slate-900 w-full font-sans">
      <Suspense fallback={null}>
        <SearchParamsSync setIsSignUp={setIsSignUp} />
      </Suspense>
      {/* Left Content Section */}
      <div 
        className="relative hidden lg:flex flex-col justify-between bg-slate-50 p-12 text-slate-800 border-r border-slate-100 overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="relative z-20">
          <Link href="/" className="flex items-center w-fit">
            <img
              src="/Logo/Logo.png"
              alt="Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="relative z-20 flex items-end justify-center h-[500px]">
          {/* Cartoon Characters */}
          <div className="relative" style={{ width: '550px', height: '400px' }}>
            {/* Purple tall rectangle character - Back layer */}
            <div 
              ref={purpleRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '70px',
                width: '180px',
                height: (isTyping || (password.length > 0 && !showPassword)) ? '440px' : '400px',
                backgroundColor: '#6C3FF5',
                borderRadius: '10px 10px 0 0',
                zIndex: 1,
                transform: (password.length > 0 && showPassword)
                  ? `skewX(0deg)`
                  : (isTyping || (password.length > 0 && !showPassword))
                    ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)` 
                    : `skewX(${purplePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              {/* Eyes */}
              <div 
                className="absolute flex gap-8 transition-all duration-700 ease-in-out"
                style={{
                  left: (password.length > 0 && showPassword) ? `${20}px` : isLookingAtEachOther ? `${55}px` : `${45 + purplePos.faceX}px`,
                  top: (password.length > 0 && showPassword) ? `${35}px` : isLookingAtEachOther ? `${65}px` : `${40 + purplePos.faceY}px`,
                }}
              >
                <EyeBall 
                  size={18} 
                  pupilSize={7} 
                  maxDistance={5} 
                  eyeColor="white" 
                  pupilColor="#2D2D2D" 
                  isBlinking={isPurpleBlinking}
                  forceLookX={(password.length > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={(password.length > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                />
                <EyeBall 
                  size={18} 
                  pupilSize={7} 
                  maxDistance={5} 
                  eyeColor="white" 
                  pupilColor="#2D2D2D" 
                  isBlinking={isPurpleBlinking}
                  forceLookX={(password.length > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={(password.length > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                />
              </div>
            </div>

            {/* Black tall rectangle character - Middle layer */}
            <div 
              ref={blackRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '240px',
                width: '120px',
                height: '310px',
                backgroundColor: '#2D2D2D',
                borderRadius: '8px 8px 0 0',
                zIndex: 2,
                transform: (password.length > 0 && showPassword)
                  ? `skewX(0deg)`
                  : isLookingAtEachOther
                    ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                    : (isTyping || (password.length > 0 && !showPassword))
                      ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)` 
                      : `skewX(${blackPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              {/* Eyes */}
              <div 
                className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                style={{
                  left: (password.length > 0 && showPassword) ? `${10}px` : isLookingAtEachOther ? `${32}px` : `${26 + blackPos.faceX}px`,
                  top: (password.length > 0 && showPassword) ? `${28}px` : isLookingAtEachOther ? `${12}px` : `${32 + blackPos.faceY}px`,
                }}
              >
                <EyeBall 
                  size={16} 
                  pupilSize={6} 
                  maxDistance={4} 
                  eyeColor="white" 
                  pupilColor="#2D2D2D" 
                  isBlinking={isBlackBlinking}
                  forceLookX={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
                />
                <EyeBall 
                  size={16} 
                  pupilSize={6} 
                  maxDistance={4} 
                  eyeColor="white" 
                  pupilColor="#2D2D2D" 
                  isBlinking={isBlackBlinking}
                  forceLookX={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={(password.length > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
                />
              </div>
            </div>

            {/* Orange semi-circle character - Front left */}
            <div 
              ref={orangeRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '0px',
                width: '240px',
                height: '200px',
                zIndex: 3,
                backgroundColor: '#FF9B6B',
                borderRadius: '120px 120px 0 0',
                transform: (password.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${orangePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              {/* Eyes - just pupils, no white */}
              <div 
                className="absolute flex gap-8 transition-all duration-200 ease-out"
                style={{
                  left: (password.length > 0 && showPassword) ? `${50}px` : `${82 + (orangePos.faceX || 0)}px`,
                  top: (password.length > 0 && showPassword) ? `${85}px` : `${90 + (orangePos.faceY || 0)}px`,
                }}
              >
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : undefined} />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : undefined} />
              </div>
            </div>

            {/* Yellow tall rectangle character - Front right */}
            <div 
              ref={yellowRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '310px',
                width: '140px',
                height: '230px',
                backgroundColor: '#E8D754',
                borderRadius: '70px 70px 0 0',
                zIndex: 4,
                transform: (password.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${yellowPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              {/* Eyes - just pupils, no white */}
              <div 
                className="absolute flex gap-6 transition-all duration-200 ease-out"
                style={{
                  left: (password.length > 0 && showPassword) ? `${20}px` : `${52 + (yellowPos.faceX || 0)}px`,
                  top: (password.length > 0 && showPassword) ? `${35}px` : `${40 + (yellowPos.faceY || 0)}px`,
                }}
              >
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : undefined} />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -5 : undefined} forceLookY={(password.length > 0 && showPassword) ? -4 : undefined} />
              </div>
              {/* Horizontal line for mouth */}
              <div 
                className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
                style={{
                  left: (password.length > 0 && showPassword) ? `${10}px` : `${40 + (yellowPos.faceX || 0)}px`,
                  top: (password.length > 0 && showPassword) ? `${88}px` : `${88 + (yellowPos.faceY || 0)}px`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-20 flex items-center gap-8 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Terms of Service
          </Link>
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Contact
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 size-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-[#6C3FF5]/5 rounded-full blur-3xl" />
      </div>

      {/* Right Login Section */}
      <div className="flex items-center justify-center p-8 bg-white text-slate-900">
        <div className="w-full max-w-[420px] overflow-hidden">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Link href="/" className="flex items-center">
              <img
                src="/Logo/Logo.png"
                alt="Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8 select-none relative h-10">
            {/* Login Header */}
            <div
              className={cn(
                "absolute inset-y-0 left-0 right-0 transition-all duration-500 ease-in-out flex flex-col justify-end text-left",
                isSignUp ? "opacity-0 translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"
              )}
            >
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
                Log In
              </h1>
            </div>

            {/* SignUp Header */}
            <div
              className={cn(
                "absolute inset-y-0 left-0 right-0 transition-all duration-500 ease-in-out flex flex-col justify-end text-left",
                isSignUp ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
              )}
            >
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
                Create Account
              </h1>
            </div>
          </div>

          {/* Login / Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-slate-900">
            {/* Sliding Inputs Wrapper */}
            <div 
              className="relative overflow-hidden transition-all duration-500 ease-in-out pt-1 pb-2"
              style={{ maxHeight: isSignUp ? '420px' : '240px' }}
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out w-[200%]"
                style={{ transform: `translateX(${isSignUp ? '-50%' : '0%'})` }}
              >
                {/* Panel 1: Login Form Fields */}
                <div 
                  className={cn(
                    "w-1/2 space-y-4 shrink-0 transition-all duration-500 ease-in-out",
                    isSignUp ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
                  )}
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email" className="text-sm font-normal text-slate-600">Email Address</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="anna@gmail.com"
                      value={email}
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                      required={!isSignUp}
                      className="h-12 px-5 bg-white border border-slate-200 hover:border-slate-300 rounded-full focus:border-slate-400 focus:ring-0 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-0 text-slate-900 placeholder-slate-400 outline-none transition-all shadow-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="login-password" className="text-sm font-normal text-slate-600">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={!isSignUp}
                        className="h-12 pl-5 pr-12 bg-white border border-slate-200 hover:border-slate-300 rounded-full focus:border-slate-400 focus:ring-0 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-0 text-slate-900 placeholder-slate-400 outline-none transition-all shadow-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950 data-[state=checked]:bg-slate-950 data-[state=checked]:text-white" 
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm font-normal cursor-pointer text-slate-600 select-none"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-slate-950 hover:underline font-bold underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Panel 2: Registration Form Fields */}
                <div 
                  className={cn(
                    "w-1/2 space-y-4 shrink-0 transition-all duration-500 ease-in-out",
                    isSignUp ? "opacity-100 scale-100" : "opacity-0 pointer-events-none scale-95"
                  )}
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="register-name" className="text-sm font-normal text-slate-600">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Anna Smith"
                      value={name}
                      autoComplete="name"
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                      required={isSignUp}
                      className="h-12 px-5 bg-white border border-slate-200 hover:border-slate-300 rounded-full focus:border-slate-400 focus:ring-0 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-0 text-slate-900 placeholder-slate-400 outline-none transition-all shadow-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="register-email" className="text-sm font-normal text-slate-600">Email Address</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="anna@gmail.com"
                      value={email}
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                      required={isSignUp}
                      className="h-12 px-5 bg-white border border-slate-200 hover:border-slate-300 rounded-full focus:border-slate-400 focus:ring-0 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-0 text-slate-900 placeholder-slate-400 outline-none transition-all shadow-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="register-password" className="text-sm font-normal text-slate-600">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={isSignUp}
                      className="h-12 px-5 bg-white border border-slate-200 hover:border-slate-300 rounded-full focus:border-slate-400 focus:ring-0 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-0 text-slate-900 placeholder-slate-400 outline-none transition-all shadow-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="register-confirm" className="text-sm font-normal text-slate-600">Confirm Password</Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={isSignUp}
                      className="h-12 px-5 bg-white border border-slate-200 hover:border-slate-300 rounded-full focus:border-slate-400 focus:ring-0 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-0 text-slate-900 placeholder-slate-400 outline-none transition-all shadow-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl transition-all animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-slate-950 hover:bg-slate-900 text-white rounded-full transition-all relative overflow-hidden shadow-none" 
              disabled={isLoading}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Login state text */}
                <span
                  className={cn(
                    "absolute transition-all duration-500 ease-in-out",
                    isSignUp ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
                  )}
                >
                  {isLoading ? "Signing in..." : "Log in"}
                </span>
                
                {/* SignUp state text */}
                <span
                  className={cn(
                    "absolute transition-all duration-500 ease-in-out",
                    isSignUp ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                  )}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </span>
              </div>
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6 select-none">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium lowercase">or</span>
            </div>
          </div>

          {/* Social Login Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button 
              variant="outline" 
              className="h-12 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full px-2 text-xs md:text-sm font-medium flex items-center justify-center gap-2 shadow-none transition-colors"
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={isLoading}
            >
              {/* Google G SVG logo */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.323 2.673 1.34 6.57l3.926 3.195z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.273c0-.818-.073-1.609-.209-2.373H12v4.582h6.445c-.277 1.482-1.114 2.736-2.373 3.582l3.7 2.873c2.164-1.99 3.418-4.927 3.418-8.664z"
                />
                <path
                  fill="#34A853"
                  d="M16.073 18.064A7.077 7.077 0 0 1 12 19.091a7.077 7.077 0 0 1-6.734-4.856L1.34 17.43C3.323 21.327 7.33 24 12 24c3.21 0 6.136-1.045 8.218-2.855l-4.145-3.08z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.266 14.235A7.045 7.045 0 0 1 4.909 12c0-.79.136-1.545.357-2.235L1.34 6.57A11.968 11.968 0 0 0 0 12c0 1.927.455 3.745 1.264 5.373l4.002-3.138z"
                />
              </svg>
              <span className="truncate">Continue with Google</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-12 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full px-2 text-xs md:text-sm font-medium flex items-center justify-center gap-2 shadow-none transition-colors"
              type="button"
            >
              {/* Facebook SVG logo */}
              <svg className="w-4 h-4 shrink-0 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="truncate">Continue with Facebook</span>
            </Button>
          </div>

          {/* Mode Toggle Footer */}
          <div className="text-center text-sm text-slate-500 mt-8 select-none relative h-6">
            <div
              className={cn(
                "absolute inset-0 transition-all duration-500 ease-in-out flex justify-center items-center",
                isSignUp ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
              )}
            >
              Already have an account?{" "}
              <button 
                type="button" 
                onClick={() => handleToggleMode(false)}
                className="text-slate-950 font-bold underline hover:text-slate-800 focus:outline-none cursor-pointer ml-1"
              >
                Log in
              </button>
            </div>
            <div
              className={cn(
                "absolute inset-0 transition-all duration-500 ease-in-out flex justify-center items-center",
                isSignUp ? "opacity-0 translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"
              )}
            >
              Don&apos;t have an account?{" "}
              <button 
                type="button" 
                onClick={() => handleToggleMode(true)}
                className="text-slate-950 font-bold underline hover:text-slate-800 focus:outline-none cursor-pointer ml-1"
              >
                Create an Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginPageContent />;
}
