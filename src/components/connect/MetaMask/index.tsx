import { FC, useCallback, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { Box, IconMetaMaskFlask } from '@glif/react-components'
import { HelperText } from './Helper'
import {
  useWalletProvider,
  createWalletProvider
} from '../../../lib/WalletProvider'
import { connectFILSnap as _connectFILSnap } from '../../../utils/metamask'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

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

  const _next = useCallback(
    async (time = 500) => {
      // avoid screen blips
      await sleep(time)
      next()
    },
    [next]
  )

  const fetchMetaMaskState = useCallback(async () => {
    const provider = await connectMetaMask()
    if (provider) {
      dispatch(createWalletProvider(provider, 'METAMASK'))
      const wallet = await fetchDefaultWallet(provider)
      walletList([wallet])
      await _next()
    }
  }, [dispatch, walletList, fetchDefaultWallet, _next, connectMetaMask])

  useEffect(() => {
    if (state.metamask.loading) fetchMetaMaskState()
    // user clicked back...
    else if (
      !state.metamask.loading &&
      !state.metamask.error &&
      state.wallets.length > 0
    ) {
      _next(1200)
    }
  }, [
    fetchMetaMaskState,
    state.metamask.loading,
    state.wallets.length,
    state.metamask.error,
    _next
  ])

  const connectFILSnap = useCallback(async () => {
    await _connectFILSnap()
    await fetchMetaMaskState()
  }, [fetchMetaMaskState])

  return (
    <Box
      display='flex'
      flexDirection='row'
      justifyContent='space-around'
      flexWrap='wrap'
      width='100%'
    >
      <Box alignSelf='center' display='flex' justifyContent='center'>
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
          connectFILSnap={connectFILSnap}
        />
      </Box>
    </Box>
  )
}

export default ConnectMM
