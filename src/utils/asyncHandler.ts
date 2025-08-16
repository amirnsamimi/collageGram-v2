export const asyncHandler = <A>(promise: Promise<A>): Promise<[A | null, Error | null]> =>
    Promise.allSettled([promise]).then(([res]) => {
        if (res.status === 'fulfilled') {
            return [res.value, null] as const
        }
        console.log(res.reason)
        const err = res.reason instanceof Error ? res.reason : new Error(String(res.reason))
        return [null, err] as const
    })
