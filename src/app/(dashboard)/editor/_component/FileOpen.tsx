"use client";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { X } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const FileOpen = () => {
  const searchParams = useSearchParams();
  const fileName = searchParams.get("file");
  const router = useRouter();
  const { projectId } = useParams();

  return (
    <div className="flex items-center gap-2 bg-primary/10 h-11 sticky top-14 z-50 backdrop-blur-xl">
      <SidebarTrigger />
      {fileName && (
        <div className="flex items-center gap-1 bg-primar/5 px-1 border-2 border-transparent border-b-primary">
          <p className="max-w-sm text-ellipsis line-clamp-1">{fileName}</p>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => router.push(`/editor/${projectId}`)}
            className="cursor-pointer"
          >
            <X />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileOpen;
