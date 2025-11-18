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
            social: [
                {
                    icon: 'github',
                    label: 'GitHub',
                    href: 'https://github.com/rosebudmods',
                },
                {
                    icon: 'codeberg',
                    label: 'Codeberg',
                    href: 'https://codeberg.org/rosebud',
                },
                {
                    icon: 'discord',
                    label: 'Discord',
                    href: 'https://discord.rosebud.dev',
                },
                {
                    icon: 'blueSky',
                    label: 'Bluesky',
                    href: 'https://bsky.app/profile/rosebud.dev',
                },
                {
                    icon: 'instagram',
                    label: 'Instagram',
                    href: 'https://instagram.com/rosebud.dev',
                },
                {
                    icon: 'tiktok',
                    label: 'TikTok',
                    href: 'https://tiktok.com/@rosebud.dev',
                },
            ],
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
