"use client";
import React, { useRef, useState } from "react";
import { useEditorContext } from "../_provider/EditorProvider";
import * as motion from "motion/react-client";
import { Resizable } from "re-resizable";
import { ExternalLink, RotateCw, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useParams, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";

const BrowerRunCode = ({ children }: { children: React.ReactNode }) => {
  const { openBrowser, setOpenBrowser } = useEditorContext();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [drag, setDrag] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const fileName = searchParams.get("file");
  const [input, setInput] = useState<string>(`/${fileName}` || "");
  const { projectId } = useParams();
  const [refresh, setRefresh] = useState<boolean>(true);
  const session = useSession()

  const handleMouseDown = () => {
    setDrag(true);
  };

  const handleMouseUp = () => {
    setDrag(false);
  };

  const handleRefresh = ()=>{
    setRefresh(preve => !preve) // false
    setTimeout(() => {
        setRefresh(preve => !preve) // true
    }, 1000);
  }
  return (
    <div ref={containerRef}>
      {children}

      {openBrowser && (
        <motion.div
          drag={drag}
          dragConstraints={containerRef}
          dragElastic={0.2}
          className="absolute right-2 top-0 z-50"
        >
          <Resizable className="min-h-56 min-w-80 pb-2 shadow-lg overflow-clip rounded-sm z-50 bg-white">
            <div
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              className="bg-primary h-7 flex items-center cursor-grab px-1"
            >
              <X
                className="ml-auto cursor-pointer"
                onClick={() => setOpenBrowser(false)}
              />
            </div>
            <div className="relative">
              <Input
                className="h-8 rounded-t-none text-slate-600 pl-9 pr-9"
                placeholder="Enter file name"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <RotateCw
                size={16}
                className={cn(
                    "absolute top-2 left-2 hover:text-primary cursor-pointer",
                    !refresh && "animate-spin"
                )}
                onClick={handleRefresh}
              />
              <Link
                href={`/browser/${session?.data?.user?.name}/${projectId}/${input}`}
                target="_blank"
              >
                <ExternalLink
                    size={16}
                    className={cn(
                        "absolute top-2 right-2 hover:text-primary cursor-pointer"
                    )}
                />
              </Link>
              
            </div>
            <div className="h-full w-full">
              {refresh && (
                <iframe
                  className="w-full h-full min-h-full min-w-full"
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/file/${projectId}/${input}`}
                />
              )}
            </div>
          </Resizable>
        </motion.div>
      )}
    </div>
  );
};

export default BrowerRunCode;
