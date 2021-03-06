/* WALLET TYPES */
export const HD_WALLET = 'HD_WALLET'
export const SINGLE_KEY = 'SINGLE_KEY'

/* LOGIN OPTIONS */
export const IMPORT_MNEMONIC = 'IMPORT_MNEMONIC'
export const CREATE_MNEMONIC = 'CREATE_MNEMONIC'
export const IMPORT_SINGLE_KEY = 'IMPORT_SINGLE_KEY'

export const LEDGER = 'LEDGER'
export const METAMASK = 'METAMASK'

/* API ENDPOINTS */
export const FILSNAP = 'npm:@chainsafe/filsnap'

/* NETWORK VARS */
export const MAINNET = 'f'
export const TESTNET = 't'

export const MAINNET_PATH_CODE = 461
export const TESTNET_PATH_CODE = 1

/* FILECOIN APP VERSION MIN */
export const LEDGER_VERSION_MAJOR = 0
export const LEDGER_VERSION_MINOR = 18
export const LEDGER_VERSION_PATCH = 2

/* PAGES */
/* eslint-disable no-unused-vars */
export enum PAGE {
  WALLET_HOME = '/home',
  WALLET_SEND = '/send',
  WALLET_CHOOSE_ACCOUNTS = '/home/accounts',
  SPEED_UP = '/speed-up',
  MSIG_LANDING = '/vault',
  MSIG_HOME = '/vault/home',
  MSIG_HISTORY = '/vault/history',
  MSIG_ADMIN = '/vault/admin',
  MSIG_WITHDRAW = '/vault/withdraw',
  MSIG_CHANGE_SIGNER = '/vault/change-signer',
  MSIG_REMOVE_SIGNER = '/vault/remove-signer',
  MSIG_ADD_SIGNER = '/vault/add-signer',
  MSIG_CREATE_CONFIRM = '/vault/create/confirm',
  MSIG_CREATE = '/vault/create',
  MSIG_CHOOSE = '/vault/choose',
  MSIG_CHOOSE_ACCOUNTS = '/vault/accounts',
  LANDING = '/'
}

export enum MSIG_METHOD {
  WITHDRAW,
  CONSTRUCTOR,
  PROPOSE,
  APPROVE,
  CANCEL,
  ADD_SIGNER,
  REMOVE_SIGNER,
  SWAP_SIGNER,
  CHANGE_NUM_APPROVALS_THRESHOLD,
  LOCK_BALANCE
}
/* eslint-enable */
