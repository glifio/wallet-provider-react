import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import { initialState as wpInitialState } from '../../../lib/WalletProvider/state'
import { initialLedgerState } from '../../../utils/ledger'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { mockFetchDefaultWallet } from '../../../test-utils/composeMockAppTree/createWalletProviderContextFuncs'
import ConnectLedger from '.'
import { flushPromises } from '../../../test-utils'
import { TESTNET_PATH_CODE } from '../../../constants'
import createPath from '../../../utils/createPath'

describe('Ledger configuration', () => {
  let backSpy, nextSpy
  afterEach(() => {
    jest.clearAllMocks()
    backSpy = jest.fn()
    nextSpy = jest.fn()
    cleanup()
  })

  test('it renders correctly', () => {
    const { Tree } = composeMockAppTree('preOnboard')
    const { container } = render(
      <Tree>
        <ConnectLedger back={backSpy} next={nextSpy} />
      </Tree>
    )
    expect(screen.getByText(/Unlock & Open/)).toBeInTheDocument()
    expect(
      screen.getByText(
        /Please unlock your Ledger device and open the Filecoin App/
      )
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders inUseByAnotherApp ledger error correctly', () => {
    const mockWPState = {
      ...wpInitialState,
      ledger: {
        ...initialLedgerState,
        inUseByAnotherApp: true
      }
    }

    const { Tree } = composeMockAppTree('preOnboard', {
      walletProviderInitialState: mockWPState
    })
    const { container } = render(
      <Tree>
        <ConnectLedger back={backSpy} next={nextSpy} />
      </Tree>
    )
    expect(
      screen.getByText(/(Most of the time, this is Ledger Live!)/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Please quit any other App using your Ledger device./)
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders connectedFailure ledger error in the UI correctly', () => {
    const mockWPState = {
      ...wpInitialState,

      ledger: {
        ...initialLedgerState,
        connectedFailure: true
      }
    }

    const { Tree } = composeMockAppTree('preOnboard', {
      walletProviderInitialState: mockWPState
    })
    const { container } = render(
      <Tree>
        <ConnectLedger back={backSpy} next={nextSpy} />
      </Tree>
    )
    expect(
      screen.getByText('Is your Ledger device plugged in?')
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders locked ledger error correctly', () => {
    const mockWPState = {
      ...wpInitialState,
      ledger: {
        ...initialLedgerState,
        locked: true
      }
    }

    const { Tree } = composeMockAppTree('preOnboard', {
      walletProviderInitialState: mockWPState
    })
    const { container } = render(
      <Tree>
        <ConnectLedger back={backSpy} next={nextSpy} />
      </Tree>
    )
    expect(
      screen.getByText('Is your Ledger device unlocked?')
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders filecoinAppNotOpen error in the UI correctly', () => {
    const mockWPState = {
      ...wpInitialState,
      ledger: {
        ...initialLedgerState,
        filecoinAppNotOpen: true
      }
    }

    const { Tree } = composeMockAppTree('preOnboard', {
      walletProviderInitialState: mockWPState
    })
    const { container } = render(
      <Tree>
        <ConnectLedger back={backSpy} next={nextSpy} />
      </Tree>
    )
    expect(
      screen.getByText('Is the Filecoin App open on your Ledger device?')
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders replug error correctly', () => {
    const mockWPState = {
      ...wpInitialState,
      ledger: {
        ...initialLedgerState,
        replug: true
      }
    }

    const { Tree } = composeMockAppTree('preOnboard', {
      walletProviderInitialState: mockWPState
    })
    const { container } = render(
      <Tree>
        <ConnectLedger back={backSpy} next={nextSpy} />
      </Tree>
    )
    expect(
      screen.getByText(
        'Please quit the Filecoin app, and unplug/replug your Ledger device, and try again.'
      )
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders busy error in the UI correctly', () => {
    const mockWPState = {
      ...wpInitialState,
      ledger: {
        ...initialLedgerState,
        busy: true
      }
    }

    const { Tree } = composeMockAppTree('preOnboard', {
      walletProviderInitialState: mockWPState
    })
    const { container } = render(
      <Tree>
        <ConnectLedger back={backSpy} next={nextSpy} />
      </Tree>
    )
    expect(
      screen.getByText('Is your Ledger device locked or busy?')
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it fetches the default wallet and adds it to the wallet provider state', async () => {
    const { Tree, getWalletProviderState } = composeMockAppTree('preOnboard')
    const {
      /* container */
    } = render(
      <Tree>
        <ConnectLedger back={backSpy} next={nextSpy} />
      </Tree>
    )

    await act(async () => {
      fireEvent.click(
        screen.getByText('My Ledger device is unlocked & Filecoin app open')
      )
      await flushPromises()
    })

    expect(mockFetchDefaultWallet).toHaveBeenCalled()
    const wallet = getWalletProviderState().wallets[0]
    expect(wallet.address).toBeTruthy()
    expect(wallet.path).toBe(createPath(TESTNET_PATH_CODE, 0))
  })

  test('it calls next on success', async () => {
    const { Tree } = composeMockAppTree('preOnboard')
    const {
      /* container */
    } = render(
      <Tree>
        <ConnectLedger back={backSpy} next={nextSpy} />
      </Tree>
    )

    await act(async () => {
      fireEvent.click(
        screen.getByText('My Ledger device is unlocked & Filecoin app open')
      )
      await flushPromises()
    })
    expect(nextSpy).toHaveBeenCalled()
  })
})
