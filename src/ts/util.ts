import type { Project } from './modrinth';

export function formatNumber(i: number): string {
    if (i === 0) return '0';

    let out = '';
    while (i > 0) {
        out = ('' + (i % 1000)).padStart(3, '0') + ',' + out;
        i = Math.floor(i / 1000);
    }
    return out.slice(0, -1).replace(/^0+/, '');
}

export const kebabToCamel = (s: string) =>
    s.replaceAll(/-(.)/g, (_, c) => c.toUpperCase());

export function formatProjectSides(project: Project): string {
    const singleplayer = project.singleplayer[0] ?? false;
    const clientAndServer = project.client_and_server[0] ?? false;
    const clientOnly = project.client_only[0]!;
    const serverOnly = project.server_only[0]!;

    if ((singleplayer || clientAndServer) && !clientOnly && !serverOnly) {
        return 'Client and Server';
    } else if (clientOnly && serverOnly) {
        return 'Client or Server';
    } else if (clientOnly) {
        return 'Client';
    } else if (serverOnly) {
        return 'Server';
    }
    return 'Unknown';
}
