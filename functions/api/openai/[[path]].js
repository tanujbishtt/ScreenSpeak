// Cloudflare Pages Function
// Mirrors the /api/openai -> https://api.openai.com proxy that vite.config.js
// sets up for local dev (see server.proxy in vite.config.js). Vite's proxy
// only runs during `npm run dev`, so in production (Cloudflare Pages) this
// function takes over the same job: forward the request to OpenAI, stream
// the response straight back, and never touch the caller's API key.

export async function onRequest(context) {
  const { request, params } = context;

  const incomingUrl = new URL(request.url);
  const path = Array.isArray(params.path) ? params.path.join("/") : (params.path || "");
  const targetUrl = `https://api.openai.com/${path}${incomingUrl.search}`;

  // Forward almost everything as-is (Authorization header included) so the
  // browser's own key just passes through untouched.
  const headers = new Headers(request.headers);
  headers.delete("host");

  const init = {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
  };

  const upstreamResponse = await fetch(targetUrl, init);

  const responseHeaders = new Headers(upstreamResponse.headers);
  // Not strictly required (same-origin call from the app itself), but
  // harmless to allow, in case this is ever hit cross-origin.
  responseHeaders.set("Access-Control-Allow-Origin", "*");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}
