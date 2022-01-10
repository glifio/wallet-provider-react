import { FC, useCallback, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import {
  Box,
  LandingPageContainer,
  LandingPageContentContainer,
  devices,
  space,
  IconMetaMaskFlask
} from '@glif/react-components'
import { HelperText } from './Helper'
import {
  useWalletProvider,
  createWalletProvider
} from '../../../lib/WalletProvider'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const LandingPageContentContainerStyled = styled(LandingPageContentContainer)`
  @media (min-width: ${devices.tablet}) {
    grid-template-rows: none;
    grid-template-areas: 'icon content';
    min-height: 60vh;
    padding-bottom: ${space()};
  }
`

const transitionIn = keyframes`
  from {
    opacity: 0;
    transform: scale(1.25)
  }

  to {
    opacity: 1;
    transform: scale(1.35)
  }
`

const MMFadeIn = styled.div`
  opacity: 0;
  animation-name: ${transitionIn};
  animation-delay: 0.25s;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
`

const ConnectMM: FC<{ next: () => void; back: () => void }> = ({
  next,
  back
}) => {
  const { dispatch, state, connectMetaMask, fetchDefaultWallet, walletList } =
    useWalletProvider()
  const fetchMetaMaskState = useCallback(async () => {
    const provider = await connectMetaMask()
    if (provider) {
      dispatch(createWalletProvider(provider, 'METAMASK'))
      const wallet = await fetchDefaultWallet(provider)
      walletList([wallet])
      // avoid screen blips
      await sleep(500)
      next()
    }
  }, [dispatch, walletList, fetchDefaultWallet, next, connectMetaMask])
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
          <MMFadeIn>
            <IconMetaMaskFlask height='231' width='245' />
          </MMFadeIn>
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
