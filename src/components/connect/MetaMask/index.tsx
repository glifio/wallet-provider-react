import { FC, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import {
  Box,
  LandingPageContainer,
  LandingPageContentContainer,
  devices,
  space
} from '@glif/react-components'
import Filecoin, { MetaMaskProvider } from '@glif/filecoin-wallet-provider'
import { CoinType } from '@glif/filecoin-address'
import Image from 'next/image'
import {
  enableFilecoinSnap,
  isMetamaskSnapsSupported,
  hasMetaMask
  // isSnapInstalled
} from '@glif/filsnap-adapter-test'
import createPath, { coinTypeCode } from '../../../utils/createPath'
import MMLogo from '../../../../public/MM.jpeg'
import { HelperText } from './Helper'
import {
  useWalletProvider,
  createWalletProvider
} from '../../../lib/WalletProvider'
import { metamaskConfigurationFail, isUnlocked } from '../../../utils/metamask'

const LandingPageContentContainerStyled = styled(LandingPageContentContainer)`
  @media (min-width: ${devices.tablet}) {
    grid-template-rows: none;
    grid-template-areas: 'icon content';
    min-height: 60vh;
    padding-bottom: ${space()};
  }
`

const isSnapInstalled = async (): Promise<boolean> => {
  return true
}

const ConnectMM: FC<{ next: () => void; back: () => void }> = ({
  next,
  back
}) => {
  const { dispatch, state, fetchDefaultWallet, walletList } =
    useWalletProvider()

  console.log(state.metamask)
  const fetchMetaMaskState = useCallback(async () => {
    dispatch({ type: 'METAMASK_RESET_STATE' })
    const mmInstalled = await hasMetaMask()
    if (!mmInstalled) {
      dispatch(metamaskConfigurationFail({ extInstalled: false }))
      return
    }
    const mmSnapsSupported = await isMetamaskSnapsSupported()
    if (!mmSnapsSupported) {
      dispatch(
        metamaskConfigurationFail({
          extInstalled: true,
          extSupportsSnap: false
        })
      )
      return
    }

    const mmUnlocked = await isUnlocked()
    if (!mmUnlocked) {
      dispatch(
        metamaskConfigurationFail({
          extInstalled: true,
          extSupportsSnap: true,
          extUnlocked: false
        })
      )
      return
    }

    const filSnapInstalled = await isSnapInstalled()
    if (!filSnapInstalled) {
      dispatch(
        metamaskConfigurationFail({
          extSupportsSnap: true,
          extInstalled: true,
          snapInstalled: false
        })
      )
      return
    }

    const mm = await enableFilecoinSnap(
      {
        network: 'f',
        derivationPath: createPath(coinTypeCode(CoinType.MAIN), 3)
      },
      'local:http://localhost:8081'
    )

    const snap = await mm.getFilecoinSnapApi()

    const provider = new Filecoin(new MetaMaskProvider({ snap }), {
      apiAddress: process.env.LOTUS_NODE_JSONRPC
    })

    dispatch({ type: 'METAMASK_CONFIGURED_SUCCESS' })

    dispatch(createWalletProvider(provider, 'METAMASK'))
    const wallet = await fetchDefaultWallet(provider)
    walletList([wallet])
    next()
  }, [dispatch, walletList, fetchDefaultWallet, next])
  useEffect(() => {
    if (state.metamask.loading) fetchMetaMaskState()
  }, [fetchMetaMaskState, state.metamask.loading])
  return (
    <LandingPageContainer>
      <LandingPageContentContainerStyled>
        <Box
          width='100%'
          alignSelf='center'
          display='flex'
          justifyContent='center'
        >
          <Image src={MMLogo} alt='metamask_logo' />
        </Box>
        <Box
          height='100%'
          alignSelf='center'
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
        >
          <HelperText
            {...state.metamask}
            onRetry={fetchMetaMaskState}
            back={back}
          />
        </Box>
      </LandingPageContentContainerStyled>
    </LandingPageContainer>
  )
}

export default ConnectMM
