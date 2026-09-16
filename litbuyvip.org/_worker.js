export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "www.litbuyvip.org") {
      url.hostname = "litbuyvip.org";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
