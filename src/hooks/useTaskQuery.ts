import {useSearchParams} from 'react-router'
import type {PriorityFilter, TaskFilter, TaskSortOrder} from '../types/task'

export type TaskQuery = {
    status: TaskFilter
    priority: PriorityFilter
    sort: TaskSortOrder
    page: number
}

const defaultQuery: TaskQuery = {
    status: 'all',
    priority: 'all',
    sort: 'newest',
    page: 1,
}

const statusValues: TaskFilter[] = ['all', 'completed', 'active']
const priorityValues: PriorityFilter[] = ['all', 'high', 'medium', 'low']
const sortValues: TaskSortOrder[] = ['newest', 'priority']

function pickValue<T extends string>(value: string | null, allowed: T[], fallback: T): T {
    return allowed.find((item) => item === value) ?? fallback
}

function parsePage(value: string | null): number {
    const page = Number(value)
    return Number.isInteger(page) && page > 0 ? page : defaultQuery.page
}

function toSearchParams(query: TaskQuery): URLSearchParams {
    const params = new URLSearchParams()

    if (query.status !== defaultQuery.status) {
        params.set('status', query.status)
    }
    if (query.priority !== defaultQuery.priority) {
        params.set('priority', query.priority)
    }
    if (query.sort !== defaultQuery.sort) {
        params.set('sort', query.sort)
    }
    if (query.page !== defaultQuery.page) {
        params.set('page', String(query.page))
    }

    return params
}

export function useTaskQuery() {
    const [searchParams, setSearchParams] = useSearchParams()

    const query: TaskQuery = {
        status: pickValue(searchParams.get('status'), statusValues, defaultQuery.status),
        priority: pickValue(searchParams.get('priority'), priorityValues, defaultQuery.priority),
        sort: pickValue(searchParams.get('sort'), sortValues, defaultQuery.sort),
        page: parsePage(searchParams.get('page')),
    }

    function updateQuery(changes: Partial<TaskQuery>) {
        setSearchParams(toSearchParams({...query, ...changes}))
    }

    return {query, updateQuery}
}
