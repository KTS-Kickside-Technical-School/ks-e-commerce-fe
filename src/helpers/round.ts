export const safeToFixed = (value: string | number, decimals = 2) => {
    const numericValue = typeof value === 'string' ?
        parseFloat(value) :
        value;

    return isNaN(numericValue)
        ? '0.00'
        : numericValue.toFixed(decimals);
};

export function formatRWF(amount: number): string {
    return new Intl.NumberFormat('en-RW', {
        style: 'currency',
        currency: 'RWF',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount).replace('RWF', 'RWF');
}

export const formatAccronymsRWF = (amount: number): string => {
    if (amount >= 1_000_000_000) {
        return `RF ${(amount / 1_000_000_000).toFixed(2)}B`;
    } else if (amount >= 1_000_000) {
        return `RF ${(amount / 1_000_000).toFixed(2)}M`;
    } else if (amount >= 1_000) {
        return `RF ${(amount / 1_000).toFixed(1)}K`;
    } else {
        return `RF ${amount.toLocaleString()}`;
    }
};
