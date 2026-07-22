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
