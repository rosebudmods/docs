export function formatNumber(i: number): string {
    let out = '';
    while (i > 0) {
        out = ('' + (i % 1000)).padStart(3, '0') + ',' + out;
        i = Math.floor(i / 1000);
    }
    return out.slice(0, -1).replace(/^0+/, '');
}

export const kebabToCamel = (s: string) =>
    s.replaceAll(/-(.)/g, (_, c) => c.toUpperCase());
