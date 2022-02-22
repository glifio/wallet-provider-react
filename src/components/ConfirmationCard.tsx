import React from 'react'
import styled from 'styled-components'
import { typography } from 'styled-system'
import PropTypes, { number } from 'prop-types'
import {
  Box,
  Card,
  Glyph,
  Text,
  Stepper,
  StyledATag,
  Loading as LoaderGlyph
} from '@glif/react-components'
import { LoginOption } from '../lib/WalletProvider/types'
import {
  LEDGER,
  IMPORT_MNEMONIC,
  CREATE_MNEMONIC,
  IMPORT_SINGLE_KEY,
  METAMASK,
  MSIG_METHOD
} from '../constants'

const TextHighlight = styled.span.attrs(() => ({
  fontSize: 'inherit'
}))`
  font-weight: bold;
  ${typography}
`

const ReviewTx = ({ loginOption }: { loginOption: LoginOption }) => {
  if (loginOption === 'LEDGER')
    return (
      <>
        {' '}
        <TextHighlight>
          review the details on your Ledger Device, and then approve the
          transaction.
        </TextHighlight>
      </>
    )
  else if (loginOption === 'METAMASK')
    return (
      <>
        {' '}
        <TextHighlight>approve the transaction in MetaMask.</TextHighlight>
      </>
    )
  return <></>
}

const MsigHelperText = ({
  method,
  loginOption,
  approvalsUntilExecution
}: {
  method: MSIG_METHOD
  loginOption: LoginOption
  approvalsUntilExecution: number
}) => {
  let PreText = () => <></>

  switch (method) {
    case MSIG_METHOD.WITHDRAW:
      PreText = () => (
        <Text color='core.nearblack'>
          To create a proposal to withdraw Filecoin from your Safe, please
          <ReviewTx loginOption={loginOption} />
        </Text>
      )
      break
    case MSIG_METHOD.CONSTRUCTOR:
      PreText = () => (
        <Text color='core.nearblack'>
          To create your Safe, please
          <ReviewTx loginOption={loginOption} />
        </Text>
      )
      break

    case MSIG_METHOD.APPROVE: {
      PreText = () => (
        <>
          <Text color='core.nearblack'>
            To approve this proposal, please
            <ReviewTx loginOption={loginOption} />
          </Text>
          {approvalsUntilExecution === 1 ? (
            <Text>
              <TextHighlight>
                Approving this transaction will cause it to execute.
              </TextHighlight>
            </Text>
          ) : (
            <Text>
              After you approve this transaction, {approvalsUntilExecution - 1}{' '}
              more signature
              {`${
                approvalsUntilExecution - 1 > 1 ? 's are needed' : ' is needed'
              }`}{' '}
              for it to execute.
            </Text>
          )}
        </>
      )
      break
    }

    case MSIG_METHOD.CANCEL:
      PreText = () => (
        <Text color='core.nearblack'>
          To cancel this proposal, please
          <ReviewTx loginOption={loginOption} />
        </Text>
      )
      break

    case MSIG_METHOD.ADD_SIGNER:
      PreText = () => (
        <Text color='core.nearblack'>
          To create a proposal to a add a signer to your Safe, please
          <ReviewTx loginOption={loginOption} />
        </Text>
      )
      break

    case MSIG_METHOD.REMOVE_SIGNER:
      PreText = () => (
        <Text color='core.nearblack'>
          To create a proposal to remove a signer from your Safe, please
          <ReviewTx loginOption={loginOption} />
        </Text>
      )
      break

    case MSIG_METHOD.SWAP_SIGNER:
      PreText = () => (
        <Text color='core.nearblack'>
          To create a proposal to swap signers of your Safe, please
          <ReviewTx loginOption={loginOption} />
        </Text>
      )
      break

    case MSIG_METHOD.CHANGE_NUM_APPROVALS_THRESHOLD:
      PreText = () => (
        <Text color='core.nearblack'>
          To create a proposal to change the number of required approvals of
          your Safe, please
          <ReviewTx loginOption={loginOption} />
        </Text>
      )
      break
  }

  return (
    <>
      <PreText />
      <Text>
        <TextHighlight>Remember:</TextHighlight> Transactions are{' '}
        <TextHighlight>final once sent.</TextHighlight>
      </Text>
      {loginOption === 'LEDGER' && (
        <StyledATag
          width='fit-content'
          fontSize={2}
          display='inline-block'
          target='_blank'
          rel='noopener noreferrer'
          href=''
        >
          What should I see on my Ledger Device?
        </StyledATag>
      )}
      {loginOption === 'METAMASK' && (
        <StyledATag
          width='fit-content'
          fontSize={2}
          display='inline-block'
          target='_blank'
          rel='noopener noreferrer'
          href=''
        >
          What should I see in MetaMask?
        </StyledATag>
      )}
    </>
  )
}

