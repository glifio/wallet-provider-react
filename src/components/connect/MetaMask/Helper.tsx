import { FC } from 'react'
import styled from 'styled-components'
import { ButtonV2, space, fontSize, H2, P } from '@glif/react-components'
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

const Title = styled(H2).attrs(() => ({
  marginTop: 0,
  marginBottom: '1em',
  fontWeight: 'normal',
  fontSize: fontSize('large'),
  lineHeight: '1.3em'
}))``

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
            href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'
          >
            install MetaMask
          </a>{' '}
          to get started
        </P>
        <ButtonV2 mt={space('large')} onClick={onRetry}>
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
          Please{' '}
          <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'>
            upgrade MetaMask
          </a>{' '}
          to get started
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
