import { DATE_FORMAT } from '@/hooks/useHandleDateChange'
import { db } from '@/lib/prisma'
import { type Prisma, ProjectStatus } from '@prisma/client'
import { endOfDay, parse, parseISO, startOfDay } from 'date-fns'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const page = Number.parseInt(searchParams.get('page') || '1', 10)
		const limit = Number.parseInt(searchParams.get('limit') || '10', 10)
		const offset = (page - 1) * limit

		const search = searchParams.get('search')?.toLowerCase() || ''
		const start = searchParams.get('start') || ''
		const end = searchParams.get('end') || ''
		const status = searchParams.get('status') || ''

		const filters: Prisma.ProjectWhereInput = {}

		if (search) {
			filters.OR = [
				{ name: { contains: search, mode: 'insensitive' } },
				{ description: { contains: search, mode: 'insensitive' } },
			]
		}

		if (start || end) {
			try {
				const createdAtFilter: Prisma.DateTimeFilter = {}
		
				if (start) {
					const parsedStart = startOfDay(parseISO(start))
					console.log('Parsed start date:', parsedStart)
					createdAtFilter.gte = parsedStart
				}
		
				if (end) {
					const parsedEnd = endOfDay(parseISO(end))
					console.log('Parsed end date:', parsedEnd)
					createdAtFilter.lte = parsedEnd
				}
		
				filters.createdAt = createdAtFilter
			} catch (e) {
				console.warn('Data inválida no intervalo:', { start, end })
			}
		}
		

		const statusValues = status
			.split(',')
			.filter((s): s is ProjectStatus =>
				Object.values(ProjectStatus).includes(s as ProjectStatus),
			)

		if (statusValues.length > 0) {
			filters.status = {
				in: statusValues,
			}
		}

		const where = Object.keys(filters).length ? filters : undefined

		const [projects, total] = await Promise.all([
			db.project.findMany({
				where,
				skip: offset,
				take: limit,
				orderBy: { createdAt: 'desc' },
				include: {
					client: true,
					owner: true,
					team: true,
					tasks: true,
					sharedWith: true,
					comments: true,
				},
			}),
			db.project.count({
				where,
			}),
		])

		return NextResponse.json({
			projects,
			total,
			page,
			limit,
		})
	} catch (error) {
		console.error('[GET_PROJECTS_ERROR]', error)
		return NextResponse.json(
			{ error: 'Erro ao buscar projetos' },
			{ status: 500 },
		)
	}
}
