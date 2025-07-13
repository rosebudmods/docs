import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const site = 'https://rosebud.dev';

// https://astro.build/config
export default defineConfig({
    site,
    integrations: [
        starlight({
            title: 'rosebud',
            description: "rosebud's mods, and their documentation",
            logo: {
                src: './src/assets/rosebud.svg',
            },
            social: {
                github: 'https://github.com/rosebudmods',
                codeberg: 'https://codeberg.org/rosebudmods',
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
        {
            name: 'no-ai-scraping-pretty-please-with-a-cherry-on-top',
            hooks: {
                'astro:build:done': async ({ dir }) => {
                    const aiBotsSource =
                        'https://raw.githubusercontent.com/ai-robots-txt/ai.robots.txt/refs/heads/main/robots.txt';
                    const aiBots = await (await fetch(aiBotsSource)).text();

                    const robotsTxt = `User-agent: *
Allow: /

# fun how we have to do this now
${aiBots.trim()}

Sitemap: ${site}/sitemap-index.xml`;

                    await fs.writeFile(
                        new URL('robots.txt', dir),
                        robotsTxt,
                        'utf-8',
                    );
                },
            },
        },
    ],
});
