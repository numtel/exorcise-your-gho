import { ConnectKitProvider, getDefaultConfig } from "connectkit";

import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { sepolia } from "wagmi/chains";
import { publicProvider } from 'wagmi/providers/public';

import { GlobalData } from '../components/GlobalData.js';

import '@/styles/globals.css';

const { publicClient, chains } = configureChains(
  [ sepolia ],
  [ publicProvider() ],
);

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: 'ba13d5bdabc28403d3af4b511efa2bf3',
    appName: 'Exorcise Your GHO',
    chains,
    publicClient,
  }),
);

export default function App({ Component, pageProps }) {
  return <WagmiConfig config={config}>
    <ConnectKitProvider
      customTheme={{
        "--ck-font-family": 'Inter, sans-serif',
      }}
    >
      <GlobalData>
        <Component {...pageProps} />
      </GlobalData>
    </ConnectKitProvider>
  </WagmiConfig>;
}
