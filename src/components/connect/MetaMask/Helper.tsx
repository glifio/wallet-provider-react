import { FC } from 'react'
import { ButtonV2, space, P } from '@glif/react-components'
import {
  MetaMaskState,
  METAMASK_STATE_PROPTYPES
} from '../../../utils/metamask'

const Connecting: FC = () => {
  return (
    <h2>
      Connecting to FILSnap
    </h2>
  )
}

export const HelperText: FC<
  MetaMaskState & {
    onRetry: () => void
    back: () => void
    connectFILSnap: () => void
  }
> = ({
  extInstalled,
  extSupportsSnap,
  snapInstalled,
  loading,
  extUnlocked,
  snapEnabled,
  connectFILSnap,
  onRetry,
  back
}) => {
  if (loading) return <Connecting />
  if (!extInstalled)
    return (
      <>
        <h2>MetaMask not installed!</h2>
        <P mb={space('large')}>
          Please{' '}
          <a
            target='_blank'
            rel='noreferrer noopener'
            href='https://metamask.io/flask/'
          >
            install MetaMask
          </a>{' '}
          to get started
        </P>
        <ButtonV2 mt={space('large')} onClick={() => window.location.reload()}>
          Try again
        </ButtonV2>
        <ButtonV2 mt={space('large')} onClick={back}>
          Back
        </ButtonV2>
      </>
    )
  if (!extUnlocked)
    return (
      <>
        <h2>MetaMask locked!</h2>
        <P mb={space('large')}>Please unlock MetaMask to get started</P>
        <ButtonV2 mt={space('large')} onClick={onRetry}>
          Try again
        </ButtonV2>
        <ButtonV2 mt={space('large')} onClick={back}>
          Back
        </ButtonV2>
      </>
    )
  if (!extSupportsSnap)
    return (
      <>
        <h2>MetaMask doesn&apos;t support Snaps!</h2>
        <P
          css={`
            margin-bottom: ${space('arge')};
          `}
        >
          Please <a href='https://metamask.io/flask/'>upgrade MetaMask</a> to
          get started
        </P>
        <ButtonV2 mt={space('large')} onClick={onRetry}>
          Try again
        </ButtonV2>
        <ButtonV2 mt={space('large')} onClick={back}>
          Back
        </ButtonV2>
      </>
    )

  if (!snapInstalled)
    return (
      <>
        <h2>FILSnap not detected!</h2>
        <ButtonV2 large mt={space('large')} onClick={connectFILSnap}>
          Connect FILSnap
        </ButtonV2>
        <ButtonV2 mt={space('large')} onClick={back}>
          Back
        </ButtonV2>
      </>
    )
  if (!snapEnabled)
    return (
      <>
        <h2>FILSnap disabled!</h2>
        <P
          css={`
            margin-bottom: ${space('arge')};
          `}
        >
          Please enable FILSnap in your MetaMask settings to continue.
        </P>
        <ButtonV2 mt={space('large')} onClick={onRetry}>
          Try again
        </ButtonV2>
        <ButtonV2 mt={space('large')} onClick={back}>
          Back
        </ButtonV2>
      </>
    )
  return <Connecting />
}

HelperText.propTypes = {
  ...METAMASK_STATE_PROPTYPES
}
