import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type PromptVersion = {
  id: string;
  version: string;
  accuracy: number;
  content: string;
  updated: string;
};

type PromptDiffProps = {
  promptName: string;
  current: PromptVersion;
  previous: PromptVersion;
};

export default function PromptDiff({ promptName, current, previous }: PromptDiffProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-2">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Prompt behavior</CardTitle>

            <CardDescription>
              Compare the active and previous versions of{' '}
              <span className="font-medium text-foreground">{promptName}</span>.
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Previous {previous.version}</Badge>

            <Badge>Current {current.version}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <PromptVersionPanel
            label={`Previous · ${previous.version}`}
            accuracy={previous.accuracy}
            content={previous.content}
          />

          <PromptVersionPanel
            label={`Current · ${current.version}`}
            accuracy={current.accuracy}
            content={current.content}
            active
          />
        </div>

        <div className="rounded-lg border bg-muted/20 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Evaluation result</p>

              <p className="text-xs text-muted-foreground">
                Both versions were evaluated against the same project examples.
              </p>
            </div>

            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              +{current.accuracy - previous.accuracy}% accuracy
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PromptVersionPanel({
  label,
  accuracy,
  content,
  active = false,
}: {
  label: string;
  accuracy: number;
  content: string;
  active?: boolean;
}) {
  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between gap-3 border-b px-3 py-2">
        <span className="text-sm font-medium">{label}</span>
        <Badge variant={active ? 'default' : 'secondary'}>{accuracy}%</Badge>
      </div>

      <pre className="max-h-90 overflow-auto whitespace-pre-wrap bg-muted/30 p-4 text-sm leading-6">
        {content}
      </pre>
    </div>
  );
}
