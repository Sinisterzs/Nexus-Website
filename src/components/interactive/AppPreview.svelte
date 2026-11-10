<script lang="ts">
  import { animate } from 'animejs';
  import { onDestroy, onMount, tick } from 'svelte';
  import { screenshots, themeScreenshots } from '../../config/screenshots';

  let view = $state(0);
  let theme = $state(0);
  let selected = $derived(screenshots[view]);
  let selectedTheme = $derived(themeScreenshots[theme]);
  let asset = $derived(view === 0 ? selectedTheme.asset : selected.asset);
  let alt = $derived(view === 0 ? selectedTheme.alt : selected.alt);
  let themeName = $derived(view === 0 ? selectedTheme.label : themeScreenshots.find(item => item.id === selected.theme)?.label);
  let loading = $state(true);
  let failed = $state(false);
  let reduced = $state(false);
  let image: HTMLImageElement | undefined;
  let animation: ReturnType<typeof animate> | undefined;
  let request = 0;

  onMount(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { reduced = media.matches; if (reduced) animation?.revert(); };
    update(); media.addEventListener('change', update);
    if (image?.complete && image.naturalWidth > 0) loading = false;
    return () => media.removeEventListener('change', update);
  });
  onDestroy(() => { request++; animation?.revert(); });

  async function choose(nextView: number, nextTheme = theme) {
    if (nextView === view && nextTheme === theme) return;
    const current = ++request;
    animation?.revert();
    view = nextView; theme = nextTheme; failed = false; loading = true;
    await tick();
    if (current === request && image?.complete && image.naturalWidth > 0) ready();
  }

  function ready() {
    loading = false; failed = false;
    animation?.revert();
    if (image && !reduced && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animation = animate(image, {opacity:[.55,1],duration:300,ease:'outQuad'});
    }
  }

  function navigate(event: KeyboardEvent, index: number) {
    const moves: Record<string,number> = {ArrowRight:(index+1)%screenshots.length,ArrowLeft:(index+screenshots.length-1)%screenshots.length,Home:0,End:screenshots.length-1};
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const group = event.currentTarget instanceof HTMLElement ? event.currentTarget.parentElement : null;
    void choose(next);
    group?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }
</script>

