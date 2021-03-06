import React, { FC, useEffect, useState } from 'react'
import { number } from 'prop-types'
import Filecoin, { HDWalletProvider } from '@glif/filecoin-wallet-provider'
import {
  Box,
  Button,
  OnboardCard,
  StepHeader,
  LoadingScreen
} from '@glif/react-components'
import { generateMnemonic } from '@zondax/filecoin-signing-tools/js'
import {
  useWalletProvider,
  createWalletProvider
} from '../../../../lib/WalletProvider'

import Walkthrough from './Walkthrough'
import Back from './Back'
import BurnerWalletWarning from '../Warning'

const Create: FC<{
  // we pass this optional prop to make testing the core wallet functionality easier
  initialWalkthroughStep?: number
  back: () => void
  next: () => void
}> = ({ initialWalkthroughStep, back, next }) => {
  const [mnemonic, setMnemonic] = useState('')
  const [walkthroughStep, setWalkthroughStep] = useState(initialWalkthroughStep)
  const [loading, setLoading] = useState(true)
  const [returningHome, setReturningHome] = useState(false)
  const [canContinue, setCanContinue] = useState(false)
  const [importSeedError, setImportSeedError] = useState(false)
  const [acceptedWarning, setAcceptedWarning] = useState(false)
  const { dispatch, fetchDefaultWallet, walletList, lotusApiAddr } =
    useWalletProvider()

  const nextStep = () => {
    setImportSeedError(false)
    if (walkthroughStep === 1) setWalkthroughStep(2)
    else if (walkthroughStep === 2 && canContinue) setWalkthroughStep(3)
    else if (walkthroughStep === 2) setImportSeedError(true)
    else if (walkthroughStep >= 3) setWalkthroughStep(walkthroughStep + 1)
  }

  useEffect(() => {
    setMnemonic(generateMnemonic())
    setLoading(false)
  }, [setMnemonic, setLoading])

  useEffect(() => {
    const instantiateProvider = async () => {
      try {
        const provider = new Filecoin(new HDWalletProvider(mnemonic), {
          apiAddress: lotusApiAddr
        })
        dispatch(createWalletProvider(provider, 'CREATE_MNEMONIC'))
        const wallet = await fetchDefaultWallet(provider)
        walletList([wallet])
        next()
      } catch (err) {
        setImportSeedError(err.message || JSON.stringify(err))
      }
    }
    if (walkthroughStep === 4 && !loading) {
      setLoading(true)
      instantiateProvider()
    }
  }, [
    dispatch,
    fetchDefaultWallet,
    mnemonic,
    walkthroughStep,
    loading,
    walletList,
    next,
    lotusApiAddr
  ])

  return (
    <>
      {acceptedWarning ? (
        <>
          {!returningHome ? (
            <>
              {loading || walkthroughStep === 4 ? (
                <LoadingScreen />
              ) : (
                <>
                  <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                  >
                    <OnboardCard
                      display='flex'
                      flexDirection='row'
                      flexWrap='wrap'
                      justifyContent='center'
                      maxWidth={16}
                    >
                      <StepHeader
                        currentStep={walkthroughStep}
                        totalSteps={3}
                        glyphAcronym='Sp'
                      />
                      {mnemonic && (
                        <Walkthrough
                          importSeedError={importSeedError}
                          canContinue={canContinue}
                          walkthroughStep={walkthroughStep}
                          mnemonic={mnemonic}
                          setCanContinue={setCanContinue}
                        />
                      )}
                    </OnboardCard>
                    <Box
                      mt={6}
                      display='flex'
                      width='100%'
                      justifyContent='space-between'
                    >
                      <Button
                        title='Back'
                        onClick={() => {
                          if (walkthroughStep === 2) setWalkthroughStep(1)
                          else setReturningHome(true)
                        }}
                        variant='secondary'
                        mr={2}
                      />
                      <Button
                        title={
                          walkthroughStep === 1
                            ? "I've recorded my seed phrase"
                            : 'Next'
                        }
                        onClick={nextStep}
                        variant='primary'
                        ml={2}
                      />
                    </Box>
                  </Box>
                </>
              )}
            </>
          ) : (
            <Back setReturningHome={setReturningHome} back={back} />
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

Create.propTypes = {
  initialWalkthroughStep: number
}

Create.defaultProps = {
  initialWalkthroughStep: 1
}

export default Create
