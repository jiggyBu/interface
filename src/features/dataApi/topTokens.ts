import { useMemo } from 'react'
import { ChainId } from 'src/constants/chains'
import {
  SafetyLevel,
  TokenSortableField,
  useTopTokensQuery,
} from 'src/data/__generated__/types-and-hooks'
import { CurrencyInfo, GqlResult } from 'src/features/dataApi/types'
import { gqlTokenToCurrencyInfo, usePersistedError } from 'src/features/dataApi/utils'
import { toGraphQLChain } from 'src/utils/chainId'

export function usePopularTokens(
  chainFilter: ChainId,
  filterUnverified: Boolean
): GqlResult<CurrencyInfo[]> {
  const gqlChainFilter = toGraphQLChain(chainFilter)

  const { data, loading, error, refetch } = useTopTokensQuery({
    variables: {
      chain: gqlChainFilter,
      page: 1,
      pageSize: 100,
      orderBy: TokenSortableField.Volume,
    },
  })
  const persistedError = usePersistedError(loading, error)

  const formattedData = useMemo(() => {
    if (!data || !data.topTokens) return

    return data.topTokens
      .map((token) => {
        if (!token) return null

        if (filterUnverified && token.project?.safetyLevel !== SafetyLevel.Verified) return null

        return gqlTokenToCurrencyInfo(token)
      })
      .filter((c): c is CurrencyInfo => Boolean(c))
  }, [data, filterUnverified])

  return useMemo(
    () => ({ data: formattedData, loading, error: persistedError, refetch }),
    [formattedData, loading, persistedError, refetch]
  )
}
