import { existsSync, readFileSync } from 'node:fs';
import decompress from 'decompress';
import type { Element, Model, Textures } from './minecraftTypes';

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

function getTexturePath(id: string) {
    return `/${path}/assets/minecraft/textures/${parseIdentifier(id)[1]}.png`;
}

function pathFromFace(textures: Textures, id?: string) {
    return id
        ? getTexturePath(
              resolveTexture(textures, id.substring(1) as keyof Textures)!,
          )
        : id;
}

export type ItemInfo =
    | {
          type: 'item';
          texture: string;
      }
    | {
          type: 'block';
          cuboids: Cuboid[];
      };

export type Cuboid = {
    [K in 'x' | 'y' | 'z' | 'w' | 'h' | 'd']: number;
} & {
    textures: {
        top: string | undefined;
        front: string | undefined;
        side: string | undefined;
    };
};

export function itemInfo(id: string): ItemInfo {
    let info = readModel('item', id);
    let textures: Textures = {};
    let elements: Element[] = [];

    while (true) {
        if (info.textures) {
            textures = { ...textures, ...info.textures };
        }
        if (info.elements) {
            elements = [...elements, ...info.elements];
        }

        if (
            !info.parent ||
            parseIdentifier(info.parent)[1].startsWith('builtin')
        ) {
            break;
        }
        info = readModelFromIdentifier(info.parent);
    }

    if (textures.layer0) {
        return { type: 'item', texture: getTexturePath(textures.layer0) };
    }

    return {
        type: 'block',
        cuboids: elements.map((el) => ({
            x: el.from[0],
            y: el.from[1],
            z: el.from[2],
            w: el.to[0] - el.from[0],
            h: el.to[1] - el.from[1],
            d: el.to[2] - el.from[2],
            textures: {
                top: pathFromFace(textures, el.faces.up?.texture),
                front: pathFromFace(textures, el.faces.east?.texture),
                side: pathFromFace(textures, el.faces.north?.texture),
            },
        })),
    };
}
