import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SignOutButton } from '@/components/global/SignOutButton'

export default async function Dashboard() {
	const session = await getServerSession(authOptions)

	return (
		<div className=' text-black'>
			<div>
				<h1>Olá, {session?.user?.name}</h1>
				<p>Email: {session?.user?.email}</p>
				<img src={session?.user?.image as string} alt='' />
			</div>

			<SignOutButton />
		</div>
	)
}
