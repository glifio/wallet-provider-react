import '@testing-library/jest-dom'
import 'jest-styled-components'
import 'whatwg-fetch'

import { TextDecoder, TextEncoder } from 'util'
global.TextDecoder = TextDecoder
global.TextEncoder = TextEncoder

process.env.COIN_TYPE = 't'
process.env.LOTUS_NODE_JSONRPC = 'https://calibration.node.glif.io/rpc/v0'
process.env.FIL_SNAP_HOST = 'local:http://localhost:8081'
