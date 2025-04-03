"use client";

import { Button } from "@/elements/button";
import { signIn } from "next-auth/react";

export function GoogleSignInButton() {
  return (
    <Button 
      variant="outline" 
      className="w-full gap-2"
      onClick={() => signIn("google")}
    >
      Sign in with Google
    </Button>
  );
}