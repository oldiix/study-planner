import {useTaskContext} from '../../hooks/useTaskContext'
import './Pagination.scss'

export default function Pagination() {
    const {page, totalPages, goToPage} = useTaskContext()

    return (
        <nav className="pagination" aria-label="Pagination">
            <button
                type="button"
                className="pagination__button"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
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
                disabled={page === totalPages}
            >
                Next
            </button>
        </nav>
    )
}