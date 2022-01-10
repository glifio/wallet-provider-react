import { errors as walletProviderErrors } from '@glif/filecoin-wallet-provider'
import {
  isMetamaskSnapsSupported,
  hasMetaMask
  // isSnapInstalled
} from '@glif/filsnap-adapter-test'
import { MetaMaskState } from './state'

const isSnapInstalled = async (): Promise<boolean> => {
  return true
}

interface MetaMaskWindowProvider {
  isUnlocked: () => boolean
}

interface Ethereum {
  _metamask: MetaMaskWindowProvider
}

declare global {
  interface Window {
    ethereum: Ethereum
  }
}

export const isUnlocked = async (): Promise<boolean> => {
  return window.ethereum._metamask.isUnlocked()
}

const {
  MetaMaskNotInstalledError,
  MetaMaskSnapsNotSupportedError,
  MetaMaskLockedError,
  MetaMaskFilSnapNotInstalledError
} = walletProviderErrors

export const metaMaskEnable = async (): Promise<void> => {
  const mmInstalled = await hasMetaMask()
  if (!mmInstalled) {
    throw new MetaMaskNotInstalledError()
  }
  const mmSnapsSupported = await isMetamaskSnapsSupported()
  if (!mmSnapsSupported) {
    throw new MetaMaskSnapsNotSupportedError()
  }

  const mmUnlocked = await isUnlocked()
  if (!mmUnlocked) {
    throw new MetaMaskLockedError()
  }

  const filSnapInstalled = await isSnapInstalled()
  if (!filSnapInstalled) {
    throw new MetaMaskFilSnapNotInstalledError()
  }
}

export const reportMetaMaskError = (state: MetaMaskState): string => {
  if (!state.extInstalled) return 'Please install MetaMask to continue.'
  else if (!state.extUnlocked) return 'Your MetaMask is locked!'
  else if (!state.snapInstalled) return 'Please install FILSnap to continue.'
}
