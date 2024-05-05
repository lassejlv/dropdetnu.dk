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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

      await wait(500);

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
                <div>
                  <span className="text-lg">Ingen mål fundet</span>
                </div>
              )}

              {goals.length > 0 && (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="flex items-center">
                      <h2 className="text-lg">{goal.goal}</h2>
                      <span className="text-sm ml-2">
                        {goal.createdAt.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Opret mål</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Opret et nyt mål</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-right">
                        Hvad vil du droppe?
                      </Label>
                      <Textarea
                        id="name"
                        placeholder="F.eks. rygning, sukker, alkohol osv."
                        className="col-span-3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="name" className="text-right">
                        Hvor mange dage vil du droppe det?
                      </Label>
                      <Input
                        id="name"
                        type="number"
                        placeholder="F.eks. 30"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Opret Mål</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
