import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia, baseSepolia, modeTestnet, hederaTestnet, rootstockTestnet, optimismSepolia, arbitrumSepolia } from 'wagmi/chains'

export const projectId = "9b2fd99411b0746ea4ca219cf395723d"

if (!projectId) throw new Error('Project ID is not defined')

export const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', 
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig
const chains = [sepolia, rootstockTestnet, optimismSepolia, arbitrumSepolia] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
})