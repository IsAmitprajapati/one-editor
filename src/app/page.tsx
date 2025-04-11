'use client'
import Logo from "@/components/Logo";
import TextAnimationHeading from "@/components/TextAnimationHeading";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  const router = useRouter()
  return (
    <div
      className="min-h-screen bg-gradient-to-b via-white from-white to-primary overflow-hidden
  "
    >
      <header className="h-20 flex items-center">
        <div className="container px-4 mx-auto flex items-center justify-between gap-4">
          <Logo />
          <nav>
            <Button onClick={()=>router.push("/login")} className="cursor-pointer">Login</Button>
          </nav>
        </div>
      </header>

      {/* text */}
      <TextAnimationHeading
        classNameAnimationContainer="mx-auto"
      />

      {/***dashboard landing image */}
      <div className="mx-auto w-fit shadow-lg">
        <Image
          src={"/banner-animate.gif"}
          width={1000}
          height={400}
          alt="banner" 
        />
      </div>

      <footer className="bg-black py-4 mt-6 text-neutral-200">
        <p className="text-base font-semibold w-fit px-4 mx-auto">Made by <span className="text-primary">Dynamic Coding with Amit</span></p>
      </footer>
    </div>
  );
}
