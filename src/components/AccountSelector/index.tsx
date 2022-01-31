import React, { useEffect, useMemo, useState } from 'react'
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
import { CoinType } from '@glif/filecoin-address'

import { useWalletProvider, Wallet } from '../../lib/WalletProvider'
import useWallet from '../../lib/WalletProvider/useWallet'
import HelperText from './HelperText'
import Create from './Create'
import { TESTNET_PATH_CODE } from '../../constants'

import createPath, { coinTypeCode } from '../../utils/createPath'
import converAddrToFPrefix from '../../utils/convertAddrToFPrefix'
import { COIN_TYPE_PROPTYPE } from '../../customPropTypes'
import { errorLogger } from '../../logger'

const AccountSelector = ({
  onSelectAccount,
  showSelectedAccount,
  helperText,
  title,
  coinType,
  nWalletsToLoad,
  test,
  isProd,
  back
}: {
  onSelectAccount: () => void
  showSelectedAccount: boolean
  helperText: string
  title: string
  coinType: CoinType
  nWalletsToLoad: number
  test: boolean
  isProd: boolean
  back?: () => void
}) => {
  const wallet = useWallet()
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const [loadingPage, setLoadingPage] = useState(true)
  const [uncaughtError, setUncaughtError] = useState('')
  const {
    walletProvider,
    walletList,
    switchWallet,
    getProvider,
    wallets,
    walletError,
    lotusApiAddr
  } = useWalletProvider()
  const router = useRouter()

  const [loadedFirstNWallets, setLoadedFirstNWallets] = useState(false)

  // automatically generate the first 5 wallets for the user to select from to avoid confusion for non tech folks
  useEffect(() => {
    const loadFirstNWallets = async () => {
      if (wallets.length < nWalletsToLoad) {
        try {
          const provider = await getProvider()

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
          errorLogger.error(
            err instanceof Error
              ? err.message
              : 'Error loading first N Wallets',
            'AccountSelector'
          )
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
    getProvider,
    walletProvider,
    loadedFirstNWallets,
    wallets,
    walletList,
    coinType,
    nWalletsToLoad
  ])

  const errorMsg = useMemo(() => {
    if (walletError()) return walletError()
    if (uncaughtError) return uncaughtError
    return ''
  }, [uncaughtError, walletError])

  const fetchNextAccount = async (index: number, ct: CoinType) => {
    setLoadingAccounts(true)
    try {
      const provider = await getProvider()

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
      errorLogger.error(
        err instanceof Error ? err.message : 'Error fetching next account',
        'AccountSelector'
      )
      setUncaughtError(err.message)
    }
    setLoadingAccounts(false)
  }

  return (
    <>
      <ButtonClose
        role='button'
        type='button'
        onClick={back || router.back}
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
                        isProd &&
                        w.path.split('/')[2] === `${TESTNET_PATH_CODE}'`
                      }
                      path={w.path}
                      // This is a hack to make testing the UI easier
                      // its hard to mock SWR + balance fetcher in the AccountCardAlt
                      // so we pass a manual balance to not rely on SWR for testing
                      balance={test ? '1' : null}
                      jsonRpcEndpoint={lotusApiAddr}
                      nDefaultWallets={nWalletsToLoad}
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
  nWalletsToLoad: number,
  back: func,
  isProd: bool
}

AccountSelector.defaultProps = {
  showSelectedAccount: true,
  test: false,
  nWalletsToLoad: 5,
  isProd: false
}

export default AccountSelector
