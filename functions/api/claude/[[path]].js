// Cloudflare Pages Function
// Mirrors the /api/claude -> https://api.anthropic.com proxy that
// vite.config.js sets up for local dev (see server.proxy). Vite's proxy
// only runs during `npm run dev`, so in production (Cloudflare Pages) this
// function takes over: forward the request to Anthropic, stream the
// response straight back, and never touch the caller's API key.

export async function onRequest(context) {
  const { request, params } = context;

  const incomingUrl = new URL(request.url);
  const path = Array.isArray(params.path) ? params.path.join("/") : (params.path || "");
  const targetUrl = `https://api.anthropic.com/${path}${incomingUrl.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const init = {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
  };

  const upstreamResponse = await fetch(targetUrl, init);

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.set("Access-Control-Allow-Origin", "*");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}
