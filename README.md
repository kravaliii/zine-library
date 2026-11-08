# Kravali zine library

A static HTML/CSS/JavaScript zine library. No build step or package manager is needed.

## Set up the public site (once)

1. If you want the site to be public, make the repository public in **Settings → General → Danger Zone → Change repository visibility**. Check what is in the repository before doing so.
2. In **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` (or run **Publish zine library** from the Actions tab).

After the first successful deployment, the site should be at **https://kravaliii.github.io/zine-library/**. The workflow publishes the existing files as-is; it does not process PDFs or generate pages.

## Publish a new zine from the terminal

Add its images/PDFs and update `index.html` and its folder's `zine.md`, then run in this folder:

```sh
git add .
git commit -m "Add new zine"
git push origin main
```

Each push to `main` automatically runs `.github/workflows/deploy-pages.yml`. Follow progress in the repository's **Actions** tab. If Git asks for an author identity, set your `user.name` and `user.email` with `git config` first.

## Crawler opt-out

`index.html` asks search engines not to index or follow the site. `robots.txt` asks crawlers, including named AI crawlers, not to visit `/zine-library/`.

**Important:** This repository is a GitHub Pages *project site*. Its file is published at `/zine-library/robots.txt`, but crawlers only consult `https://kravaliii.github.io/robots.txt`. For the robots rules to be discoverable, publish a copy at the root of a separate `kravaliii.github.io` user-site repository (or use a custom domain with a root-level `robots.txt`). A `robots.txt` is voluntary; it cannot stop bots that ignore it. To actually restrict access, take the site and files offline or use hosting with authentication, and consider making the repository private.
