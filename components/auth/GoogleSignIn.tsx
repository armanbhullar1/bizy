"use client";

import { Button } from "@/components/ui/button";

// Note: Using Auth0 for authentication instead of Firebase
export default function GoogleSignIn() {
  const handleSignIn = () => {
    // Redirect to Auth0 login
    window.location.href = '/api/auth/login'
  };

  return (
    <Button onClick={handleSignIn} type="button">
      Sign in with Google
    </Button>
  );
}
