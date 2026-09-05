// worker.js — a proxy that lets the published Writing Marker call Claude
// without ever putting your API key in the browser.
//
// Deploy free on Cloudflare Workers. Setup is at the bottom of this file.

const ALLOWED_ORIGINS = [
  "https://YOURNAME.github.io",   // <- change to your GitHub Pages origin
  "http://localhost:8000",        // for local testing
];

// Only these fields are accepted from the browser. Everything else is ignored,
// so nobody can point your key at a different model or a huge max_tokens.
const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 1000;
const MAX_CHARS = 12000; // roughly a very long essay; rejects abuse

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = ALLOWED_ORIGINS.includes(origin);

    const cors = {
      "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return json({ error: "POST only" }, 405, cors);
    }
    if (!allowed) {
      return json({ error: "Origin not allowed" }, 403, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Body was not valid JSON" }, 400, cors);
    }

    const messages = body.messages;
    if (!Array.isArray(messages) || !messages.length) {
      return json({ error: "No messages supplied" }, 400, cors);
    }
    const size = JSON.stringify(messages).length;
    if (size > MAX_CHARS) {
      return json({ error: "Request too large" }, 413, cors);
    }

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,  // stays on the server, never sent to the browser
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages,
      }),
    });

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

/* ----------------------------------------------------------------------
SETUP

1. Install the CLI and log in:
     npm install -g wrangler
     wrangler login

2. Make a project folder with this file as src/worker.js and a wrangler.toml:

     name = "ielts-marker"
     main = "src/worker.js"
     compatibility_date = "2026-01-01"

3. Store your key as a secret. This is the important step — the key lives on
   Cloudflare, not in your repo and not in the browser:

     wrangler secret put ANTHROPIC_API_KEY

4. Edit ALLOWED_ORIGINS above to your GitHub Pages URL, then deploy:

     wrangler deploy

5. Copy the printed URL (https://ielts-marker.YOURNAME.workers.dev) into the
   Connection panel of the Writing Marker page.

COST AND ABUSE

Every marking is billed to your account. The origin check stops other sites
using it, but anyone who opens your page can still run markings. If you are
giving the link to students, add a shared password check or keep the marker
for yourself and publish only the practice pages.
---------------------------------------------------------------------- */
