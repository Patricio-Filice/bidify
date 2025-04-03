"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { Avatar, AvatarFallback } from "./avatar"
import { User } from "@prisma/client"
import { getAcronym } from "@/lib/utils"

export function UserAvatar({
  user,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & { user: User }) {
  const nameAcronym = getAcronym(user.name)
  return <Avatar {...props}>
    <AvatarFallback>
        { nameAcronym }
    </AvatarFallback>
  </Avatar>
}