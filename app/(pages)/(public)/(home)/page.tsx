import {
	AdditionalFeaturesSection,
	FunctionalitiesSection,
	PricingSection,
	StatsSection,
	Banner,
} from '@/components/pages/home'

export default function Home() {
	return (
		<main className=''>
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
	)
}
