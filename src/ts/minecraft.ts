import { existsSync, readFileSync } from 'node:fs';
import decompress from 'decompress';

const path = 'src/assets/mc-assets';

if (!existsSync(path)) {
    console.log('minecraft assets not found! downloading them now!');
    const metaInfo = await (
        await fetch(
            'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json',
        )
    ).json();
    const latestRelease = metaInfo.latest.release;
    const latestVersion = (metaInfo.versions as any[]).find(
        (version) => version.id === latestRelease,
    )!;
    console.log('downloading minecraft version ' + latestRelease);
    const versionInfo = await (await fetch(latestVersion.url)).json();
    const jarFile = await (
        await fetch(versionInfo.downloads.client.url)
    ).arrayBuffer();
    console.log('downloaded! decompressing...');
    decompress(Buffer.from(jarFile), path);
}

type Model = {
    parent: string;
    textures?: {
        // for items
        layer0?: string;
        layer1?: string;
        layer2?: string;
        // for blocks
        particle?: string;
        down?: string;
        up?: string;
        north?: string;
        east?: string;
        south?: string;
        west?: string;
        // what the hell mojang
        top?: string;
        bottom?: string;
    };
};
type Textures = NonNullable<Model['textures']>;

function parseIdentifier(id: string): [string | null, string] {
    if (id.includes(':')) {
        return id.split(':', 2) as [string, string];
    }
    return [null, id];
}

function readModel(type: 'item' | 'block', id: string): Model {
    return JSON.parse(
        readFileSync(
            `${path}/assets/minecraft/models/${type}/${id}.json`,
            'utf-8',
        ),
    );
}

function readModelFromIdentifier(id: string): Model {
    return JSON.parse(
        readFileSync(
            `${path}/assets/minecraft/models/${parseIdentifier(id)[1]}.json`,
            'utf-8',
        ),
    );
}

function resolveTexture(textures: Textures, id: keyof Textures) {
    if (!(id in textures)) return undefined;

    while (textures[id]!.startsWith('#')) {
        id = textures[id]!.substring(1) as keyof Textures;
    }
    return textures[id]!;
}

function getTexturePath(id: string): string {
    return `/${path}/assets/minecraft/textures/${parseIdentifier(id)[1]}.png`;
}

export type ItemInfo =
    | {
          type: 'item';
          texture: string;
      }
    | {
          type: 'block';
          textures: BlockTextures;
      };

export type BlockTextures = {
    top: string;
    front: string;
    side: string;
};

export function itemInfo(id: string): ItemInfo {
    let info = readModel('item', id);
    let textures: Textures = {};

    while (true) {
        if (info.textures) {
            textures = { ...textures, ...info.textures };
        }

        if (parseIdentifier(info.parent)[0] === null) {
            break;
        }
        info = readModelFromIdentifier(info.parent);
    }

    if (textures.layer0) {
        return { type: 'item', texture: getTexturePath(textures.layer0) };
    }

    return {
        type: 'block',
        textures: {
            top: getTexturePath(
                resolveTexture(textures, 'up') ??
                    resolveTexture(textures, 'top')!,
            ),
            front: getTexturePath(resolveTexture(textures, 'east')!),
            side: getTexturePath(resolveTexture(textures, 'north')!),
        },
    };
}
