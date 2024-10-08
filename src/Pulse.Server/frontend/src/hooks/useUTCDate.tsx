import { useMemo } from 'react';

export const useUTCDate = (timestampInSeconds: number): string => {
    const timestampInMilliseconds =
        timestampInSeconds >= 1_000_000_000 ? timestampInSeconds * 1000 : timestampInSeconds;

    return useMemo(() => {
        const date = new Date(timestampInMilliseconds);

        return date.toUTCString();
    }, [timestampInMilliseconds]);
};
