export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.protocol === 'http:' || url.hostname === 'www.cssbuyvip.net') {
      url.protocol = 'https:';
      url.hostname = 'cssbuyvip.net';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  }
};
