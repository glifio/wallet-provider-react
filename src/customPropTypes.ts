import { validateMnemonic } from 'bip39'
import { CoinType } from '@glif/filecoin-address'

export const MNEMONIC_PROPTYPE = (props, propName, componentName) => {
  if (!validateMnemonic(props[propName]))
    return new Error(
      `Invalid prop: ${propName} supplied to ${componentName}. Validation failed.`
    )

  return null
}

export const COIN_TYPE_PROPTYPE = (props, propName, componentName) => {
  const coinType = props[propName] as CoinType
  if (coinType !== 'f' && coinType !== 't') {
    return new Error(
      `Invalid prop: ${propName} supplied to ${componentName}. Validation failed.`
    )
  }

  return null
}
