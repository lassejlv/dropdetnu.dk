import { Button } from "@/components/ui/button";
import { GetUser } from "@/lib/api";
import { UserType } from "@kinde-oss/kinde-typescript-sdk";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { Goals } from "@prisma/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { wait } from "@/lib/helpers";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import GoalsList from "@/components/GoalsList";
import { LogOut } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<UserType | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [goalsLoading, setGoalsLoading] = useState<boolean>(true);
  const [responseLoading, setResponseLoading] = useState<boolean>(false);
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
      if (!response.ok) {
        throw new Error("Failed to fetch goals");
      }

      await wait(500);

      setGoalsLoading(false);

      const data = (await response.json()) as { goals: Goals[] };

      setGoals(data.goals);
    };

    getGoals();
  }, []);

  const handleNewGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const goal = data.get("goal") as string;
    const days = data.get("days") as string;

    if (!goal || !days) return toast.error("Udfyld venligst alle felter");

    setResponseLoading(true);

    const response = await fetch("/api/goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goal, days: Number(days) }),
    });

    if (!response.ok) return toast.error("Failed to create goal");

    await wait(500);

    setResponseLoading(false);

    // Click the esc button to close the dialog
    const esc = new KeyboardEvent("keydown", {
      key: "Escape",
    });

    //
    document.dispatchEvent(esc);

    toast.success("Mål oprettet");

    const json = await response.json();

    setGoals([...goals, json.goal]);
  };

  return (
    <main className="container mx-auto p-4">
      {authLoading ? (
        <Spinner />
      ) : (
        <>
          {user ? (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl">
                  Drop Det <span className="text-primary font-bold">Nu</span>
                </h1>

                <div>
                  <span className="text-lg">
                    Velkommen,{" "}
                    <span className="font-bold">
                      {user.given_name} {user.family_name}
                    </span>
                  </span>
                </div>
              </div>

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
                <div>
                  <span className="text-lg">Ingen mål fundet</span>
                </div>
              )}

              {goals.length > 0 && (
                <GoalsList
                  goals={goals}
                  removeItem={(id) => {
                    setGoals(goals.filter((goal) => goal.id !== id));
                  }}
                />
              )}

              <div className="flex items-center mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Opret mål</Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Opret et nyt mål</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleNewGoal} className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-right">
                          Hvad vil du droppe?
                        </Label>
                        <Textarea
                          id="goal"
                          name="goal"
                          placeholder="F.eks. rygning, sukker, alkohol osv."
                          className="col-span-3"
                        />
                      </div>
                      <div>
                        <Label htmlFor="name" className="text-right">
                          Hvor mange dage vil du droppe det?
                        </Label>
                        <Input
                          id="days"
                          name="days"
                          type="number"
                          placeholder="F.eks. 30"
                          className="col-span-3"
                        />
                      </div>

                      <Button type="submit" disabled={responseLoading}>
                        {responseLoading ? (
                          <>
                            {" "}
                            <Spinner /> Opretter...{" "}
                          </>
                        ) : (
                          "Opret Mål"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  className="ml-2"
                  onClick={async () => {
                    setResponseLoading(true);

                    const response = await fetch("/api/auth/logout");

                    if (!response.ok) {
                      toast.error("Failed to logout");
                      return;
                    }

                    await wait(500);

                    setUser(null);
                    setResponseLoading(false);
                    setGoals([]);
                    toast.success("Du er nu logget ud");
                  }}
                >
                  {responseLoading ? (
                    <Spinner />
                  ) : (
                    <>
                      <LogOut />
                      Log ud
                    </>
                  )}
                </Button>
              </div>
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
