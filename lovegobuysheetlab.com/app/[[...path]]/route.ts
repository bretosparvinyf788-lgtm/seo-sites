import {handle} from '../../lib/site';
export const dynamic='force-dynamic';
export async function GET(request:Request){return handle(request)}
