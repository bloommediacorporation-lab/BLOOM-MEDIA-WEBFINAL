export function GET() {
  const body =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#050505"/><circle cx="32" cy="32" r="18" fill="#fca311"/></svg>';

  return new Response(body, {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=31536000, immutable'
    }
  });
}

