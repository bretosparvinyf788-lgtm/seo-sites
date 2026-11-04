// Fixed source records: only the background corner containing an existing white redaction is retouched.
export const qcRetouch:Record<string,string>={
 '3618-2':'https://kakobuymake.com/uploads/allimg/20261028/1-26102Q43A4238.webp',
 '3618-3':'https://kakobuymake.com/uploads/allimg/20261028/1-26102Q43IR08.webp',
 '3618-4':'https://kakobuymake.com/uploads/allimg/20261028/1-26102Q43K6104.webp',
 '3618-5':'https://kakobuymake.com/uploads/allimg/20261028/1-26102Q43Q3J4.webp'
};
export function qcDisplayImage(src:string){const key=Object.keys(qcRetouch).find(k=>qcRetouch[k]===src);return key?'/api/qc-image/'+key+(key==='3618-5'?'?v=2':''):src;}
