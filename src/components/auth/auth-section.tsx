"use client";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/elements/skeleton";
import { GoogleSignInButton } from "./sign-in-google-button";
import { CurrentUserAvatar } from "./current-user-avatar";

export function AuthSection() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-[100px]" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {session ? (
        <>
          <CurrentUserAvatar user={session.user as never}></CurrentUserAvatar>
          <span className="hidden text-sm font-medium sm:inline-block">
            {session.user?.name || session.user?.email}
          </span>
        </>
      ) : (
        <GoogleSignInButton />
      )}
    </div>
  );
}