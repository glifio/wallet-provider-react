import { Dispatch } from 'react'
import Filecoin, {
  MetaMaskProvider,
  errors as walletProviderErrors
} from '@glif/filecoin-wallet-provider'
import { CoinType } from '@glif/filecoin-address'
import { enableFilecoinSnap } from '@glif/filsnap-adapter-test'
import { WalletProviderAction } from '../types'
import { clearError } from '../state'
import {
  metamaskConfigurationFail,
  metaMaskEnable
} from '../../../utils/metamask'

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
      console.log('reusing', metamaskSubprovider)
      dispatch({ type: 'METAMASK_CONFIGURED_SUCCESS' })

      return new Filecoin(metamaskSubprovider, {
        apiAddress: process.env.LOTUS_NODE_JSONRPC
      }) as Filecoin & { wallet: MetaMaskProvider }
    }

    const mm = await enableFilecoinSnap(
      {
        network: COIN_TYPE,
        rpc: {
          token: '',
          url: RPC_URL
        }
      },
      SNAP_HOST
    )

    const snap = await mm.getFilecoinSnapApi()

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
            snapInstalled: false
          })
        )
      } else {
        dispatch(metamaskConfigurationFail({}))
      }
    } else {
      console.log('UNHANDLED METAMASK ERROR', err.message)
      dispatch(metamaskConfigurationFail({}))
    }
  }
}
