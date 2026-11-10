// Local-only QA harness. Never emitted to dist or deployed.
// Exercises the production build with controlled browser capability failures.
import {createServer} from 'node:http';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
const root=resolve('dist');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml','.txt':'text/plain'};
const prelude=mode=>`<script>
  window.__qa={mode:${JSON.stringify(mode)},frames:0};
  const raf=window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame=callback=>raf(time=>{window.__qa.frames++;callback(time)});
  if(${JSON.stringify(mode)}==='reduced'){
    const native=window.matchMedia.bind(window);
    const list=new EventTarget();list.matches=true;list.media='(prefers-reduced-motion: reduce)';list.onchange=null;
    window.matchMedia=query=>query.includes('prefers-reduced-motion')?list:native(query);
    window.__qa.toggleMotion=()=>{list.matches=!list.matches;list.dispatchEvent(new Event('change'));};
  }
  if(${JSON.stringify(mode)}==='no-webgl'){
    const native=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:native.call(this,type,...args)};
  }
  if(${JSON.stringify(mode)}==='lost'){
    const timer=setInterval(()=>{
      const canvas=document.querySelector('#signal-canvas canvas');if(!canvas)return;
      const gl=canvas.getContext('webgl2')||canvas.getContext('webgl');
      const extension=gl?.getExtension('WEBGL_lose_context');
      if(extension){extension.loseContext();window.__qa.lossRequested=true;}
      else window.__qa.unsupported=true;
      clearInterval(timer);
    },100);
    setTimeout(()=>clearInterval(timer),5000);
  }
</script>`;
const server=createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/__stop'){res.end('stopped');server.close();return;}
  const qa=url.pathname.match(/^\/qa\/(reduced|no-webgl|lost)$/);
  let path=resolve(root,'.'+(qa?'/index.html':url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
  if(!path.startsWith(root+sep)||!existsSync(path)){res.writeHead(404);res.end();return;}
  let content=readFileSync(path);
  if(qa)content=Buffer.from(content.toString().replace('<head>','<head>'+prelude(qa[1])));
  res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');res.end(content);
});
server.listen(4323,'127.0.0.1',()=>console.log('QA local: http://127.0.0.1:4323/ (rotas /qa/reduced, /qa/no-webgl, /qa/lost)'));
