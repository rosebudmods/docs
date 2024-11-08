import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import path from 'path';
import { fileURLToPath } from 'url';

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
                blueSky: 'https://bsky.app/profile/rosebud.dev',
                instagram: 'https://instagram.com/rosebud.dev',
                tiktok: 'https://tiktok.com/@rosebud.dev',
            },
            editLink:
                process.env.NODE_ENV === 'development'
                    ? {
                          baseUrl: `vscode://file/${path.dirname(fileURLToPath(import.meta.url))}`,
                      }
                    : undefined,
            customCss: [
                './src/style/index.scss',
                '@fontsource-variable/inter/opsz.css',
                '@fontsource-variable/fira-code/wght.css',
                '@fontsource-variable/manrope/wght.css',
            ],
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
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                },
            },
        },
    },
});
