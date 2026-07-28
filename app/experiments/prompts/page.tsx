import PromptDiff from '@/components/promptDiff';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getPrompts } from '@/lib/mockApi';

const prompts = getPrompts();

export default function Prompts() {
  return (
    <div className="space-y-6">
      <PromptDiff />

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border p-5">
          <h2 className="font-medium">Experiment notes</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Store observations about false positives, edge cases, and model behavior.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {prompts.map((prompt) => (
          <Card key={prompt.id}>
            <CardHeader>
              <CardTitle>{prompt.name}</CardTitle>
              <CardAction>
                <Badge>{prompt.status}</Badge>
              </CardAction>
            </CardHeader>

            <CardContent>
              <CardDescription>{prompt.description}</CardDescription>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-medium">{prompt.accuracy}</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Updated</span>
                <span>{prompt.updated}</span>
              </div>
            </CardContent>

            <CardFooter className="grid grid-cols-2 gap-1">
              <Button>View</Button>
              <Button>Compare</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
