import React, { FC, useState } from 'react'
import Filecoin, { HDWalletProvider } from '@glif/filecoin-wallet-provider'
import { validateMnemonic } from 'bip39'
import {
  Box,
  Button,
  OnboardCard,
  Title,
  Text,
  StepHeader,
  LoadingScreen,
  Input
} from '@glif/react-components'
import {
  createWalletProvider,
  useWalletProvider
} from '../../../../lib/WalletProvider'
import BurnerWalletWarning from '../Warning'

const InputMnemonic: FC<{ next: () => void; back: () => void }> = ({
  next,
  back
}) => {
  const { dispatch, fetchDefaultWallet, lotusApiAddr } = useWalletProvider()
  const [mnemonic, setMnemonic] = useState('')
  const [mnemonicError, setMnemonicError] = useState('')
  const [loadingNextScreen, setLoadingNextScreen] = useState(false)
  const { walletList } = useWalletProvider()
  const [acceptedWarning, setAcceptedWarning] = useState(false)

  const instantiateProvider = async () => {
    setLoadingNextScreen(true)
    setMnemonic('')
    try {
      const trimmed = mnemonic.trim()
      const isValid = validateMnemonic(trimmed)
      if (isValid) {
        const provider = new Filecoin(new HDWalletProvider(mnemonic), {
          apiAddress: lotusApiAddr
        })
        dispatch(createWalletProvider(provider, 'IMPORT_MNEMONIC'))
        const wallet = await fetchDefaultWallet(provider)
        walletList([wallet])
        next()
      } else {
        setMnemonicError('Invalid seed phrase')
      }
    } catch (err) {
      setLoadingNextScreen(false)
      setMnemonicError(err.message || JSON.stringify(err))
    }
  }

  return (
    <>
      {acceptedWarning ? (
        <>
          {loadingNextScreen ? (
            <LoadingScreen />
          ) : (
            <Box display='flex' flexDirection='column' justifyContent='center'>
              <OnboardCard>
                <StepHeader
                  currentStep={1}
                  totalSteps={2}
                  glyphAcronym='Sp'
                  m={2}
                  showStepper={false}
                />

                <Title mt={3}>Input, Import & Proceed</Title>
                <Text>Please input your seed phrase below to continue </Text>
                <Input.Mnemonic
                  error={mnemonicError}
                  setError={setMnemonicError}
                  value={mnemonic}
                  onChange={e => setMnemonic(e.target.value)}
                />
              </OnboardCard>
              <Box
                mt={6}
                display='flex'
                flexDirection='row'
                width='100%'
                justifyContent='space-between'
              >
                <Button
                  title='Back'
                  onClick={back}
                  variant='secondary'
                  mr={2}
                />
                <Button
                  title='Next'
                  disabled={!!(mnemonic.length === 0 || mnemonicError)}
                  onClick={instantiateProvider}
                  variant='primary'
                  ml={2}
                />
              </Box>
            </Box>
          )}
        </>
      ) : (
        <BurnerWalletWarning
          back={back}
          next={() => setAcceptedWarning(true)}
        />
      )}
    </>
  )
}

export default InputMnemonic
