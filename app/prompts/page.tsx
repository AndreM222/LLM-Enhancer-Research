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

const prompts = [
  {
    id: 'p-001',
    name: 'Car damage detector v4',
    accuracy: '92%',
    status: 'best',
    updated: '2 hours ago',
    description: 'Improved front-bumper and fender detection with fewer false positives.',
  },
  {
    id: 'p-002',
    name: 'Car damage detector v3',
    accuracy: '88%',
    status: 'previous',
    updated: '1 day ago',
    description: 'Good baseline, but misses small scratches on dark cars.',
  },
];

export default function Prompts() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              12
            </CardTitle>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Best accuracy</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              92%
            </CardTitle>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Corrections</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              148
            </CardTitle>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Pending review</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              7
            </CardTitle>
          </CardContent>
        </Card>
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
