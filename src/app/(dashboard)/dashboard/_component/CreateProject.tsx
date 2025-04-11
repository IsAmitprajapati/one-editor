"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Axios from "@/lib/Axios";
import { useRouter } from "next/navigation";

type TCreateProject = {
  buttonVarient?: "outline" | "default";
};

const CreateProject = ({ buttonVarient }: TCreateProject) => {
  const [projectName, setProjectName] = useState<string>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProject = async (e: any) => {
    e.preventDefault();

    if (!projectName) {
      toast.error("Project name is required");
    }

    try {
      setIsLoading(true);
      const response = await Axios.post("/api/project", {
        name: projectName,
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        router.push(`/editor/${response?.data?.data?._id}?file=index.html`);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={buttonVarient ?? "outline"}
          className="cursor-pointer my-4 mx-2"
        >
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <form className="my-4 grid gap-4">
            <Input
              disabled={isLoading}
              placeholder="Enter your project name"
              value={projectName ?? ""}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <Button
              disabled={isLoading}
              className="cursor-pointer"
              onClick={handleCreateProject}
            >
              {
                isLoading ? "Loading..." : "Create Project"
              }       
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProject;