const LedgerConfirm = ({ msig, method, approvalsUntilExecution }) => {
  if (!msig) {
    return (
      <>
        <Text color='core.nearblack'>
          To send the transaction, please{' '}
          <TextHighlight>
            confirm the transfer on your Ledger device.
          </TextHighlight>
        </Text>
        <Text>
          <TextHighlight>Remember:</TextHighlight> Transactions are{' '}
          <TextHighlight>final once sent.</TextHighlight>
        </Text>
      </>
    )
  }

  return (
    <MsigHelperText
      loginOption={'LEDGER'}
      method={method}
      approvalsUntilExecution={approvalsUntilExecution}
    />
  )
}

LedgerConfirm.propTypes = {
  msig: PropTypes.bool.isRequired,
  method: PropTypes.number.isRequired,
  approvalsUntilExecution: PropTypes.number.isRequired
}

const OtherWalletTypeConfirm = () => {
  return (
    <>
      <Text color='core.nearblack'>
        To complete the transaction, please review the{' '}
        <TextHighlight>recipient</TextHighlight> and{' '}
        <TextHighlight>amount</TextHighlight> and click &rdquo;Send&rdquo; at
        the bottom of the page.
      </Text>
      <Text>
        <TextHighlight>Remember:</TextHighlight> Transactions are{' '}
        <TextHighlight>final once sent.</TextHighlight>
      </Text>
    </>
  )
}

const MetaMaskConfirm = ({
  msig,
  method,
  approvalsUntilExecution
}: {
  msig: boolean
  method: number
  approvalsUntilExecution: number
}) => {
  if (!msig) {
    return (
      <>
        <Text color='core.nearblack'>
          To complete the transaction, please review the{' '}
          <TextHighlight>recipient</TextHighlight> and{' '}
          <TextHighlight>amount</TextHighlight> in{' '}
          <TextHighlight>MetaMask</TextHighlight>. If the details match what you
          see in Glif, click &quot;Approve&quot;.
        </Text>
        <Text>
          <TextHighlight>Remember:</TextHighlight> Transactions are{' '}
          <TextHighlight>final once sent.</TextHighlight>
        </Text>
      </>
    )
  }

  return (
    <MsigHelperText
      method={method}
      loginOption='METAMASK'
      approvalsUntilExecution={approvalsUntilExecution}
    />
  )
}

MetaMaskConfirm.propTypes = {
  msig: PropTypes.bool,
  method: PropTypes.number.isRequired,
  approvalsUntilExecution: PropTypes.number.isRequired
}

MetaMaskConfirm.defaultProps = {
  msig: false
}

type ConfirmationCardProps = {
  loginOption: LoginOption
  currentStep: number
  totalSteps: number
  loading: boolean
  method: number
  msig: boolean
  approvalsUntilExecution?: number
}

const ConfirmationCard = ({
  loginOption,
  currentStep,
  totalSteps,
  loading,
  method,
  msig,
  approvalsUntilExecution
}: ConfirmationCardProps) => {
  return (
    <>
      {loading ? (
        <Card
          display='flex'
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
          border='none'
          width='auto'
          my={2}
        >
          <LoaderGlyph />
          <Text ml={3}>Loading...</Text>
        </Card>
      ) : (
        <Card
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
          border='none'
          width='auto'
          my={2}
          bg='card.confirmation.background'
        >
          <Box
            display='flex'
            flexDirection='row'
            border='none'
            width='auto'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box display='flex' flexDirection='row' alignItems='center'>
              <Glyph
                acronym='Cf'
                textAlign='center'
                color='card.confirmation.background'
                borderColor='card.confirmation.foreground'
                backgroundColor='card.confirmation.foreground'
              />
              <Text color='card.confirmation.foreground' ml={2}>
                Confirmation
              </Text>
            </Box>
            <Box display='flex' alignItems='center'>
              <Stepper
                textColor='card.confirmation.foreground'
                completedDotColor='card.confirmation.foreground'
                incompletedDotColor='core.silver'
                step={currentStep}
                totalSteps={totalSteps}
              />
            </Box>
          </Box>
          <Box textAlign='center'>
            {loginOption === LEDGER && (
              <LedgerConfirm
                msig={msig}
                method={method}
                approvalsUntilExecution={approvalsUntilExecution}
              />
            )}
            {loginOption === METAMASK && (
              <MetaMaskConfirm
                msig={msig}
                method={method}
                approvalsUntilExecution={approvalsUntilExecution}
              />
            )}
            {loginOption !== LEDGER && loginOption !== METAMASK && (
              <OtherWalletTypeConfirm />
            )}
          </Box>
        </Card>
      )}
    </>
  )
}

ConfirmationCard.propTypes = {
  currentStep: PropTypes.number,
  totalSteps: PropTypes.number,
  loginOption: PropTypes.oneOf([
    LEDGER,
    IMPORT_MNEMONIC,
    CREATE_MNEMONIC,
    IMPORT_SINGLE_KEY
  ]).isRequired,
  loading: PropTypes.bool.isRequired,
  msig: PropTypes.bool,
  method: number,
  approvalsUntilExecution: number
}

ConfirmationCard.defaultProps = {
  // defaults fit criteria for normal send flow
  currentStep: 2,
  totalSteps: 2,
  msig: false,
  method: 0,
  approvalsUntilExecution: 0
}

export default ConfirmationCard
