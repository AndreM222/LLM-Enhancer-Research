import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

const data = [
  {
    id: '/',
    title: 'Area',
    total: 23,
    state: 'online',
    description: 'Reducing area of detection',
    accuracy: 0.1,
  },
  {
    id: '/',
    title: 'Simple',
    total: 23,
    state: 'online',
    description: 'Simple parsing',
    accuracy: 0.9,
  },
  {
    id: '/',
    title: 'Tags',
    total: 23,
    state: 'online',
    description: 'Using tags to specify tis behavior',
    accuracy: 3.1,
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
    accuracy: GLfloat;
  };
}) => {
  return (
    <Link href={item.id}>
      <Card className="border-b">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {item.title}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">{item.state}</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm h-full justify-between">
          <div className="line-clamp-1 flex gap-2 font-medium">{item.description}</div>
          <CardDescription className="space-x-1 space-y-1">
            <Badge variant="outline">Accuracy: {item.accuracy * 100}%</Badge>
            <Badge variant="outline">Total: {item.total}%</Badge>
          </CardDescription>
        </CardFooter>
      </Card>
    </Link>
  );
};

export function Projects() {
  return (
    <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {data.map((item) => (
        <ProjectCard item={item} key={item.title} />
      ))}
    </div>
  );
}
