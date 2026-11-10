import {writeFileSync} from 'node:fs';
import {release} from '../src/config/releases.ts';
const urls=[...new Set([release.repository,release.latest,release.installer,release.changelog])];
const results=await Promise.all(urls.map(async url=>{
  try{const response=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(15000),headers:{'User-Agent':'Nexus-Website-Link-Check'}});return {url,status:response.status,ok:response.ok,finalUrl:response.url};}
  catch(error){return {url,ok:false,error:error.message};}
}));
writeFileSync('artifacts/links.json',JSON.stringify(results,null,2));
for(const item of results)console.log(`${item.status||item.error} ${item.url}`);
if(results.some(item=>!item.ok))process.exitCode=1;
