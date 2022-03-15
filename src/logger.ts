import { Logger } from '@glif/logger'
import pjson from '../package.json'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN! as string
const SENTRY_ENV = process.env.NEXT_PUBLIC_SENTRY_ENV! as string
const ENABLE_SENTRY = process.env.NEXT_PUBLIC_ENABLE_SENTRY! as string

export const logger = new Logger({
  sentryTraces: 0,
  sentryDsn: SENTRY_DSN,
  sentryEnv: SENTRY_ENV,
  sentryEnabled: !!ENABLE_SENTRY,
  packageName: pjson.name,
  packageVersion: pjson.version
})

const getCurrentTimeFormatted = () => {
  const currentTime = new Date()
  const hours = currentTime.getHours()
  const minutes = currentTime.getMinutes()
  const seconds = currentTime.getSeconds()
  const milliseconds = currentTime.getMilliseconds()
  return `${hours}:${minutes}:${seconds}.${milliseconds}`
}

export const reducerLogger = <T, A>(
  reducer: (state: T, action: A) => T
): ((state: T, action: A) => T) => {
  if (process.env.NEXT_PUBLIC_IS_PROD) {
    return reducer
  }
  const reducerWithLogger = (state, action) => {
    const next = reducer(state, action)
    console.group(
      `%cAction: %c${action.type} %cat ${getCurrentTimeFormatted()}`,
      'color: lightgreen; font-weight: bold;',
      'color: white; font-weight: bold;',
      'color: lightblue; font-weight: lighter;'
    )
    console.log('%cPrevious State:', 'color: #9E9E9E; font-weight: 700;', state)
    console.log('%cAction:', 'color: #00A7F7; font-weight: 700;', action)
    console.log('%cNext State:', 'color: #47B04B; font-weight: 700;', next)
    console.groupEnd()
    return next
  }

  return reducerWithLogger
}
