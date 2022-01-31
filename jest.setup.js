import '@testing-library/jest-dom'
import 'jest-styled-components'
import 'whatwg-fetch'

import { TextDecoder, TextEncoder } from 'util'
global.TextDecoder = TextDecoder
global.TextEncoder = TextEncoder
