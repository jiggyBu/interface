// Copied from https://github.com/Uniswap/interface/blob/main/src/constants/lists.ts

const UNI_LIST = 'https://tokens.uniswap.org'
const AAVE_LIST = 'tokenlist.aave.eth'
const BA_LIST =
  'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json'
const CMC_ALL_LIST = 'defi.cmc.eth'
const CMC_STABLECOIN = 'stablecoin.cmc.eth'
const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json'
const COMPOUND_LIST =
  'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
const ARBITRUM_LIST = 'https://bridge.arbitrum.io/token-list-42161.json'
const KLEROS_LIST = 't2crtokens.eth'
const OPTIMISM_LIST = 'https://static.optimism.io/optimism.tokenlist.json'
const ROLL_LIST = 'https://app.tryroll.com/tokens.json'
const SET_LIST =
  'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'
const WRAPPED_LIST = 'wrapped.tokensoft.eth'
const CROSS_CHAIN_LIST =
  'https://raw.githubusercontent.com/Uniswap/token-lists/e2a796f3f021949b986b9ac9f84a17be92498702/test/schema/example-crosschain.tokenlist.json'

export const UNSUPPORTED_LIST_URLS: string[] = [BA_LIST]

// this is the default list of lists that are exposed to users
// lower index == higher priority for token import
const DEFAULT_LIST_OF_LISTS_TO_DISPLAY: string[] = [
  UNI_LIST,
  COMPOUND_LIST,
  AAVE_LIST,
  CMC_ALL_LIST,
  CMC_STABLECOIN,
  WRAPPED_LIST,
  SET_LIST,
  ROLL_LIST,
  COINGECKO_LIST,
  KLEROS_LIST,
  ARBITRUM_LIST,
  OPTIMISM_LIST,
  GEMINI_LIST,
  CROSS_CHAIN_LIST,
]

export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...DEFAULT_LIST_OF_LISTS_TO_DISPLAY,
  ...UNSUPPORTED_LIST_URLS, // need to load dynamic unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [UNI_LIST, GEMINI_LIST, CROSS_CHAIN_LIST]
