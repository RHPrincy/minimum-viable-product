
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { ProgressBar } from './ProgressBar';
import { Badge } from './Badge';
import { Avatar } from './Avatar';

interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    status: string;
    deadline: string;
    progress?: number;
    assignee?: {
        name: string;
        avatar?: string;
    };
    onClick?: () => void;
}

const TaskCard = ({
    className,
    title,
    description,
    status,
    deadline,
    progress = 0,
    assignee,
    onClick,
    ...props
}: TaskCardProps) => {
    const statusVariant = {
        'to do': 'info',
        'in progress': 'warning',
        'done': 'success'
    }[status] as 'info' | 'warning' | 'success';

    const formattedDeadline = new Date(deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    return (
        <Card
            variant="glass"
            className={cn('cursor-pointer transition-all hover:shadow-md', className)}
            onClick={onClick}
            {...props}
        >
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="line-clamp-1 text-base">{title}</CardTitle>
                    <Badge variant={statusVariant} size="sm">
                        {status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                {description && (
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
                <ProgressBar
                    value={progress}
                    max={100}
                    size="sm"
                    variant={progress === 100 ? 'success' : 'default'}
                />
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                        Due {formattedDeadline}
                    </div>
                    {assignee && (
                        <Avatar
                            name={assignee.name}
                            src={assignee.avatar}
                            size="xs"
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export { TaskCard };
