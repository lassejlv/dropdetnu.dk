import { type Goals } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import Spinner from "./Spinner";
import { toast } from "sonner";
import { wait } from "@/lib/helpers";

export default function GoalsList({
  goals,
  removeItem,
}: {
  goals: Goals[];
  removeItem: (id: string) => void;
}) {
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const getProcentage = (goal: Goals) => {
    const daysCompleted = Math.abs(
      Math.floor(
        (new Date().getTime() - new Date(goal.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
    const procentage = Math.round((daysCompleted / goal.days) * 100);
    return procentage;
  };

  return (
    <div className="grid grid-cols-1 gap-10 my-2">
      {goals.map((goal) => (
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between">
                <div>{goal.goal}</div>
                <div>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      setDeleteLoading(goal.id);

                      const response = await fetch(`/api/goals/${goal.id}`, {
                        method: "DELETE",
                      });

                      if (!response.ok) {
                        toast.error("Failed to delete goal");
                        return;
                      }

                      await wait(450);

                      setDeleteLoading(null);
                      removeItem(goal.id);
                      toast.success("Målet blev slettet!");
                    }}
                  >
                    {deleteLoading === goal.id ? <Spinner /> : <Trash2 />}
                  </Button>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={getProcentage(goal)} />
            <div className="text-sm text-gray-300 my-2">
              {getProcentage(goal)}% completed
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
