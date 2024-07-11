import { existsSync, readFileSync } from 'node:fs';
import decompress from 'decompress';
import type { Element, Face, Model, Textures } from './minecraftTypes';

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

function pathFromFace(textures: Textures, id: string) {
    return getTexturePath(
        resolveTexture(textures, id.substring(1) as keyof Textures)!,
    );
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
        [K in 'top' | 'front' | 'side']?: {
            path: string;
            rotation: number;
            uv: {
                u: number;
                v: number;
                w: number;
                h: number;
                flipHoriz: boolean;
                flipVerti: boolean;
            };
        };
    };
};

export type CuboidTextures = NonNullable<Cuboid['textures']['top']>;

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
        cuboids: elements.map((el) => {
            const cuboidTex: Cuboid['textures'] = {};
            applyCuboidTexture(cuboidTex, 'top', textures, el.faces.up);
            applyCuboidTexture(cuboidTex, 'front', textures, el.faces.east);
            applyCuboidTexture(cuboidTex, 'side', textures, el.faces.north);

            return {
                x: el.from[0],
                y: el.from[1],
                z: el.from[2],
                w: el.to[0] - el.from[0],
                h: el.to[1] - el.from[1],
                d: el.to[2] - el.from[2],
                textures: cuboidTex,
            };
        }),
    };
}

function applyCuboidTexture(
    cuboidTextures: Cuboid['textures'],
    key: keyof Cuboid['textures'],
    textures: Textures,
    face?: Face,
) {
    if (face) {
        const u1 = face.uv ? Math.min(face.uv[0], face.uv[2]) : 0;
        const u2 = face.uv ? Math.max(face.uv[0], face.uv[2]) : 16;
        const v1 = face.uv ? Math.min(face.uv[1], face.uv[3]) : 0;
        const v2 = face.uv ? Math.max(face.uv[1], face.uv[3]) : 16;

        cuboidTextures[key] = {
            path: pathFromFace(textures, face.texture),
            rotation: face.rotation ?? 0,
            uv: {
                u: u1,
                v: v1,
                w: u2 - u1,
                h: v2 - v1,
                flipHoriz: face.uv ? face.uv[0] > face.uv[2] : false,
                flipVerti: face.uv ? face.uv[1] > face.uv[3] : false,
            },
        };
    }
}
