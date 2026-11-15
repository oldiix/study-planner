import {HttpError, isAbortError} from './httpClient'

export function getErrorMessage(error: unknown): string {
    if (isAbortError(error)) {
        return 'The request was cancelled.'
    }

    if (error instanceof HttpError) {
        if (error.status === 404) {
            return 'The task was not found on the server.'
        }
        if (error.status >= 500) {
            return 'The server is not responding. Please try again later.'
        }
        return error.message
    }

    if (error instanceof TypeError) {
        return 'No internet connection. Check your network and try again.'
    }

    return 'Something went wrong. Please try again.'
}