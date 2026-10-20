const SITE_CONFIG={origin:'https://joyagoofindsatlas.com',gaMeasurementId:'G-CQGHN6TB40'};
function isPublicOrigin(origin){return origin===SITE_CONFIG.origin;}
function analyticsTag(origin){const id=SITE_CONFIG.gaMeasurementId;return isPublicOrigin(origin)&&/^G-[A-Z0-9]+$/.test(id)?`<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');</script>`:'';}
