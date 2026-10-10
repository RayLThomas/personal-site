const fs = require("fs");
const path = require("path");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const isPublished = (item) => !item.data.draft;
const byDateDesc = (a, b) => b.date - a.date;

module.exports = function(eleventyConfig) {

    eleventyConfig.addPlugin(syntaxHighlight);

    // Drafts are never built
    eleventyConfig.addPreprocessor('drafts', '*', (data) => {
      if (data.draft) return false;
    });

    eleventyConfig.addPassthroughCopy('./src/css');
    eleventyConfig.addPassthroughCopy('./src/images');
    eleventyConfig.addPassthroughCopy('./src/js');
    eleventyConfig.addPassthroughCopy('./src/robots.txt');
    eleventyConfig.addPassthroughCopy({
        'node_modules/prismjs/themes/prism-okaidia.css': 'css/prism.css'
    });

    // Collections: newest first, drafts excluded
    const section = (glob) => (api) =>
        api.getFilteredByGlob(glob).filter(isPublished).sort(byDateDesc);

    eleventyConfig.addCollection('articles', section('src/articles/**/*.md'));
    eleventyConfig.addCollection('projects', section('src/projects/**/*.md'));
    eleventyConfig.addCollection('conversations', section('src/conversations/**/*.md'));
    eleventyConfig.addCollection('featuredProjects', (api) =>
        api.getFilteredByGlob('src/projects/**/*.md')
            .filter((p) => isPublished(p) && p.data.featured)
            .sort(byDateDesc)
    );

    // Icons: src/images/icons/<name>.svg, inlined so they inherit currentColor.
    // Usage: {% icon "date" %} (decorative) or {% icon "linkedin", "LinkedIn profile" %} (labelled)
    const iconDir = path.join(__dirname, 'src', 'images', 'icons');
    const iconCache = {};
    let iconCounter = 0;
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    eleventyConfig.addShortcode('icon', (name, label = '', size = '') => {
      if (!iconCache[name]) {
        const file = path.join(iconDir, `${name}.svg`);
        if (!/^[a-z0-9-]+$/.test(name) || !fs.existsSync(file)) {
          throw new Error(`Unknown icon "${name}". Add src/images/icons/${name}.svg`);
        }
        iconCache[name] = fs.readFileSync(file, 'utf8').trim();
      }
      const a11y = label
        ? `role="img" aria-label="${esc(label)}"`
        : 'aria-hidden="true" focusable="false"';
      const style = size ? ` style="width:${esc(size)};height:${esc(size)}"` : '';
      // Gradient ids are made unique per rendered icon so repeats on a page never collide
      const n = ++iconCounter;
      return iconCache[name]
        .replace(/rdl-([a-z]+)/g, `rdl-$1-${n}`)
        .replace('<svg ', `<svg class="icon icon-${name}" ${a11y}${style} `);
    });

    // Maps a technology/category name to an icon name, or '' when none applies
    const techIcons = { sql: 'sql', python: 'python', ai: 'ai', 'ai-and-automation': 'ai', automation: 'automation',
      analytics: 'analytics', 'business-intelligence': 'analytics', database: 'database', 'sql-and-databases': 'database',
      'data-engineering': 'database', cloud: 'cloud', integrations: 'integrations', 'crm-architecture': 'integrations' };
    eleventyConfig.addFilter('techIcon', (name) => techIcons[String(name).toLowerCase()
      .replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')] || '');

    eleventyConfig.addFilter('year', () => new Date().getFullYear());

    eleventyConfig.addFilter('readableDate', (dateObj) => {
      return new Date(dateObj).toLocaleDateString('en-US', {
        timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric'
      });
    });

    eleventyConfig.addFilter('isoDate', (dateObj) => new Date(dateObj).toISOString());

    eleventyConfig.addFilter('limit', (arr, n) => (arr || []).slice(0, n));

    eleventyConfig.addFilter('readingTime', (html) => {
      const words = String(html || '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
      return Math.max(1, Math.round(words / 200));
    });

    // Items from `collection` (excluding `url`) sharing a value in `field` with `values`
    eleventyConfig.addFilter('related', (collection, url, values, field, n = 3) => {
      const mine = [].concat(values || []);
      if (!mine.length) return [];
      return (collection || [])
        .filter((item) => item.url !== url)
        .filter((item) => [].concat(item.data[field] || []).some((v) => mine.includes(v)))
        .slice(0, n);
    });
    eleventyConfig.addFilter('slug', (s) =>
        String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));

    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}
