import {useTaskContext} from '../../hooks/useTaskContext'
import {useTaskQuery} from '../../hooks/useTaskQuery'
import './Pagination.scss'

export default function Pagination() {
    const {totalPages} = useTaskContext()
    const {query, updateQuery} = useTaskQuery()
    const page = query.page

    function goToPage(nextPage: number) {
        if (nextPage < 1 || nextPage > totalPages) {
            return
        }
        updateQuery({page: nextPage})
    }

    return (
        <nav className="pagination" aria-label="Pagination">
            <button
                type="button"
                className="pagination__button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
            >
                Previous
            </button>
            <span className="pagination__info">
                Page {page} of {totalPages}
            </span>
            <button
                type="button"
                className="pagination__button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
            >
                Next
            </button>
        </nav>
    )
}
