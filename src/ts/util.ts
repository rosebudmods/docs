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
    switch (project.environment[0]) {
        case 'client_and_server':
            return 'Client and Server';
        case 'client_only':
            return 'Client';
        case 'client_only_server_optional':
            return 'Client (and Server)';
        case 'client_or_server':
            return 'Anywhere';
        case 'client_or_server_prefers_both':
            return 'Client or Server';
        case 'dedicated_server_only':
            return 'Dedicated Server';
        case 'server_only':
            return 'Server';
        case 'server_only_client_optional':
            return 'Server (and Client)';
        case 'singleplayer_only':
            return 'Singleplayer';
        default:
            return 'Unknown';
    }
}
