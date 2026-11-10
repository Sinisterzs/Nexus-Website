import { animate, stagger } from 'animejs';
import type Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const media = matchMedia('(prefers-reduced-motion: reduce)');
let lenis: Lenis | undefined;
let observer: IntersectionObserver | undefined;
let animations: ReturnType<typeof animate>[] = [];
let generation=0;
async function setup() {
  if (!document.querySelector('.hero')) return;
  const current=++generation;
  lenis?.destroy();lenis=undefined;observer?.disconnect();animations.forEach(a=>a.revert());animations=[];
  hoverAnimations.forEach(a=>a.revert());hoverAnimations.clear();
  if(media.matches)return;
  if(matchMedia('(pointer: fine)').matches && matchMedia('(min-width: 901px)').matches){
    const {default:LenisClass}=await import('lenis');
    if(current!==generation||media.matches)return;
    lenis=new LenisClass({autoRaf:true,anchors:true,duration:.85,smoothWheel:true,syncTouch:false});
  }
  animations.push(animate('.hero h1 > span',{y:[35,0],opacity:[0,1],duration:1000,delay:stagger(130),ease:'outExpo'}));
  observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){animations.push(animate(entry.target,{y:[25,0],opacity:[.35,1],duration:800,ease:'outExpo'}));observer?.unobserve(entry.target);}}),{threshold:.12});
  document.querySelectorAll('[data-reveal]').forEach(el=>observer?.observe(el));
}
const hoverAnimations=new Map<HTMLElement,ReturnType<typeof animate>>();
document.querySelectorAll<HTMLElement>('.button, .feature').forEach(el=>{el.addEventListener('pointerenter',()=>{if(!media.matches){hoverAnimations.get(el)?.revert();hoverAnimations.set(el,animate(el,{translateY:el.classList.contains('button')?-2:-3,duration:250,ease:'outQuad'}));}});el.addEventListener('pointerleave',()=>{if(!media.matches){hoverAnimations.get(el)?.revert();hoverAnimations.set(el,animate(el,{translateY:0,duration:300,ease:'outQuad'}));}});});
const desktop=matchMedia('(min-width: 901px)');desktop.addEventListener('change',setup);
document.addEventListener('visibilitychange',()=>{if(document.hidden)lenis?.stop();else lenis?.start();});
setup();media.addEventListener('change',setup);
window.addEventListener('pagehide',()=>{lenis?.destroy();observer?.disconnect();animations.forEach(a=>a.pause());},{once:true});
