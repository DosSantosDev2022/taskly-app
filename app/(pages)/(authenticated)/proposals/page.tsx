import { getBriefings } from '@/actions/briefings/getBriefings'
import { BriefingsList } from '@/components/pages/briefings'

export const dynamic = 'force-dynamic'

export default async function BriefingViewPage() {
	const briefings = await getBriefings()

	return (
		<div className='flex h-full border border-border'>
			<BriefingsList briefings={briefings} />
		</div>
	)
}
