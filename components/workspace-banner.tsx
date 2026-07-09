import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

type BannerSize = keyof typeof sizeConfig;

const sizeConfig = {
  sm: { avatar: 'h-8 w-8', name: 'text-sm', email: 'text-xs' },
  md: { avatar: 'h-12 w-12', name: 'text-base', email: 'text-sm' },
  lg: { avatar: 'h-16 w-16', name: 'text-xl', email: 'text-base' },
} as const;

export function WorkspaceBanner({
  workspace,
  size = 'sm',
}: {
  workspace: {
    name: string;
    logo: string;
  };
  size?: BannerSize;
}) {
  const s = sizeConfig[size];

  return (
    <div className="flex items-center gap-3">
      <Avatar className={cn('m-[-7]', s.avatar)}>
        <AvatarImage src="" alt="shadcn" />
        <AvatarFallback className={cn(s.name)}>DV</AvatarFallback>
      </Avatar>
      <span className={cn('truncate font-medium', s.name)}>{workspace.name}</span>
    </div>
  );
}
