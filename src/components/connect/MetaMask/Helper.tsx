import { FC } from 'react'
import styled from 'styled-components'
import { ButtonV2, space, fontSize, P } from '@glif/react-components'
import {
  MetaMaskState,
  METAMASK_STATE_PROPTYPES
} from '../../../utils/metamask'

const Connecting: FC = () => {
  return (
    <Title
      css={`
        margin-top: ${space()};
      `}
    >
      Connecting to FILSnap
    </Title>
  )
}

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 1em;
  font-size: ${fontSize('large')};
`;

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
        <Title>MetaMask not installed!</Title>
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
        <ButtonV2 mt={space('large')} onClick={() => (window.location.reload())}>
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
        <Title>MetaMask locked!</Title>
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
        <Title>MetaMask doesn&apos;t support Snaps!</Title>
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
        <Title>FILSnap not detected!</Title>
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
        <Title>FILSnap disabled!</Title>
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
