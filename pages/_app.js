import { useEffect } from 'react'; // Импорт хука useEffect

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

// Функция для вызова смарт-контракта
const callSmartContract = async () => {
  // Выполните логику вызова контракта здесь
  // Например, вызовите определенную функцию на контракте 0x694E31fB6cf8E86Bb09e67D58b82B5abc6C2065E
};

function MyApp({ Component, pageProps }) {
	// Используем хук useEffect для вызова смарт-контракта после успешного подключения
	useEffect(() => {
		if (wagmiClient.isConnected()) {
			callSmartContract(); // Вызов функции смарт-контракта после успешного подключения
		}
	}, [wagmiClient]); // Массив зависимостей для обеспечения выполнения этого эффекта только при изменении wagmiClient

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
