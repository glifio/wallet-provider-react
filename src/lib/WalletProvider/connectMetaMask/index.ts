import { Dispatch } from 'react'
import Filecoin, {
  MetaMaskProvider,
  errors as walletProviderErrors
} from '@glif/filecoin-wallet-provider'
import { CoinType } from '@glif/filecoin-address'
import { WalletProviderAction } from '../types'
import { clearError } from '../state'
import {
  metamaskConfigurationFail,
  metaMaskEnable
} from '../../../utils/metamask'
import { MetamaskFilecoinSnap } from '@chainsafe/filsnap-adapter'
import { SnapConfig } from '@chainsafe/filsnap-types'

const COIN_TYPE = process.env.COIN_TYPE! as CoinType
const RPC_URL = process.env.LOTUS_NODE_JSONRPC! as string
const SNAP_HOST = process.env.FIL_SNAP_HOST! as string

export default async function connectMetaMask(
  dispatch: Dispatch<WalletProviderAction>,
  // if one already exists... use it
  metamaskSubprovider?: MetaMaskProvider
): Promise<Filecoin & { wallet: MetaMaskProvider }> {
  try {
    dispatch(clearError())
    dispatch({ type: 'METAMASK_RESET_STATE' })
    await metaMaskEnable()

    if (metamaskSubprovider) {
      dispatch({ type: 'METAMASK_CONFIGURED_SUCCESS' })

      return new Filecoin(metamaskSubprovider, {
        apiAddress: process.env.LOTUS_NODE_JSONRPC
      }) as Filecoin & { wallet: MetaMaskProvider }
    }

    const mm = new MetamaskFilecoinSnap(SNAP_HOST)

    const snapConfig: Partial<SnapConfig> = {
      network: COIN_TYPE,
      rpc: {
        token: '',
        url: RPC_URL
      }
    }
    const snap = await mm.getFilecoinSnapApi()
    await snap.configure(snapConfig)

    const provider = new Filecoin(new MetaMaskProvider({ snap }), {
      apiAddress: process.env.LOTUS_NODE_JSONRPC
    }) as Filecoin & { wallet: MetaMaskProvider }

    dispatch({ type: 'METAMASK_CONFIGURED_SUCCESS' })

    return provider
  } catch (err) {
    if (err instanceof Error) {
      if (err instanceof walletProviderErrors.MetaMaskNotInstalledError) {
        dispatch(metamaskConfigurationFail({ extInstalled: false }))
      } else if (
        err instanceof walletProviderErrors.MetaMaskSnapsNotSupportedError
      ) {
        dispatch(
          metamaskConfigurationFail({
            extInstalled: true,
            extUnlocked: true,
            extSupportsSnap: false
          })
        )
      } else if (err instanceof walletProviderErrors.MetaMaskLockedError) {
        dispatch(
          metamaskConfigurationFail({
            extInstalled: true,
            extSupportsSnap: true,
            extUnlocked: false
          })
        )
      } else if (
        err instanceof walletProviderErrors.MetaMaskFilSnapNotInstalledError
      ) {
        dispatch(
          metamaskConfigurationFail({
            extSupportsSnap: true,
            extInstalled: true,
            extUnlocked: true,
            snapInstalled: false
          })
        )
      } else {
        dispatch(metamaskConfigurationFail({}))
      }
    } else {
      if (err.code === -32603) {
        dispatch(
          metamaskConfigurationFail({
            extSupportsSnap: true,
            extInstalled: true,
            extUnlocked: true,
            snapEnabled: false,
            snapInstalled: true
          })
        )
        return
      }
      console.log('UNHANDLED METAMASK ERROR', err.message)
      dispatch(metamaskConfigurationFail({}))
    }
  }
}
