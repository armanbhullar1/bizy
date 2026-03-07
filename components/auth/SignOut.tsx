"use client";

import { Button } from "@/components/ui/button";

// Using Auth0 for authentication
export default function SignOut() {
  const handleSignOut = () => {
    // Redirect to Auth0 logout
    window.location.href = '/api/auth/logout'
  };

  return (
    <Button onClick={handleSignOut} type="button" variant="outline">
      Sign out
    </Button>
  );
}
