import { cleanup, render, screen, act } from '@testing-library/react'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { mockFetchDefaultWallet } from '../../../test-utils/composeMockAppTree/createWalletProviderContextFuncs'
import ConnectMetaMask from '.'
import { HelperText } from './Helper'
import { flushPromises } from '../../../test-utils'
import { TESTNET_PATH_CODE } from '../../../constants'
import createPath from '../../../utils/createPath'
import { initialMetaMaskState } from '../../../utils/metamask'

describe('metamask onboarding', () => {
  let backSpy, nextSpy
  afterEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    backSpy = jest.fn()
    nextSpy = jest.fn()
    cleanup()
  })

  test('it renders loading state', async () => {
    const { Tree } = composeMockAppTree('preOnboard')
    let res
    await act(async () => {
      res = render(
        <Tree>
          <ConnectMetaMask back={backSpy} next={nextSpy} />
        </Tree>
      )
    })
    expect(screen.getByText(/Connecting to FILSnap/)).toBeInTheDocument()

    expect(res.container.firstChild).toMatchSnapshot()
  })

  test('it calls the next spy when done loading', async () => {
    const { Tree } = composeMockAppTree('preOnboard')
    await act(async () => {
      render(
        <Tree>
          <ConnectMetaMask back={backSpy} next={nextSpy} />
        </Tree>
      )
    })
    await jest.runOnlyPendingTimers()
    await flushPromises()
    expect(nextSpy).toHaveBeenCalled()
  })

  test('it fetches the default wallet and adds it to the wallet provider state', async () => {
    const { Tree, getWalletProviderState } = composeMockAppTree('preOnboard')

    await act(async () => {
      render(
        <Tree>
          <ConnectMetaMask back={backSpy} next={nextSpy} />
        </Tree>
      )
      await flushPromises()
    })

    expect(mockFetchDefaultWallet).toHaveBeenCalled()
    const wallet = getWalletProviderState().wallets[0]
    expect(wallet.address).toBeTruthy()
    expect(wallet.path).toBe(createPath(TESTNET_PATH_CODE, 0))
  })

  describe('helper text', () => {
    const onRetry = jest.fn()
    const back = jest.fn()
    test('it renders loading', () => {
      render(
        <HelperText {...initialMetaMaskState} onRetry={onRetry} back={back} />
      )

      expect(screen.getByText(/Connecting to FILSnap/)).toBeInTheDocument()
    })

    test('it renders extension not installed', () => {
      const { Tree } = composeMockAppTree('preOnboard')

      const state = {
        ...initialMetaMaskState,
        extInstalled: false,
        loading: false
      }
      render(
        <Tree>
          <HelperText {...state} onRetry={onRetry} back={back} />
        </Tree>
      )

      expect(screen.getByText(/MetaMask not installed!/)).toBeInTheDocument()
    })

    test('it renders extension locked', () => {
      const { Tree } = composeMockAppTree('preOnboard')

      const state = {
        ...initialMetaMaskState,
        extInstalled: true,
        loading: false
      }
      render(
        <Tree>
          <HelperText {...state} onRetry={onRetry} back={back} />
        </Tree>
      )

      expect(screen.getByText(/MetaMask locked!/)).toBeInTheDocument()
    })

    test('it renders extension does not support snaps', () => {
      const { Tree } = composeMockAppTree('preOnboard')

      const state = {
        ...initialMetaMaskState,
        extInstalled: true,
        extUnlocked: true,
        loading: false
      }
      render(
        <Tree>
          <HelperText {...state} onRetry={onRetry} back={back} />
        </Tree>
      )

      expect(
        screen.getByText(/MetaMask doesn't support Snaps!/)
      ).toBeInTheDocument()
    })

    test.only('it renders extension does not support snaps', () => {
      const { Tree } = composeMockAppTree('preOnboard')

      const state = {
        ...initialMetaMaskState,
        extInstalled: true,
        extUnlocked: true,
        extSupportsSnap: true,
        loading: false
      }
      render(
        <Tree>
          <HelperText {...state} onRetry={onRetry} back={back} />
        </Tree>
      )

      expect(screen.getByText(/Install snap/)).toBeInTheDocument()
    })
  })
})
