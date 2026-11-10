import { Renderer, Triangle, Program, Mesh } from 'ogl';

export function mountSignal(host: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) { host.dataset.state='reduced-motion'; return () => {}; }
  const canvas = document.createElement('canvas');
  const attributes = {alpha:true,antialias:false,powerPreference:'low-power' as const,failIfMajorPerformanceCaveat:true};
  let supported: RenderingContext | null = null;
  let webgl: 1 | 2 = 2;
  try { supported=canvas.getContext('webgl2',attributes); if(!supported){webgl=1;supported=canvas.getContext('webgl',attributes);} } catch { /* Static fallback on unavailable/disabled acceleration. */ }
  if(!supported){host.dataset.state='unavailable';return () => {};}
  let renderer: Renderer;
  try { renderer = new Renderer({canvas,webgl,alpha:true,antialias:false,dpr:Math.min(devicePixelRatio,matchMedia('(max-width: 600px)').matches ? 1.25 : 1.5),powerPreference:'low-power'}); } catch { host.dataset.state='unavailable';return () => {}; }
  const gl = renderer.gl;
  if (!gl) {host.dataset.state='unavailable';return () => {};}

  host.appendChild(canvas);
  const uniforms = {uTime:{value:0},uAspect:{value:1},uPointer:{value:[0,0]}};
  const program = new Program(gl, {
    vertex: `attribute vec2 uv; attribute vec2 position; varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}`,
    fragment: `precision highp float;
      varying vec2 vUv; uniform float uTime; uniform float uAspect; uniform vec2 uPointer;
      void main(){
        vec2 p=(vUv-.5)*2.;p.x*=uAspect;p-=uPointer*.06;
        float angle=-.45; p=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*p;
        vec3 col=vec3(0.);float alpha=0.;
        for(int i=0;i<44;i++){
          float f=float(i)/43.;float phase=f*6.28318+uTime*.12;
          float x=p.x+.12*sin(phase);float y=p.y;
          float a=.35+.22*sin(phase);float b=.63+.06*cos(phase);
          float r=length(vec2(x/a,y/b));
          float wave=.018*sin(y*13.+phase*2.+uTime*.25);
          float d=abs(r-1.+wave);
          float line=1.-smoothstep(.002,.012,d);
          float depth=.3+.7*pow(.5+.5*cos(phase),2.);
          vec3 tone=mix(vec3(.26,.29,.34),vec3(.77,.28,.36),smoothstep(-.3,.9,sin(phase+y*2.)));
          col+=tone*line*depth*.58;alpha+=line*depth*.6;
        }
        gl_FragColor=vec4(col,min(alpha,.95));
      }`,uniforms,transparent:true,depthTest:false,depthWrite:false,
  });
  const mesh = new Mesh(gl,{geometry:new Triangle(gl),program});
  if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) {
    canvas.remove();program.remove();mesh.geometry.remove();host.dataset.state='unavailable';return () => {};
  }
  let frame=0, visible=false, last=0, elapsed=0, lost=false, disposed=false;
  const target=[0,0];
  const resize=()=>{
    if(lost||disposed)return;
    const {width,height}=host.getBoundingClientRect();
    renderer.dpr=Math.min(devicePixelRatio,matchMedia('(max-width: 600px)').matches?1.25:1.5);
    renderer.setSize(Math.max(width,1),Math.max(height,1));uniforms.uAspect.value=width/Math.max(height,1);
  };
  const canRun=()=>visible&&!document.hidden&&!reduced.matches&&!lost&&!disposed;
  const tick=(time:number)=>{
    frame=0;if(!canRun())return;
    const delta=time-last;
    if(delta>=1000/30){
      const dt=Math.min(delta,80);elapsed+=dt;
      const blend=1-Math.exp(-dt/140);
      uniforms.uPointer.value[0]+=(target[0]-uniforms.uPointer.value[0])*blend;
      uniforms.uPointer.value[1]+=(target[1]-uniforms.uPointer.value[1])*blend;
      uniforms.uTime.value=elapsed*.001;renderer.render({scene:mesh});last=time-(delta%(1000/30));
    }
    frame=requestAnimationFrame(tick);
  };
  const start=()=>{
    cancelAnimationFrame(frame);frame=0;
    const active=canRun();host.dataset.state=lost?'context-lost':reduced.matches?'reduced-motion':active?'running':'paused';
    if(active){last=performance.now();frame=requestAnimationFrame(tick);}
  };
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start();});observer.observe(host);
  const ro=new ResizeObserver(resize);ro.observe(host);resize();
  const pointer=(e:PointerEvent)=>{if(e.pointerType==='touch')return;const r=host.getBoundingClientRect();target[0]=(e.clientX-r.left)/r.width-.5;target[1]=(e.clientY-r.top)/r.height-.5;};
  const leave=()=>{target[0]=0;target[1]=0;};
  host.addEventListener('pointermove',pointer);host.addEventListener('pointerleave',leave);
  document.addEventListener('visibilitychange',start);
  const motion=()=>{host.style.opacity=reduced.matches||lost?'0':'1';start();};reduced.addEventListener('change',motion);
  const contextLost=(event:Event)=>{event.preventDefault();lost=true;host.style.opacity='0';host.parentElement?.classList.remove('webgl-ready');start();};
  // Keep the static fallback for the rest of this mount after context loss.
  // Restoration never resumes stale GPU resources or reloads the page.
  canvas.addEventListener('webglcontextlost',contextLost);
  host.parentElement?.classList.add('webgl-ready');
  const dispose=()=>{
    if(disposed)return;disposed=true;cancelAnimationFrame(frame);observer.disconnect();ro.disconnect();
    document.removeEventListener('visibilitychange',start);reduced.removeEventListener('change',motion);
    host.removeEventListener('pointermove',pointer);host.removeEventListener('pointerleave',leave);
    canvas.removeEventListener('webglcontextlost',contextLost);window.removeEventListener('pagehide',pagehide);window.removeEventListener('pageshow',pageshow);
    if(!lost){program.remove();mesh.geometry.remove();}canvas.remove();host.parentElement?.classList.remove('webgl-ready');
  };
  const pagehide=(event:PageTransitionEvent)=>{if(event.persisted){cancelAnimationFrame(frame);frame=0;}else dispose();};
  const pageshow=()=>start();
  window.addEventListener('pagehide',pagehide);window.addEventListener('pageshow',pageshow);
  return dispose;
}
