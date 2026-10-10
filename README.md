# Revenue Data Lab

Static site built with [Eleventy](https://www.11ty.dev/) 3.

- `npm install` – install dependencies
- `npm start` – local dev server
- `npm run build` – build to `public/`

Source lives in `src/`; `public/` is generated output and is git-ignored.

## Adding content

Copy a starter from `docs/templates/` into the matching folder in `src/`, fill in the front matter, and remove `draft: true` to publish. Drafts are never built. Empty sections build fine, and each page appears in the section index, sitemap and (for articles) the RSS feed automatically.

| Content | Folder | Starter | Notes |
| --- | --- | --- | --- |
| Project | `src/projects/` | `docs/templates/project.md` | `featured: true` shows it on the homepage (max 3) |
| Article | `src/articles/` | `docs/templates/article.md` | Optional `categories`, `tags`, `author`, `readingTime`; related articles share a category |
| Conversation | `src/conversations/` | `docs/templates/conversation.md` | `youtubeId` embeds the video via youtube-nocookie; related conversations share a topic |

Files are Markdown; the file name becomes the URL (`src/articles/my-post.md` → `/articles/my-post/`). All entries use `title` and `date`, and listings are newest first.

## Icons

Each icon is its own file in `src/images/icons/` (24x24 viewBox, transparent background). Outlines are white (`#F8FAFC`) with blue/cyan/teal (`#3B82F6`, `#06B6D4`, `#2DD4BF`) gradient accents defined with native `<linearGradient>`. The shortcode gives every rendered icon unique gradient ids (`rdl-a` / `rdl-b` become `rdl-a-N`), so repeats never collide. On white cards, CSS switches the outline to dark navy. Render one in any template:

```njk
{% icon "date" %}                         {# decorative: aria-hidden #}
{% icon "linkedin", "LinkedIn profile" %} {# meaningful: role="img" + aria-label #}
{% icon "database", "", "32px" %}         {# optional size #}
```

To add an icon, drop a new `name.svg` in that folder using the same pattern: white root stroke, accent paths with `stroke="url(#rdl-a)"` or `url(#rdl-b)`, and gradients defined with `gradientUnits="userSpaceOnUse"`. An unknown name fails the build. Technology and category names map to icons through the `techIcon` filter in `.eleventy.js`.

## Configuration

`src/_data/site.json` is the one place for site-wide settings: `name`, `url`, `description`, `authorName`, `linkedin`, `github` and `ogImage`. The footer LinkedIn/GitHub links, the About page link and bylines appear only once these are set. A page can override the byline with `author` and `authorLinkedin`. Navigation lives in `src/_data/navigation.json`.

SEO output: canonical and Open Graph tags (from `site.url`), `/sitemap.xml`, `/robots.txt` and the articles feed at `/feed.xml`. Code blocks are highlighted at build time (Prism, no client JavaScript).
