export type Faces = 'up' | 'down' | 'north' | 'south' | 'west' | 'east';
export type Model = {
    parent?: string;
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
    elements?: {
        from: [number, number, number];
        to: [number, number, number];
        faces: {
            [K in Faces]?: {
                uv?: [number, number, number, number];
                texture: string;
                rotation?: number;
            };
        };
    }[];
};

export type Textures = NonNullable<Model['textures']>;
export type Element = NonNullable<Model['elements']>[number];
export type Face = NonNullable<Element['faces'][Faces]>;
