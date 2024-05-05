import { Button } from "@/components/ui/button";
import { GetUser } from "@/lib/api";
import { UserType } from "@kinde-oss/kinde-typescript-sdk";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { Goals } from "@prisma/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Home() {
  const [user, setUser] = useState<UserType | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [goalsLoading, setGoalsLoading] = useState<boolean>(true);
  const [goals, setGoals] = useState<Goals[] | []>([]);

  useEffect(() => {
    const user = GetUser().then((res) => {
      if (!user) {
        console.log("No user");
      } else {
        setUser(res);
      }

      setAuthLoading(false);
    });

    const getGoals = async () => {
      const response = await fetch("/api/goals");
      if (!response.ok) return toast.error("Fetch failed for goals");

      await wait(1000);

      setGoalsLoading(false);

      const data = (await response.json()) as { goals: Goals[] };

      setGoals(data.goals);
    };

    getGoals();
  }, []);

  return (
    <main className="container mx-auto p-4">
      {authLoading ? (
        <Spinner />
      ) : (
        <>
          {user ? (
            <>
              <h1 className="text-3xl">
                Velkommen tilbage{" "}
                <span className="font-bold text-primary">
                  {user.given_name}!
                </span>
              </h1>

              {goalsLoading && (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <>
                      <Skeleton key={i} className="h-4 w-[500px]" />
                      <Skeleton key={i} className="h-4 w-[200px]" />
                    </>
                  ))}
                </div>
              )}

              {goals.length === 0 && !goalsLoading && (
                <span className="text-lg">Ingen mål fundet</span>
              )}
            </>
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
        </>
      )}
    </main>
  );
}
