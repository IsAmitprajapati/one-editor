"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { TypeAnimation } from "react-type-animation";

type TextAnimationHeadingProps = {
  className?: string;
  classNameAnimationContainer? : string;
};

const TextAnimationHeading = ({ className, classNameAnimationContainer }: TextAnimationHeadingProps) => {
  return (
    <div className={cn("mx-auto text-2xl lg:text-5xl my-6 flex flex-col gap-3 lg:gap-5 font-bold text-center",className)}>
      <div className="text-primary drop-shadow-md">Build Space</div>
      <div className={cn(
        "w-fit  text-center",
        classNameAnimationContainer
      )}>
        <TypeAnimation
          sequence={[
            "Your Team.",
            1000, // wait 1s before replacing "Mice" with "Hamsters"
            "Your Ideas.",
            1000,
            "One Editor",
            1000,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
        />
      </div>
    </div>
  );
};

export default TextAnimationHeading;
