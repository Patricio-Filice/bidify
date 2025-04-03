"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { getAcronym } from "@/lib/utils"

export function UserAvatar({
  user,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & { user: { name: string, image?: string | null } }) {
  const nameAcronym = getAcronym(user.name)
  return <Avatar {...props}>
    <AvatarImage src={user.image || undefined} alt={`Avatar of the user ${user.name}`}></AvatarImage>
    <AvatarFallback>
        { nameAcronym }
    </AvatarFallback>
  </Avatar>
}