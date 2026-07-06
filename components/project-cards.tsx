import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const data = [
  {
    id: '/projects/area',
    title: 'Area',
    total: 23,
    state: 'online',
    description: 'Reducing the detection area for focused car inspections.',
    accuracy: 91,
    prompt: 'v4.2',
  },
  {
    id: '/projects/simple',
    title: 'Simple',
    total: 23,
    state: 'processing',
    description: 'Simple parsing rules for clean, minimal detections.',
    accuracy: 89,
    prompt: 'v3.8',
  },
  {
    id: '/projects/tags',
    title: 'Tags',
    total: 23,
    state: 'online',
    description: 'Uses tags to specialize what the project should look for.',
    accuracy: 94,
    prompt: 'v5.1',
  },
];

const ProjectCard = ({
  item,
}: {
  item: {
    id: string;
    title: string;
    total: number;
    state: string;
    description: string;
    accuracy: number;
    prompt: string;
  };
}) => {
  const currState = item.state === 'online';

  return (
    <Link href={item.id} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-xl">{item.title}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2">{item.description}</CardDescription>
            </div>

            <CardAction>
              <Badge variant={currState ? 'secondary' : 'outline'}>
                {currState ? 'Online' : 'Processing'}
              </Badge>
            </CardAction>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Detections</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{item.total}</p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Prompt</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{item.prompt}</p>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Quality</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{item.accuracy}%</p>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t bg-muted/20 px-6 py-4">
          <p className="text-sm text-muted-foreground">Click to open project workspace</p>
          <Button size="sm" variant="secondary">
            Open project
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export function Projects() {
  return (
    <div className="space-y-6">
      <div className="flex w-full justify-end">
        <Button>Create project</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total projects</CardTitle>
            <CardDescription>All active research spaces</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">12</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg quality</CardTitle>
            <CardDescription>Across current project prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">91%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.map((item) => (
          <ProjectCard item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}
