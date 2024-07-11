import { existsSync, readFileSync } from 'node:fs';
import decompress from 'decompress';
import type { Element, Faces, Model, Textures } from './minecraftTypes';

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

export type CuboidCoords = {
    [K in 'x' | 'y' | 'z' | 'w' | 'h' | 'd']: number;
} & {
    inner: boolean;
};

export type Cuboid = CuboidCoords & {
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

export function itemInfo(
    id: string,
    type: 'item' | 'block' = 'item',
): ItemInfo {
    let info = readModel(type, id);
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
            info.elements ||
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
        cuboids: elements
            .map((el) => {
                const coords = {
                    x: 16 - el.to[0],
                    y: el.from[1],
                    z: 16 - el.to[2],
                    w: el.to[0] - el.from[0],
                    h: el.to[1] - el.from[1],
                    d: el.to[2] - el.from[2],
                    inner: el.from[0] > el.to[0],
                };
                if (coords.inner) {
                    coords.x = 16 - coords.x;
                    coords.w = Math.abs(coords.w);
                }

                const cuboidTex: Cuboid['textures'] = {};
                applyCuboidTexture(cuboidTex, 'top', textures, el, coords);
                applyCuboidTexture(cuboidTex, 'front', textures, el, coords);
                applyCuboidTexture(cuboidTex, 'side', textures, el, coords);

                return {
                    ...coords,
                    textures: cuboidTex,
                };
            })
            .sort((c1, c2) => c2.x - c2.z - c1.x + c1.z)
            .sort((c1, c2) => c1.y + c1.h - c2.y - c2.h),
    };
}

const faceKeys: Record<keyof Cuboid['textures'], [Faces, Faces]> = {
    top: ['up', 'down'],
    front: ['east', 'west'],
    side: ['north', 'south'],
};

function applyCuboidTexture(
    cuboidTextures: Cuboid['textures'],
    key: keyof Cuboid['textures'],
    textures: Textures,
    el: Element,
    p: CuboidCoords,
) {
    const faceKey = faceKeys[key][p.inner ? 1 : 0];
    const face = el.faces[faceKey];

    if (face) {
        let [faceX1, faceY1, faceX2, faceY2] =
            key === 'top'
                ? [p.x, p.z, p.x + p.w, p.z + p.d]
                : key === 'front'
                  ? [p.z, p.y, p.z + p.d, p.y + p.h]
                  : [p.x, p.y, p.x + p.w, p.y + p.h];
        [faceY1, faceY2] = [16 - faceY2, 16 - faceY1];
        if (key === 'top') [faceX1, faceX2] = [16 - faceX2, 16 - faceX1];

        const u1 = face.uv ? Math.min(face.uv[0], face.uv[2]) : faceX1;
        const u2 = face.uv ? Math.max(face.uv[0], face.uv[2]) : faceX2;
        const v1 = face.uv ? Math.min(face.uv[1], face.uv[3]) : faceY1;
        const v2 = face.uv ? Math.max(face.uv[1], face.uv[3]) : faceY2;

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
