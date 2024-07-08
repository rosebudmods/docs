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

export type Project = {
    slug: string;
    title: string;
    id: string;
    description: string;
    project_type: 'mod' | 'modpack' | 'resourcepack' | 'shader';
    downloads: number;
    followers: number;
    icon_url?: string;
    color?: number;

    body: string;
    categories: string[];
    additional_categories?: string[];
    client_side: 'required' | 'optional' | 'unsupported';
    server_side: 'required' | 'optional' | 'unsupported';
    versions: string[];
    game_versions: string[];
    loaders: string[];

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

    issues_url?: string;
    source_url?: string;
    wiki_url?: string;
    discord_url?: string;
    donation_urls?: {
        id: string;
        platform: string;
        url: string;
    }[];

    thread_id?: string;
    monetization_status?: 'monetized' | 'demonetized' | 'force-demonetized';
    team: string;
};

export async function getProject(id: string): Promise<Project> {
    return await (
        await fetch('https://api.modrinth.com/v2/project/' + id)
    ).json();
}

export const mods = [
    await getProject('Bk6pUD7R'), // rainglow
    await getProject('KEFyvbuH'), // bodacious berries
    await getProject('4Uw92C2y'), // ramel
    await getProject('GON0Fdk5'), // skin overrides
];
