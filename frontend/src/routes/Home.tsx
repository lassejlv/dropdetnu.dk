import { Button } from "@/components/ui/button";
import { GetUser } from "@/lib/api";
import { UserType } from "@kinde-oss/kinde-typescript-sdk";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const user = GetUser().then((res) => {
      if (!user) {
        console.log("No user");
      } else {
        setUser(res);
      }
    });
  }, []);

  return (
    <main className="container mx-auto p-4">
      {user ? (
        <>Velkommen tilbage {user.given_name}!</>
      ) : (
        <>
          <Button
            onClick={() => {
              window.location.replace("/api/auth/login");
            }}
          >
            Login
          </Button>
          <Button
            onClick={() => {
              window.location.replace("/api/auth/register");
            }}
          >
            Opret Konto
          </Button>
        </>
      )}
    </main>
  );
}
