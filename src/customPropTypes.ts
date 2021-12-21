import { validateMnemonic } from 'bip39'
import { CoinType, validateAddressString } from '@glif/filecoin-address'

export const ADDRESS_PROPTYPE = (props, propName, componentName) => {
  if (!validateAddressString(props[propName]))
    return new Error(
      `Invalid prop: ${propName} supplied to ${componentName}. Validation failed.`
    )

  return null
}

export const FILECOIN_NUMBER_PROP = (props, propName, componentName) => {
  // instanceof prop checking is broken in nextjs on server side render cycles
  const representsANum = Number.isNaN(Number(props[propName].toString()))
  const hasFilecoinNumMethods = !!(
    props[propName].toFil &&
    props[propName].toAttoFil &&
    props[propName].toPicoFil
  )
  if (!(representsANum || hasFilecoinNumMethods))
    return new Error(
      `Invalid prop: ${propName} supplied to ${componentName}. Validation failed.`
    )

  return null
}

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
