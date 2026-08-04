import { Workspace } from '@/lib/mockApi';
import { cn } from '@/lib/utils';
import { AccountPicture } from './account-banner';

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
  workspace: Workspace;
  size?: BannerSize;
}) {
  const s = sizeConfig[size];

  return (
    <div className="flex items-center gap-3">
      <AccountPicture name={workspace.name} avatar={workspace.logo} size="lg" />
      <div className="grid">
        <span className={cn('truncate font-medium', s.name)}>{workspace.name}</span>
        <span className={cn('truncate text-gray-500', s.name)}>{workspace.plan}</span>
      </div>
    </div>
  );
}
