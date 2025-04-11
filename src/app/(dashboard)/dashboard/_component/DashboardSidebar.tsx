"use client";
import Logo from "@/components/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { getAvatarName } from "@/lib/getAvatarName";
import { cn } from "@/lib/utils";
import { Popover } from "@radix-ui/react-popover";
import { FileIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import CreateProject from "./CreateProject";
import Axios from "@/lib/Axios";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const session = useSession();
  const [data,setData] = useState([])
  const [isLoading,setIsLoading] = useState(true)


  const fetchData = async()=>{
    setIsLoading(true)
    try {
        const response = await Axios.get("/api/recent-project-update")

        if(response.status === 200){
          setData(response.data.data)
        }
    } catch (error) {
      
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    fetchData()
  },[])

  const recentProject = [
    {
      name: "Chat app",
      link: "/editor/kdsjgsd?file",
    },
  ];

  console.log("recent project",data)
  return (
    <Sidebar className="overflow-hidden">
      <SidebarHeader className="px-4">
        <Logo w={100} />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <CreateProject/>

        <div className="px-2 w-full">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link
                href={"/dashboard"}
                className={cn(
                  "w-full min-w-full block px-2 rounded-md",
                  pathname === "/dashboard" && "bg-slate-100"
                )}
              >
                Dashboard
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Recent Project</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.map((item : any) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/editor/${item?._id}?file=index.html`}>
                      <FileIcon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Popover>
          <PopoverTrigger>
            <div className="flex items-center w-full justify-between px-2 bg-primary/5 rounded-md">
              <p className="font-semibold py-2">{session.data?.user?.name}</p>
              <Avatar className="w-10 h-10 drop-shadow">
                <AvatarImage src={session.data?.user?.image as string} />
                <AvatarFallback>
                  {getAvatarName(session.data?.user.name as string)}
                </AvatarFallback>
              </Avatar>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-[0.5px] bg-gray-200"></div>

            <Button
              variant={"destructive"}
              className="w-full mt-4 cursor-pointer"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
