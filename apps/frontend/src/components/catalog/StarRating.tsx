interface Props {
  rate: number
  count?: number
  size?: 'sm' | 'md'
}

export function StarRating({ rate, count, size = 'sm' }: Props) {
  const full = Math.floor(rate)
  const partial = rate - full
  const empty = 5 - full - (partial > 0 ? 1 : 0)

  const starSize = size === 'sm' ? 'text-xs' : 'text-base'

  return (
    <span className={`inline-flex items-center gap-1 ${starSize}`}>
      <span className="text-yellow-400 leading-none">
        {'★'.repeat(full)}
        {partial >= 0.5 ? '★' : partial > 0 ? '½' : ''}
        <span className="text-muted-foreground/40">{'★'.repeat(empty)}</span>
      </span>
      {count !== undefined && (
        <span className="text-muted-foreground">({count})</span>
      )}
    </span>
  )
}
