"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Axios from "@/lib/Axios";
import { getFileIcon } from "@/lib/getFileIcon";
import { File, FilePlus } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type TProjectFile = {
  _id? : string;
  name: string;
  extension: string;
  projectId: string;
};

const EditorSidebar = () => {
  const [fileName, setFileName] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const { projectId } = useParams();
  const [openAddFile, setOpenAddFile] = useState(false);
  const [fileList, setFileList] = useState<TProjectFile[]>([]);
  const router = useRouter()

  const fetchAllFile = async () => {
    setIsLoading(true);
    try {
      const response = await Axios.get(
        `/api/project-file?projectId=${projectId}`
      );

      if (response.status === 200) {
        setFileList(response.data.data || []);
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFile = async () => {
    const payload = {
      name: fileName,
      projectId: projectId,
    };
    setIsLoading(true);
    try {
      const response = await Axios.post("/api/project-file", payload);

      if (response.status === 201) {
        toast.success(response.data.message);
        setOpenAddFile(false);
        fetchAllFile();
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFile();
  }, []);
  
  return (
    <Sidebar className="h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] top-14">
      <SidebarHeader className="bg-primary/10 flex flex-row items-center py-1">
        <div className="">
          <p>Files</p>
        </div>
        <div className="ml-auto">
          <Dialog open={openAddFile} onOpenChange={setOpenAddFile}>
            <DialogTrigger asChild>
              <Button
                size={"icon"}
                variant={"ghost"}
                className="cursor-pointer"
              >
                <FilePlus />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Add File</DialogTitle>
              <Input
                disabled={isLoading}
                value={fileName ?? ""}
                placeholder="Enter file name"
                onChange={(e) => setFileName(e.target.value)}
              />
              <Button disabled={isLoading} onClick={handleCreateFile}>
                Add File
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {isLoading ? (
          <p className="text-gray-400 py-4 mx-auto w-fit">Loading...</p>
        ) : fileList.length < 1 ? (
          <p className="text-gray-400 py-4 mx-auto w-fit">No File</p>
        ) : (
          <SidebarMenu className="py-4">
            {fileList.map((file, index) => {
              return (
                <SidebarMenuItem key={file?._id}  >
                  <SidebarMenuButton className="cursor-pointer" onClick={()=> router.push(`/editor/${projectId}?file=${file.name}`)}>
                    <div className="w-4 h-4">
                        <Image
                            alt={file.name}
                            width={18}
                            height={18}
                            src={getFileIcon(file.extension) || ""}
                        />
                    </div>
                    <p>{file.name}</p>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default EditorSidebar;
