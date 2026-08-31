const languageMap = {
  zh: 'zh-CN',
  es: 'es',
  fr: 'fr',
  de: 'de',
  pt: 'pt'
};

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || '';
  const text = url.searchParams.get('q') || '';
  const target = languageMap[lang];

  if (!target || !text.trim() || text.length > 4500) {
    return Response.json({ error: 'Invalid translation request' }, { status: 400 });
  }

  const endpoint = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' +
    encodeURIComponent(target) + '&dt=t&q=' + encodeURIComponent(text.trim());

  try {
    const upstream = await fetch(endpoint, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' }
    });
    if (!upstream.ok) {
      return Response.json({ error: 'Translation service unavailable' }, { status: 502 });
    }
    const payload = await upstream.json();
    const translated = Array.isArray(payload[0])
      ? payload[0].map(part => part && part[0] ? part[0] : '').join('')
      : '';
    if (!translated) {
      return Response.json({ error: 'Empty translation' }, { status: 502 });
    }
    return Response.json({ translated }, {
      headers: { 'Cache-Control': 'public, max-age=86400' }
    });
  } catch (error) {
    return Response.json({ error: 'Translation service unavailable' }, { status: 502 });
  }
}
