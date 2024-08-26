import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    site: 'https://rosebud.dev',
    integrations: [
        starlight({
            title: 'rosebud',
            description: "rosebud's mods, and their documentation",
            logo: {
                src: './src/assets/rosebud.svg',
            },
            social: {
                github: 'https://github.com/rosebudmods',
                discord: 'https://discord.rosebud.dev/',
            },
            customCss: ['./src/style/index.scss'],
            sidebar: [
                { label: 'overview', slug: 'overview' },
                {
                    label: 'rainglow',
                    autogenerate: { directory: 'rainglow' },
                },
                {
                    label: 'bodacious berries',
                    autogenerate: { directory: 'berries' },
                },
                {
                    label: 'ramel',
                    autogenerate: { directory: 'ramel' },
                },
                {
                    label: 'skin overrides',
                    autogenerate: { directory: 'skin-overrides' },
                },
                {
                    label: 'styled renaming',
                    autogenerate: { directory: 'styled-renaming' },
                },
                {
                    label: 'shut up realms',
                    autogenerate: { directory: 'shut-up-realms' },
                },
            ],
        }),
    ],
});
