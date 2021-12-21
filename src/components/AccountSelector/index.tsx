import React, { useEffect, useState } from 'react'
import { bool, func, number, string } from 'prop-types'
import { useRouter } from 'next/router'
import {
  AccountCardAlt,
  Box,
  Card,
  Glyph,
  Title,
  Menu,
  MenuItem,
  LoadingScreen,
  ButtonClose
} from '@glif/react-components'
import Filecoin from '@glif/filecoin-wallet-provider'
import { CoinType } from '@glif/filecoin-address'

import { useWalletProvider, Wallet } from '../../lib/WalletProvider'
import useWallet from '../../lib/WalletProvider/useWallet'
import { hasLedgerError, reportLedgerConfigError } from '../../utils/ledger'
import HelperText from './HelperText'
import Create from './Create'
import { LEDGER, TESTNET_PATH_CODE } from '../../constants'

import createPath, { coinTypeCode } from '../../utils/createPath'
import reportError from '../../utils/reportError'
import converAddrToFPrefix from '../../utils/convertAddrToFPrefix'
import { COIN_TYPE_PROPTYPE } from '../../customPropTypes'

const AccountSelector = ({
  onSelectAccount,
  showSelectedAccount,
  helperText,
  title,
  coinType,
  nWalletsToLoad,
  test
}: {
  onSelectAccount: () => void
  showSelectedAccount: boolean
  helperText: string
  title: string
  coinType: CoinType
  nWalletsToLoad: number
  test: boolean
}) => {
  const wallet = useWallet()
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const [loadingPage, setLoadingPage] = useState(true)
  const [uncaughtError, setUncaughtError] = useState('')
  const {
    ledger,
    connectLedger,
    walletProvider,
    walletList,
    switchWallet,
    loginOption,
    wallets
  } = useWalletProvider()
  const router = useRouter()

  const [loadedFirstNWallets, setLoadedFirstNWallets] = useState(false)

  // automatically generate the first 5 wallets for the user to select from to avoid confusion for non tech folks
  useEffect(() => {
    const loadFirstNWallets = async () => {
      if (wallets.length < nWalletsToLoad) {
        try {
          let provider = walletProvider as Filecoin
          if (loginOption === LEDGER) {
            provider = await connectLedger()
          }

          if (provider) {
            const addresses = await provider.wallet.getAccounts(
              wallets.length,
              nWalletsToLoad,
              coinType
            )

            await Promise.all(
              addresses.map(async (address, i) => {
                const balance = await provider.getBalance(address)
                const w: Wallet = {
                  balance,
                  address,
                  path: createPath(
                    coinTypeCode(coinType),
                    Number(i) + Number(wallets.length)
                  )
                }

                walletList([w])
              })
            )
            setLoadingPage(false)
          }
        } catch (err) {
          reportError(14, false, err.message, err.stack)
          setUncaughtError(err.message)
          setLoadingPage(false)
        }
      } else {
        setLoadedFirstNWallets(true)
        setLoadingPage(false)
      }
    }

    if (!loadedFirstNWallets) {
      setLoadedFirstNWallets(true)
      loadFirstNWallets()
    }
  }, [
    connectLedger,
    walletProvider,
    loadedFirstNWallets,
    wallets,
    loginOption,
    walletList,
    coinType,
    nWalletsToLoad
  ])

  let errorMsg = ''

  if (hasLedgerError({ ...ledger, otherError: uncaughtError })) {
    errorMsg = reportLedgerConfigError({ ...ledger, otherError: uncaughtError })
  }

  const fetchNextAccount = async (index: number, ct: CoinType) => {
    setLoadingAccounts(true)
    try {
      let provider = walletProvider as Filecoin
      if (loginOption === LEDGER) {
        provider = await connectLedger()
      }

      if (provider) {
        const [address] = await provider.wallet.getAccounts(
          index,
          index + 1,
          ct
        )

        const balance = await provider.getBalance(address)
        const w: Wallet = {
          balance,
          address: converAddrToFPrefix(address),
          path: createPath(coinTypeCode(ct), index)
        }
        walletList([w])
      }
    } catch (err) {
      reportError(15, false, err.message, err.stack)
      setUncaughtError(err.message)
    }
    setLoadingAccounts(false)
  }

  return (
    <>
      <ButtonClose
        role='button'
        type='button'
        onClick={router.back}
        position='absolute'
        top='0'
        right='0'
        mt={4}
        mr={4}
      />
      <Box display='flex' flexDirection='column' justifyItems='center'>
        {loadingPage ? (
          <LoadingScreen height='100vh' />
        ) : (
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            alignSelf='center'
            maxWidth={19}
            p={4}
          >
            <Card
              display='flex'
              flexDirection='column'
              justifyContent='space-between'
              border='none'
              width='100%'
              my={2}
              maxWidth={16}
              backgroundColor='blue.muted700'
            >
              <Box display='flex' alignItems='center'>
                <Glyph
                  acronym='Ac'
                  bg='core.primary'
                  borderColor='core.primary'
                  color='core.white'
                />
                <Title ml={2} color='core.primary'>
                  {title}
                </Title>
              </Box>
              <Box mt={3}>
                <HelperText text={helperText} />
              </Box>
            </Card>
            <Menu>
              <Box display='flex' flexWrap='wrap' justifyContent='center'>
                {wallets.map((w, i) => (
                  <MenuItem key={w.address}>
                    <AccountCardAlt
                      alignItems='center'
                      onClick={() => {
                        switchWallet(i)
                        onSelectAccount()
                      }}
                      address={w.address}
                      index={Number(w.path.split('/')[5])}
                      selected={
                        showSelectedAccount && w.address === wallet.address
                      }
                      legacy={
                        process.env.IS_PROD &&
                        w.path.split('/')[2] === `${TESTNET_PATH_CODE}'`
                      }
                      path={w.path}
                      // This is a hack to make testing the UI easier
                      // its hard to mock SWR + balance fetcher in the AccountCardAlt
                      // so we pass a manual balance to not rely on SWR for testing
                      balance={test ? '1' : null}
                      jsonRpcEndpoint={process.env.LOTUS_NODE_JSONRPC!}
                    />
                  </MenuItem>
                ))}
                <MenuItem>
                  <Create
                    errorMsg={errorMsg}
                    nextAccountIndex={wallets.length}
                    onClick={fetchNextAccount}
                    loading={loadingAccounts}
                    defaultCoinType={coinType}
                  />
                </MenuItem>
              </Box>
            </Menu>
          </Box>
        )}
      </Box>
    </>
  )
}

AccountSelector.propTypes = {
  onSelectAccount: func.isRequired,
  showSelectedAccount: bool,
  helperText: string.isRequired,
  title: string.isRequired,
  test: bool,
  coinType: COIN_TYPE_PROPTYPE,
  nWalletsToLoad: number
}

AccountSelector.defaultProps = {
  showSelectedAccount: true,
  test: false,
  nWalletsToLoad: 5
}

export default AccountSelector
