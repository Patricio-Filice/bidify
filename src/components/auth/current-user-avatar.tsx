"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/elements/button";
import { UserAvatar } from "@/elements/user-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/elements/dropdown-menu";

export function CurrentUserAvatar({ user }: { user: { name?: string | null, email?: string | null, image?: string | null } }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <UserAvatar user={user as never} ></UserAvatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-8" align="center" forceMount>
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => signOut()}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}