import { Button } from 'ui/src/components/button/Button'
import { Input, InputProps, Stack, Text } from 'ui/src'
import { useState } from 'react'
import { useAppDispatch } from '../../state'
import { authActions, authSagaName } from './saga'
import { useSagaStatus } from 'app/src/state/useSagaStatus'

export function usePasswordInput(
  defaultValue = ''
): Pick<InputProps, 'value' | 'onChangeText' | 'disabled'> {
  const [value, setValue] = useState(defaultValue)

  const onChangeText: InputProps['onChangeText'] = (newValue): void => {
    setValue(newValue)
  }

  return {
    value,
    disabled: !value,
    onChangeText,
  }
}

function Locked(): JSX.Element {
  const dispatch = useAppDispatch()
  const passwordInputProps = usePasswordInput()

  const { status } = useSagaStatus(authSagaName, undefined, false)

  const onPress = (): void => {
    dispatch(authActions.trigger({ password: passwordInputProps.value }))
  }

  return (
    <Stack padding="$spacing24" space="$spacing24">
      <Text color="$textPrimary" variant="headlineLarge">
        Unlock with password
      </Text>
      <Text color="$textPrimary" variant="headlineSmall">
        Status {status}
      </Text>
      <Input
        secureTextEntry
        {...passwordInputProps}
        backgroundColor="$background3"
        color="$textPrimary"
      />
      <Button onPress={onPress}>
        <Text>Unlock</Text>
      </Button>
    </Stack>
  )
}

export default Locked
