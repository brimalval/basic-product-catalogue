import { useState, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'

export function useInfiniteItems<T>(items: T[] | undefined, pageSize = 8) {
  const [limit, setLimit] = useState(pageSize)

  const loadMore = useCallback(() => {
    setLimit((prev) => prev + pageSize)
  }, [pageSize])

  const { ref: sentinelRef } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && items && limit < items.length) loadMore()
    },
  })

  const visible = items?.slice(0, limit) ?? []
  const hasMore = items ? limit < items.length : false

  return { visible, hasMore, sentinelRef }
}
