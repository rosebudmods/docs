import { kebabToCamel } from './util';

export type RequestedStatus =
    | 'approved'
    | 'archived'
    | 'unlisted'
    | 'private'
    | 'draft';
export type Status =
    | RequestedStatus
    | 'rejected'
    | 'processing'
    | 'withheld'
    | 'scheduled'
    | 'unknown';

export type LinkTypes = 'source' | 'wiki' | 'issues' | 'discord' | 'ko-fi';

export type Project = {
    id: string;
    slug: string;
    project_types: string[];
    games: string[];
    team_id: string;
    organization?: string;

    name: string;
    summary: string;
    description: string;
    downloads: number;
    followers: number;
    icon_url?: string;
    color?: number;

    categories: string[];
    additional_categories?: string[];
    versions: string[];
    game_versions: string[];
    loaders: string[];

    environment: (
        | 'client_and_server'
        | 'client_only'
        | 'client_only_server_optional'
        | 'singleplayer_only'
        | 'server_only'
        | 'server_only_client_optional'
        | 'dedicated_server_only'
        | 'client_or_server'
        | 'client_or_server_prefers_both'
        | 'unknown'
    )[];

    link_urls: {
        [K in LinkTypes]?: {
            platform: K;
            donation: boolean;
            url: string;
        };
    };

    gallery?: {
        url: string;
        featured: boolean;
        title?: string;
        description?: string;
        created: string;
        ordering: number;
    }[];

    license?: {
        id: string;
        name: string;
        url?: string;
    };

    published: string;
    updated: string;
    approved?: string;
    queued?: string;

    status: Status;
    requested_status?: RequestedStatus;
    monetization_status?: 'monetized' | 'demonetized' | 'force-demonetized';
    thread_id?: string;
};

export async function getOrgProjects(id: string): Promise<Project[]> {
    return await (
        await fetch(`https://api.modrinth.com/v3/organization/${id}/projects`, {
            headers: {
                'user-agent': 'codeberg/rosebud/docs (orifu@duck.com)',
            },
        })
    ).json();
}

export const projects = await getOrgProjects('rosebud');

export type RosebudModId =
    | 'rainglow'
    | 'berries'
    | 'ramel'
    | 'skinOverrides'
    | 'styledRenaming'
    | 'shutUpRealms';

export const mods = Object.fromEntries(
    projects.map((proj) => [kebabToCamel(proj.slug), proj]),
) as Record<RosebudModId, Project>;

export const modsList = [
    mods.rainglow,
    mods.berries,
    mods.ramel,
    mods.skinOverrides,
    mods.styledRenaming,
    mods.shutUpRealms,
];
