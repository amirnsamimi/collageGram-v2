export function asyncHandler<T, Args extends any[]>(
    fn: (...args: Args) => Promise<T>
) {
    return async (...args: Args): Promise<[T | null, Error | null]> => {
        try {
            const result = await fn(...args)
            return [result, null] as const
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err))
            return [null, error] as const
        }
    }
}