import { AnyAction } from '@reduxjs/toolkit'
import { Currency } from '@uniswap/sdk-core'
import React, { Dispatch, useEffect, useMemo, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { CurrencySelect } from 'src/components/CurrencySelector/CurrencySelect'
import { AnimatedFlex, Flex } from 'src/components/layout'
import { Text } from 'src/components/Text'
import { useActiveChainIds } from 'src/features/chains/utils'
import { useAllBalancesByChainId } from 'src/features/dataApi/balances'
import { useSwapActionHandlers } from 'src/features/transactions/swap/hooks'
import {
  CurrencyField,
  initialState as emptyState,
  TransactionState,
  transactionStateReducer,
} from 'src/features/transactions/transactionState/transactionState'
import { useDerivedTransferInfo, useInputAssetInfo } from 'src/features/transactions/transfer/hooks'
import { TransferReview } from 'src/features/transactions/transfer/TransferReview'
import { TransferStatus } from 'src/features/transactions/transfer/TransferStatus'
import { TransferTokenForm } from 'src/features/transactions/transfer/TransferTokenForm'
import { ANIMATE_SPRING_CONFIG } from 'src/features/transactions/utils'
import { useActiveAccount } from 'src/features/wallet/hooks'
import { dimensions } from 'src/styles/sizing'
import { flattenObjectOfObjects } from 'src/utils/objects'

interface TransferFormProps {
  prefilledState?: TransactionState
  onClose: () => void
}

export enum TransferStep {
  FORM,
  REVIEW,
  SUBMITTED,
}

type InnerContentProps = {
  dispatch: Dispatch<AnyAction>
  state: TransactionState
  step: TransferStep
  setStep: (step: TransferStep) => void
  onClose: () => void
}

function TransferInnerContent({ dispatch, state, step, setStep, onClose }: InnerContentProps) {
  const derivedTransferInfo = useDerivedTransferInfo(state)
  const assetType = derivedTransferInfo.currencyTypes[CurrencyField.INPUT]
  const inputAsset = derivedTransferInfo.currencies[CurrencyField.INPUT]
  const inputAssetInfo = useInputAssetInfo(assetType, inputAsset)

  switch (step) {
    case TransferStep.SUBMITTED:
      return (
        <TransferStatus
          derivedTransferInfo={derivedTransferInfo}
          inputAssetInfo={inputAssetInfo}
          txId={state.txId}
          onNext={onClose}
          onTryAgain={() => setStep(TransferStep.FORM)}
        />
      )
    case TransferStep.FORM:
      return (
        <TransferTokenForm
          derivedTransferInfo={derivedTransferInfo}
          dispatch={dispatch}
          inputAssetInfo={inputAssetInfo}
          state={state}
          onNext={() => setStep(TransferStep.REVIEW)}
        />
      )
    case TransferStep.REVIEW:
      return (
        <TransferReview
          derivedTransferInfo={derivedTransferInfo}
          dispatch={dispatch}
          inputAssetInfo={inputAssetInfo}
          state={state}
          onNext={() => setStep(TransferStep.SUBMITTED)}
          onPrev={() => setStep(TransferStep.FORM)}
        />
      )
  }
}

export function TransferFlow({ prefilledState, onClose }: TransferFormProps) {
  const [state, dispatch] = useReducer(transactionStateReducer, prefilledState || emptyState)
  const [step, setStep] = useState<TransferStep>(TransferStep.FORM)
  const { t } = useTranslation()

  const activeAccount = useActiveAccount()
  const chainIds = useActiveChainIds()
  const balances = useAllBalancesByChainId(activeAccount?.address, chainIds)
  const currenciesWithBalances = useMemo(
    () => flattenObjectOfObjects(balances.balances).map((b) => b.amount.currency),
    [balances.balances]
  )
  const { onSelectCurrency } = useSwapActionHandlers(dispatch)

  const screenXOffset = useSharedValue(0)
  useEffect(() => {
    const screenOffset = state.selectingCurrencyField !== undefined ? 1 : 0
    screenXOffset.value = withSpring(-(dimensions.fullWidth * screenOffset), ANIMATE_SPRING_CONFIG)
  }, [screenXOffset, state.selectingCurrencyField])

  const wrapperStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: screenXOffset.value,
        },
      ],
    }
  })

  return (
    <Flex fill bg="backgroundSurface" gap="xs" justifyContent="space-between" py="md">
      <AnimatedFlex grow row flex={1} gap="none" style={wrapperStyle}>
        <Flex grow gap="xs" py="xs" width="100%">
          <Text textAlign="center" variant="subhead">
            {t('Send')}
          </Text>
          <TransferInnerContent
            dispatch={dispatch}
            setStep={setStep}
            state={state}
            step={step}
            onClose={onClose}
          />
        </Flex>
        <CurrencySelect
          showNonZeroBalancesOnly
          currencies={currenciesWithBalances}
          onSelectCurrency={(currency: Currency) => onSelectCurrency(CurrencyField.INPUT, currency)}
        />
      </AnimatedFlex>
    </Flex>
  )
}
