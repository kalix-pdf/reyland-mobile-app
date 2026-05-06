import { useCallback, useState } from 'react'

type RefreshAction = () => Promise<void> | void

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useRefreshControl(refreshAction?: RefreshAction, minDurationMs = 900) {
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    if (refreshing) {
      return
    }

    setRefreshing(true)

    try {
      await Promise.all([Promise.resolve(refreshAction?.()), delay(minDurationMs)])
    } finally {
      setRefreshing(false)
    }
  }, [minDurationMs, refreshAction, refreshing])

  return { refreshing, onRefresh }
}
