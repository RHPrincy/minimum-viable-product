
import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  src?: string;
  name: string;
  status?: 'online' | 'offline' | 'busy' | 'away' | null;
}

const Avatar = ({
  className,
  size = 'md',
  src,
  name,
  status = null,
  ...props
}: AvatarProps) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5'
  };

  const statusPositions = {
    xs: 'right-0 bottom-0',
    sm: 'right-0 bottom-0',
    md: 'right-0.5 bottom-0.5',
    lg: 'right-0.5 bottom-0.5',
    xl: 'right-1 bottom-1'
  };

  return (
    <div className={cn('relative', className)} {...props}>
      {src ? (
        <div
          className={cn(
            'relative flex shrink-0 overflow-hidden rounded-full',
            sizes[size]
          )}
        >
          <img 
            src={src} 
            alt={name} 
            className="aspect-square h-full w-full object-cover" 
          />
        </div>
      ) : (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground',
            sizes[size]
          )}
        >
          {initials}
        </div>
      )}
      
      {status && (
        <span
          className={cn(
            'absolute block rounded-full ring-2 ring-background',
            statusColors[status],
            statusSizes[size],
            statusPositions[size]
          )}
        />
      )}
    </div>
  );
};

export { Avatar };