<div class="preview-controls">
  <div class="theme-options" role="group" aria-label="Temas da Home">
    {#each themeScreenshots as item, i}
      <button class:chosen={view === 0 && theme === i} onclick={() => choose(0, i)} aria-pressed={view === 0 && theme === i}>
        <i style:background={item.color} aria-hidden="true"></i>{item.label}<span aria-hidden="true">{view === 0 && theme === i ? '✓' : ''}</span>
      </button>
    {/each}
  </div>
  <span class="preview-hint">TRÊS TEMAS. A SUA IDENTIDADE.</span>
</div>

<div class="preview-navigation" role="tablist" aria-label="Telas do NEXUS Desktop">
  {#each screenshots as item, i}
    <button id={`preview-tab-${item.id}`} role="tab" aria-selected={view === i} aria-controls="preview-panel" tabindex={view === i ? 0 : -1} onclick={() => choose(i)} onkeydown={event => navigate(event, i)}>
      <span class="tab-number" aria-hidden="true">0{i+1}</span>{item.label}{#if !item.asset}<i class="pending-dot" aria-hidden="true"></i>{/if}
    </button>
  {/each}
</div>

<div class="app-window" role="tabpanel" id="preview-panel" aria-labelledby={`preview-tab-${selected.id}`} tabindex="0">
  <div class="titlebar"><span class="mini-brand"><i aria-hidden="true"></i>NEXUS DESKTOP</span><span>{selected.label}</span><span class="capture-label">{asset ? 'CAPTURA REAL' : 'CAPTURA PENDENTE'}</span></div>
  <div class="image-stage" aria-busy={!!asset && loading && !failed}>
    {#if asset}
      {#key asset.src}
        <picture>
          <source type="image/webp" srcset={`${asset.smallWebp} 960w, ${asset.webp} 1920w`} sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 64px), (max-width: 1432px) calc(100vw - 112px), 1320px" />
          <img bind:this={image} src={asset.src} {alt} width={asset.width} height={asset.height} loading="lazy" decoding="async" onload={ready} onerror={() => { loading = false; failed = true; }} class:failed />
        </picture>
      {/key}
      {#if loading && !failed}<span class="image-status" role="status">Carregando captura…</span>{/if}
      {#if failed}<div class="missing-state" role="status"><h3>Não foi possível carregar a captura.</h3><p>Abra o PNG original pelo link abaixo.</p></div>{/if}
    {:else}
      <div class="missing-state">
        <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M11 5 6 10c-3 5 2 14 9 21s16 12 21 9l5-5-9-9-5 4c-5-2-10-7-12-12l4-5z" transform="translate(0 -2) scale(.85)" /></svg>
        <span class="pending-label">CHAMADAS / CAPTURA PENDENTE</span><h3>Uma conversa vai além do texto.</h3><p>A captura real desta tela ainda não está disponível.</p>
      </div>
    {/if}
  </div>
</div>

<div class="preview-caption">
  <span class="current-caption" aria-live="polite" aria-atomic="true"><i class:pending={!asset}></i>{selected.label}{#if themeName}<span class="caption-divider">/</span>{themeName}{/if}</span>
  {#if asset}<a href={asset.src} target="_blank" rel="noreferrer" aria-label={`Ver captura de ${selected.label} em tamanho original (abre nova aba)`}>Ver em tamanho original <span aria-hidden="true">↗</span></a>{:else}<span>Imagem de Chamadas ainda não fornecida.</span>{/if}
</div>
<p class="preview-note">Explore os temas na Home. As demais telas preservam a aparência das capturas originais.</p>

<style>
  .preview-controls{display:flex;justify-content:space-between;align-items:center;gap:20px;margin:36px 0 24px}.theme-options{display:flex;flex-wrap:wrap;gap:8px}.theme-options button{display:flex;align-items:center;gap:10px;padding:12px 16px;min-height:44px;border:1px solid #ffffff18;border-radius:6px;background:transparent;color:var(--muted);font-size:12px;cursor:pointer;transition:background .2s,border-color .2s}.theme-options button:hover{background:#ffffff05;border-color:#ffffff35}.theme-options button.chosen{background:var(--raised);border-color:#ffffff38;color:var(--text)}.theme-options i{width:7px;height:7px;border-radius:50%;flex-shrink:0}.theme-options button span{width:10px}.preview-hint{font-size:10px;letter-spacing:1.8px;color:var(--muted)}
  .preview-navigation{display:flex;gap:4px;margin-bottom:16px;border-bottom:1px solid var(--line);padding-bottom:12px}.preview-navigation button{display:flex;align-items:center;gap:9px;background:none;color:var(--muted);border:1px solid transparent;border-radius:5px;padding:12px 16px;min-height:44px;cursor:pointer;font-size:12px;transition:color .2s,background .2s,border-color .2s}.preview-navigation button:hover{color:var(--text);background:#ffffff05}.preview-navigation button[aria-selected=true]{background:#b8495a12;border-color:#b8495a45;color:var(--text)}.tab-number{font-size:10px;color:var(--muted)}.pending-dot{width:4px;height:4px;border:1px solid var(--muted);border-radius:50%;margin-left:2px}
  .app-window{border:1px solid #ffffff24;border-radius:10px;background:#0b0d11;box-shadow:0 35px 100px #0005;overflow:hidden}.titlebar{display:flex;align-items:center;justify-content:space-between;gap:16px;height:43px;padding:0 20px;border-bottom:1px solid var(--line);color:var(--muted);font-size:10px}.mini-brand{display:flex;align-items:center;gap:8px;color:#d8d9dd;font-weight:600;letter-spacing:1.8px}.mini-brand i{width:5px;height:5px;background:var(--accent);border-radius:50%}.capture-label{font-size:9px;letter-spacing:1.3px}
  .image-stage{position:relative;width:100%;aspect-ratio:1920/1045;background:#080a0e;isolation:isolate}.image-stage picture{display:block;width:100%;height:100%}.image-stage img{display:block;width:100%;height:100%;object-fit:contain;filter:none}.image-stage img.failed{visibility:hidden}.image-status{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);padding:8px 12px;background:#111318ed;border:1px solid var(--line);border-radius:4px;color:var(--muted);font-size:11px;white-space:nowrap}.missing-state{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:24px;background:radial-gradient(ellipse at center,#b8495a08,transparent 65%)}.missing-state svg{width:36px;height:36px;color:var(--accent);margin-bottom:24px}.pending-label{font-size:10px;letter-spacing:1.8px;color:var(--muted)}.missing-state h3{font-family:var(--display);font-size:clamp(18px,2.4vw,32px);font-weight:500;letter-spacing:-.5px;margin:15px 0 0}.missing-state p{font-size:12px;margin:12px 0 0}
  .preview-caption{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:20px;font-size:11px;line-height:1.7;color:var(--muted)}.current-caption{display:flex;align-items:center;gap:9px;flex-wrap:wrap}.current-caption>i{width:5px;height:5px;border-radius:50%;background:#70a68c}.current-caption>i.pending{background:#9296a3}.caption-divider{color:#9296a3;margin:0 3px}.preview-caption a{padding-block:10px;display:inline-flex;gap:12px;align-items:center}.preview-caption a:hover{color:var(--text)}.preview-note{font-size:11px;line-height:1.8;margin:10px 0 0;color:var(--muted)}
  @media(max-width:900px){.preview-hint{display:none}}
  @media(max-width:600px){.preview-controls{margin:26px 0 18px}.theme-options{gap:6px}.theme-options button{font-size:10px;padding:10px 9px;gap:7px}.theme-options button span{display:none}.preview-navigation{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;margin-bottom:14px}.preview-navigation button{padding:10px 12px;font-size:11px}.titlebar{padding:0 12px;height:38px;font-size:9px;gap:8px}.mini-brand{font-size:8px;letter-spacing:1px}.capture-label{font-size:8px;letter-spacing:.5px}.app-window{border-radius:7px}.preview-caption{flex-wrap:wrap;gap:3px;font-size:10px;margin-top:13px}.preview-caption a{font-size:11px}.preview-note{font-size:11px;margin-top:6px}.missing-state{padding:15px}.missing-state svg{width:23px;height:23px;margin-bottom:9px}.pending-label{font-size:8px;letter-spacing:.8px}.missing-state h3{font-size:17px;line-height:1.2;margin-top:9px}.missing-state p{font-size:10px;line-height:1.6;margin-top:8px}}
  @media(prefers-reduced-motion:reduce){button{transition:none}}
</style>
