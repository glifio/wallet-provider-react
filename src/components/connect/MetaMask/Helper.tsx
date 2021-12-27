import { FC } from 'react'
import styled from 'styled-components'
import {
  ButtonV2,
  space,
  fontSize,
  H2,
  P,
  Loading,
  Box
} from '@glif/react-components'
import {
  MetaMaskState,
  METAMASK_STATE_PROPTYPES
} from '../../../utils/metamask'

const Connecting: FC = () => {
  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <Loading />
      <Title
        css={`
          margin-top: ${space()};
        `}
      >
        Connecting to FILSnap
      </Title>
    </Box>
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
  MetaMaskState & { onRetry: () => void; back: () => void }
> = ({
  extInstalled,
  extSupportsSnap,
  snapInstalled,
  loading,
  extUnlocked,
  onRetry,
  back
}) => {
  if (loading) return <Connecting />
  if (!extInstalled)
    return (
      <>
        <Title>MetaMask not installed!</Title>
        <P
          css={`
            margin-bottom: ${space('arge')};
          `}
        >
          Please{' '}
          <a href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'>
            install MetaMask
          </a>{' '}
          to get started
        </P>
        <ButtonV2
          css={`
            margin-top: ${space('large')};
          `}
          small
          onClick={onRetry}
        >
          Try again
        </ButtonV2>
        <ButtonV2
          css={`
            margin-top: ${space('large')};
          `}
          small
          onClick={back}
        >
          Back
        </ButtonV2>
      </>
    )
  if (!extUnlocked)
    return (
      <>
        <Title>MetaMask locked!</Title>
        <P
          css={`
            margin-bottom: ${space('arge')};
          `}
        >
          Please unlock MetaMask to get started
        </P>
        <ButtonV2
          css={`
            margin-top: ${space('large')};
          `}
          small
          onClick={onRetry}
        >
          Try again
        </ButtonV2>
        <ButtonV2
          css={`
            margin-top: ${space('large')};
          `}
          small
          onClick={back}
        >
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
        <ButtonV2
          css={`
            margin-top: ${space('large')};
          `}
          small
          onClick={onRetry}
        >
          Try again
        </ButtonV2>
        <ButtonV2
          css={`
            margin-top: ${space('large')};
          `}
          small
          onClick={back}
        >
          Back
        </ButtonV2>
      </>
    )
  if (!snapInstalled) return <Title>Install snap</Title>
  return <Connecting />
}

HelperText.propTypes = {
  ...METAMASK_STATE_PROPTYPES
}
