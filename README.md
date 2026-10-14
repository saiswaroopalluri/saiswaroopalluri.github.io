# saiswaroopalluri.github.io

Personal portfolio for Sai Swaroop Alluri, served at
[saiswaroopalluri.github.io](https://saiswaroopalluri.github.io/).

## Layout

- **Site root** — the published build. GitHub Pages serves these files directly.
- **`source/`** — the Vite + TypeScript + Three.js project that produces the build.
- **`orbital/`** — an earlier interactive experiment, kept at `/orbital`.

## Working on the site

```sh
cd source
npm install
npm run dev
```

`npm run build` type-checks and writes the production build to `source/dist`.

## Publishing

Pushing changes under `source/` to `master` triggers
[the publish workflow](.github/workflows/deploy.yml), which builds the project and
commits the result to the site root. To publish from your machine instead:

```sh
cd source && npm run build && cp -R dist/. ..
```

Then commit the updated root files.
