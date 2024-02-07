import { useEffect } from 'react';
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
import MainLayout from "../layout/mainLayout";

const abi = [
	// Вставьте ABI смарт-контракта сюда
];

const contractAddress = '0x694E31fB6cf8E86Bb09e67D58b82B5abc6C2065E';

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
	[alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY }), publicProvider()]
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
		// Отправка GET запроса для получения данных смарт-контракта
		const response = await fetch(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&format=json`);
		const { result: abi } = await response.json();

		// Создание экземпляра смарт-контракта
		const contractInstance = new provider.eth.Contract(JSON.parse(abi), contractAddress);

		// Вызов метода смарт-контракта (замените 'methodName' на имя нужного метода)
		const result = await contractInstance.methods.methodName().call();

		console.log('Результат вызова функции смарт-контракта:', result);
	} catch (error) {
		console.error('Произошла ошибка при вызове смарт-контракта:', error);
	}
};

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		if (wagmiClient.isConnected()) {
			callSmartContract();
		}
	}, [wagmiClient]);

	return (
		<WagmiConfig client={wagmiClient}>
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
