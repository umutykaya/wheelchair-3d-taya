#!/usr/bin/env node
// Post-build script: generates dist/client/index.html for static S3/CloudFront hosting.
// TanStack Start (SSR) doesn't emit a static index.html, so we create one here.
// The entry JS chunk is identified by the presence of __vite__mapDeps (Vite's dynamic import helper).

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const CLIENT_DIR = "dist/client";
const ASSETS_DIR = join(CLIENT_DIR, "assets");

const assets = readdirSync(ASSETS_DIR);

const cssFile = assets.find((f) => f.endsWith(".css"));
const faviconFile = assets.find((f) => f.endsWith(".png"));

if (!cssFile) {
  console.error("No CSS file found in", ASSETS_DIR);
  process.exit(1);
}

// Entry chunk: the JS file that defines __vite__mapDeps (manages dynamic imports)
const entryJs = assets
  .filter((f) => f.endsWith(".js"))
  .find((f) => {
    const content = readFileSync(join(ASSETS_DIR, f), "utf8");
    return content.startsWith("const __vite__mapDeps");
  });

if (!entryJs) {
  console.error("Could not identify entry JS chunk in", ASSETS_DIR);
  process.exit(1);
}

// TanStack Start SSR dehydrated-state stub for static/client-only hosting.
// The server normally injects window.$_TSR with pre-rendered route matches.
// Without it the client invariant fires immediately. We provide an empty-matches
// stub so the router boots fresh from the current URL (fully client-side render).
const tsrStub = `window.$_TSR={initialized:false,buffer:[],h:function(){},e:function(){},c:function(){},p:function(fn){this.initialized?fn():this.buffer.push(fn);},router:{matches:[],lastMatchId:undefined,manifest:undefined,dehydratedData:undefined}};`;

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Taya Europe — Wheelchair Configurator</title>
    <meta name="description" content="Configure your Taya hybrid wheelchair: lightweight, foldable mobility engineered for everyday independence and travel." />
    <meta name="author" content="Taya Europe GmbH" />
    <meta property="og:title" content="Taya Europe — Wheelchair Configurator" />
    <meta property="og:description" content="Configure your Taya hybrid wheelchair: lightweight, foldable mobility engineered for everyday independence and travel." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Taya Europe — Wheelchair Configurator" />
    <meta name="twitter:description" content="Configure your Taya hybrid wheelchair: lightweight, foldable mobility engineered for everyday independence and travel." />
    <link rel="icon" href="/assets/${faviconFile}" type="image/png" />
    <link rel="stylesheet" href="/assets/${cssFile}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
    <script>${tsrStub}</script>
    <script type="module" src="/assets/${entryJs}"></script>
  </head>
  <body></body>
</html>
`;

writeFileSync(join(CLIENT_DIR, "index.html"), html, "utf8");
console.log(`Generated dist/client/index.html`);
console.log(`  CSS:   assets/${cssFile}`);
console.log(`  Entry: assets/${entryJs}`);
