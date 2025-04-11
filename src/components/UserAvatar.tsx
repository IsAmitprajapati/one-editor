'use client'

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { getAvatarName } from "@/lib/getAvatarName";

const UserAvatar = () => {
  const session = useSession();

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar className="w-10 h-10 drop-shadow cursor-pointer">
          <AvatarImage src={session.data?.user?.image as string} />
          <AvatarFallback>
            {getAvatarName(session.data?.user.name as string)}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent>
        <p className="font-semibold py-2">{session.data?.user?.name}</p>
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
  );
};

export default UserAvatar;
