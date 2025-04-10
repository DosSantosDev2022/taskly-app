import {
	AdditionalFeaturesSection,
	FunctionalitiesSection,
	Header,
	PricingSection,
	StatsSection,
	Banner,
	Footer,
} from '@/components/pages/home'

export default function Home() {
	return (
		<div>
			<Header />
			<main>
				{/* Seção hero  */}
				<Banner />
				{/* Seção funcionalidades */}
				<FunctionalitiesSection />
				{/* Seção estatisticas */}
				<StatsSection />
				{/* Seção funcionalidades adicionais */}
				<AdditionalFeaturesSection />
				{/* Seção planos e preços */}
				<PricingSection />

				{/* Seção FAQs */}
			</main>
			<Footer />
		</div>
	)
}
