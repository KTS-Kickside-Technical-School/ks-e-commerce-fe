export const safeToFixed = (value: string | number, decimals = 2) => {
    const numericValue = typeof value === 'string' ?
        parseFloat(value) :
        value;

    return isNaN(numericValue)
        ? '0.00'
        : numericValue.toFixed(decimals);
};