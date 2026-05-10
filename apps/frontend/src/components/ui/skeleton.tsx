import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-md bg-[length:200%_100%] animate-shimmer',
        'bg-gradient-to-r from-muted via-accent/50 to-muted',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
