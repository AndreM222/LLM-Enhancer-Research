import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function PromptDiff() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Prompt diff</CardTitle>
            <CardDescription>
              Compare current best prompt against the previous best version.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Unchanged</Badge>
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Added
            </Badge>
            <Badge variant="destructive">Removed</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border">
            <div className="border-b flex px-3 py-2 text-sm font-medium justify-between w-full">
              <span>Previous best prompt prompt</span>
              <Badge>97%</Badge>
            </div>
            <pre className="max-h-90 overflow-auto bg-muted/30 p-4 text-sm leading-6">
              <span className="block bg-red-500/10 text-red-700 line-through">
                Look for scratches, dents, and broken lights.
              </span>
              <span className="block text-muted-foreground">
                Return bounding boxes for each visible issue.
              </span>
            </pre>
          </div>

          <div className="rounded-lg border">
            <div className="border-b flex px-3 py-2 text-sm font-medium justify-between w-full">
              <span>Current best prompt</span>
              <Badge>99%</Badge>
            </div>
            <pre className="max-h-90 overflow-auto bg-muted/30 p-4 text-sm leading-6">
              <span className="block bg-green-500/10 text-green-700">
                Look for scratches, dents, broken lights, and bumper misalignment.
              </span>
              <span className="block text-muted-foreground">
                Return bounding boxes for each visible issue.
              </span>
            </pre>
          </div>
        </div>

        <div className="flex gap-2">
          <Button>Accept changes</Button>
          <Button variant="outline">Keep old prompt</Button>
          <Button variant="secondary">Generate new revision</Button>
        </div>
      </CardContent>
    </Card>
  );
}
