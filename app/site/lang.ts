export const LANG_CSS = `.ms-lw{position:fixed;inset:0;z-index:2147483000;font-family:var(--ms-font,"Helvetica Neue",Helvetica,Arial,sans-serif);color:#fff;-webkit-font-smoothing:antialiased}
.ms-lw[hidden]{display:none}
.ms-lw *{box-sizing:border-box}
.ms-lw__veil{position:absolute;inset:0;background:rgba(10,10,12,.55);-webkit-backdrop-filter:blur(20px) saturate(130%);backdrop-filter:blur(20px) saturate(130%);clip-path:inset(0 0 100% 0);transition:clip-path .72s cubic-bezier(.65,0,.35,1)}
@supports not ((-webkit-backdrop-filter:blur(1px)) or (backdrop-filter:blur(1px))){.ms-lw__veil{background:rgba(10,10,12,.92)}}
.ms-lw__panel{position:absolute;top:0;bottom:0;left:0;display:flex;flex-direction:column;width:100%;max-width:100%;padding:28px 24px 24px;overflow-y:auto;background:transparent;opacity:0;transition:opacity .25s cubic-bezier(.4,0,.2,1);overscroll-behavior:contain}
.ms-lw.is-open .ms-lw__veil{clip-path:inset(0 0 0 0)}
.ms-lw.is-open .ms-lw__panel{opacity:1;transition:opacity .5s cubic-bezier(.4,0,.2,1) .35s}
.ms-lw__close{display:flex;align-items:center;justify-content:center;width:44px;height:44px;margin:-10px 0 0 -10px;padding:0;border:0;background:none;color:inherit;cursor:pointer;transition:opacity .3s ease}
.ms-lw__close:hover{opacity:.55}
.ms-lw__close svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.1}
.ms-lw__title{margin:56px 0 0;padding:0;font-family:inherit;font-weight:200;font-style:normal;text-transform:uppercase;font-size:var(--ms-h2,clamp(20px,6.75vw,30px));line-height:1.05;letter-spacing:-0.03em;color:inherit}
.ms-lw__title span{display:block}
.ms-lw__title .ms-it{font-style:italic;font-weight:300}
.ms-lw__body{margin:56px 0 40px;padding:0}
.ms-lw__label{display:block;margin:0 0 10px;padding:0;border:0;font-family:inherit;font-weight:500;font-size:11.2px;line-height:14px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55)}
.ms-lw__select{position:relative}
.ms-lw__current{display:flex;align-items:center;gap:6px;width:100%;margin:0;padding:0 2px 12px 0;border:0;border-bottom:1px solid rgba(255,255,255,.55);background:none;color:inherit;font-family:inherit;font-weight:300;font-size:15px;line-height:20px;text-align:left;cursor:pointer;transition:border-color .3s ease}
.ms-lw__current:hover,.ms-lw__current[aria-expanded="true"]{border-bottom-color:#fff}
.ms-lw__current b{font-weight:500}
.ms-lw__current svg{width:14px;height:14px;margin-left:auto;flex:none;fill:none;stroke:currentColor;stroke-width:1.2;transition:transform .3s ease}
.ms-lw__current[aria-expanded="true"] svg{transform:rotate(180deg)}
.ms-lw__list{position:absolute;left:0;right:0;top:100%;z-index:2;max-height:min(300px,45vh);margin:0;padding:6px 0;list-style:none;overflow-y:auto;background:#121212;border:1px solid rgba(255,255,255,.22);border-top:0;overscroll-behavior:contain;scrollbar-color:rgba(255,255,255,.3) transparent}
.ms-lw__list[hidden]{display:none}
.ms-lw__list li{display:block;margin:0;padding:12px 20px;cursor:pointer;font-family:inherit;font-weight:300;font-size:15px;line-height:20px;transition:background .2s ease}
.ms-lw__list li small{display:block;margin-top:2px;font-size:12.5px;line-height:16px;color:rgba(255,255,255,.55)}
.ms-lw__list li:hover,.ms-lw__list li.is-active{background:rgba(255,255,255,.06)}
.ms-lw__list li[aria-selected="true"]{font-weight:500}
.ms-lw__help{margin:14px 0 0;font-family:inherit;font-weight:300;font-size:13.5px;line-height:1.45;color:rgba(255,255,255,.55)}
.ms-lw__langs{margin:48px 0 0;padding:0;border:0;min-width:0}
.ms-lw__langs .ms-lw__label{margin-bottom:18px}
.ms-lw__radio{position:relative;display:flex;align-items:center;gap:16px;margin:0 0 16px;cursor:pointer;font-family:inherit;font-weight:500;font-size:15px;line-height:20px}
.ms-lw__radio input{position:absolute;opacity:0;width:1px;height:1px;margin:0}
.ms-lw__radio i{position:relative;flex:none;width:24px;height:24px;border:1px solid #fff;border-radius:50%}
.ms-lw__radio i::after{content:"";position:absolute;inset:5px;border-radius:50%;background:#fff;transform:scale(0);transition:transform .25s cubic-bezier(.16,1,.3,1)}
.ms-lw__radio input:checked+i::after{transform:none}
.ms-lw__radio input:focus-visible+i{outline:1px solid #fff;outline-offset:3px}
.ms-lw__apply{display:flex;align-items:center;justify-content:center;flex:none;width:100%;height:60px;margin:auto 0 0;padding:0 24px;border:1px solid #fff;border-radius:0;background:#fff;color:#000;cursor:pointer;font-family:inherit;font-weight:500;font-size:15px;line-height:1.2;letter-spacing:0;text-transform:none;transition:background .3s ease,color .3s ease}
.ms-lw__apply:hover,.ms-lw__apply:focus-visible{background:transparent;color:#fff}
.ms-lw__panel:focus{outline:0}
.ms-lw button:focus-visible{outline:1px solid #fff;outline-offset:4px}
html.ms-lw-lock,html.ms-lw-lock body{overflow:hidden}
@media (min-width:768px){
.ms-lw__panel{width:min(560px,100%);padding:44px 56px 40px}
}
@media (min-width:1025px){
.ms-lw__panel{width:clamp(440px,33vw,640px);padding:48px 5.3vw 44px 6.6vw}
.ms-lw__title{margin-top:64px;font-size:var(--ms-h2-d,clamp(40px,3.4vw,64px))}
.ms-lw__body{margin:clamp(56px,9vh,120px) 0 48px}
}
@media (prefers-reduced-motion:reduce){.ms-lw__veil,.ms-lw__panel{transition:none}}`

export const LANG_SCRIPT = `(function(){
  var el=document.getElementById('ms-loc-data');if(!el)return;
  var C;try{C=JSON.parse(el.textContent)}catch(e){return}
  var PRE='/'+C.ctx,HOME=function(p){return !p||p==='/'?'/home':p};
  var OWN=/^https?:\\/\\/((?:www|careers|press|msarchives)\\.)?maisonsanguine\\.com(?=\\/|$|[?#])/i;
  var SKIP=/^\\/(?:api|_next|auth\\/callback)(?:\\/|$)|\\.[a-z0-9]{2,4}$/i;
  var HAS=/^\\/(?:en|[a-z]{2}\\/[a-z]{2}(?:-[a-z]{4})?)(?=\\/|$)/;
  function lz(h){
    if(!h)return h;
    var m=h.match(OWN),r;
    if(m){r=h.slice(m[0].length).match(/^([^?#]*)(.*)$/);if(r[1]&&(SKIP.test(r[1])||HAS.test(r[1])))return h;return m[0]+PRE+HOME(r[1])+r[2]}
    if(h.charAt(0)==='/'&&h.charAt(1)!=='/'){r=h.match(/^([^?#]*)(.*)$/);if(SKIP.test(r[1])||HAS.test(r[1]))return h;return PRE+HOME(r[1])+r[2]}
    return h;
  }
  function fix(a){var h=a.getAttribute('href'),n=lz(h);if(n!==h)a.setAttribute('href',n)}
  function scan(n){if(!n||n.nodeType!==1)return;if(n.matches('a[href]'))fix(n);[].forEach.call(n.querySelectorAll('a[href]'),fix)}
  scan(document.body);
  new MutationObserver(function(ms){ms.forEach(function(m){
    if(m.type==='attributes'){if(m.target.matches('a[href]'))fix(m.target);return}
    [].forEach.call(m.addedNodes,scan);
  })}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['href']});

  var T=C.t,LOCS={},rn;
  C.locations.forEach(function(l){LOCS[l.code]=l});
  try{rn=new Intl.DisplayNames([C.ui],{type:'region'})}catch(e){rn=null}
  function region(r){try{return rn?rn.of(r):r}catch(e){return r}}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  var ENTRIES=[{loc:'intl',region:'',name:T.international,cur:'EUR'}];
  var rest=[];
  C.locations.forEach(function(l){if(l.code!=='intl')rest.push({loc:l.code,name:region(l.code.toUpperCase()),cur:l.currency})});
  C.intl.forEach(function(c){rest.push({loc:'intl',region:c.region,name:c.label||region(c.region),cur:c.currency})});
  rest.sort(function(a,b){return a.name.localeCompare(b.name,C.ui)});
  ENTRIES=ENTRIES.concat(rest);
  var X='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 4.5l15 15M19.5 4.5l-15 15"/></svg>';
  var V='<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 5l4.5 4.5L11.5 5"/></svg>';
  var root,panel,cur,list,langs,state,lastFocus;
  function find(st){for(var i=0;i<ENTRIES.length;i++){var e=ENTRIES[i];if(e.loc===st.loc&&(e.loc!=='intl'||(e.region||'')===(st.region||'')))return i}return 0}
  function build(){
    root=document.createElement('div');root.className='ms-lw';root.id='ms-lw';root.hidden=true;
    root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','ms-lw-t');
    root.innerHTML='<div class="ms-lw__veil"></div><div class="ms-lw__panel">'+
      '<button type="button" class="ms-lw__close" aria-label="'+esc(T.close)+'">'+X+'</button>'+
      '<h2 class="ms-lw__title" id="ms-lw-t"><span>'+esc(T.change)+'</span><span class="ms-it">'+esc(T.location2)+'</span><span class="ms-it">'+esc(T.language2)+'</span></h2>'+
      '<div class="ms-lw__body"><p class="ms-lw__label" id="ms-lw-l">'+esc(T.location)+'</p>'+
      '<div class="ms-lw__select"><button type="button" class="ms-lw__current" aria-haspopup="listbox" aria-expanded="false" aria-controls="ms-lw-list"></button>'+
      '<ul class="ms-lw__list" id="ms-lw-list" role="listbox" aria-labelledby="ms-lw-l" tabindex="-1" hidden></ul></div>'+
      '<p class="ms-lw__help">'+esc(T.help)+'</p>'+
      '<fieldset class="ms-lw__langs"><legend class="ms-lw__label">'+esc(T.language)+'</legend><div class="ms-lw__opts"></div></fieldset></div>'+
      '<button type="button" class="ms-lw__apply">'+esc(T.apply)+'</button></div>';
    document.body.appendChild(root);
    panel=root.querySelector('.ms-lw__panel');panel.setAttribute('tabindex','-1');cur=root.querySelector('.ms-lw__current');list=root.querySelector('.ms-lw__list');langs=root.querySelector('.ms-lw__opts');
    root.querySelector('.ms-lw__veil').addEventListener('click',close);
    root.querySelector('.ms-lw__close').addEventListener('click',close);
    root.querySelector('.ms-lw__apply').addEventListener('click',apply);
    cur.addEventListener('click',function(){toggle(list.hidden)});
    list.addEventListener('click',function(e){var li=e.target.closest('li');if(li)pick(+li.getAttribute('data-i'))});
    list.addEventListener('keydown',function(e){
      var items=[].slice.call(list.children),a=list.querySelector('.is-active'),i=items.indexOf(a);
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();i=Math.max(0,Math.min(items.length-1,i+(e.key==='ArrowDown'?1:-1)));focusItem(items[i])}
      else if(e.key==='Enter'||e.key===' '){e.preventDefault();if(a)pick(+a.getAttribute('data-i'))}
      else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();toggle(false);cur.focus()}
    });
    root.addEventListener('keydown',function(e){
      if(e.key==='Escape'){if(!list.hidden){toggle(false);cur.focus()}else close()}
      else if(e.key==='Tab'){var f=[].filter.call(panel.querySelectorAll('button,input:checked,[tabindex="0"]'),function(n){return n.offsetParent!==null});if(!f.length)return;var first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
    });
    document.addEventListener('click',function(e){if(!list.hidden&&!e.target.closest('.ms-lw__select'))toggle(false)});
  }
  function focusItem(li){[].forEach.call(list.children,function(n){n.classList.remove('is-active')});if(!li)return;li.classList.add('is-active');list.setAttribute('aria-activedescendant',li.id);li.scrollIntoView({block:'nearest'})}
  function renderList(){
    var sel=find(state);
    var order=[sel].concat(ENTRIES.map(function(_,i){return i}).filter(function(i){return i!==sel}));
    list.innerHTML=order.map(function(i){var en=ENTRIES[i];return '<li role="option" id="ms-lw-o'+i+'" data-i="'+i+'" aria-selected="'+(i===sel)+'">'+esc(en.name)+'<small>'+en.cur+'</small></li>'}).join('');
  }
  function toggle(o){
    if(o){renderList();list.hidden=false;cur.setAttribute('aria-expanded','true');list.scrollTop=0;focusItem(list.firstChild);list.focus({preventScroll:true})}
    else{list.hidden=true;cur.setAttribute('aria-expanded','false')}
  }
  function pick(i){
    var en=ENTRIES[i];state.loc=en.loc;state.region=en.region||'';
    var ls=LOCS[state.loc].langs;if(ls.indexOf(state.lang)<0)state.lang=ls[0];
    toggle(false);render();cur.focus();
  }
  function render(){
    var l=LOCS[state.loc],en=ENTRIES[find(state)];
    cur.innerHTML='<b>'+esc(en.name)+'</b> '+en.cur+V;
    cur.setAttribute('aria-label',T.location+': '+en.name+' '+en.cur);
    langs.innerHTML=l.langs.map(function(k){return '<label class="ms-lw__radio"><input type="radio" name="ms-lw-lang" value="'+k+'"'+(k===state.lang?' checked':'')+'><i aria-hidden="true"></i><span lang="'+(k==='zh-hant'?'zh-Hant':k)+'">'+esc(C.names[k]||k)+'</span></label>'}).join('');
    [].forEach.call(langs.querySelectorAll('input'),function(r){r.addEventListener('change',function(){state.lang=r.value})});
  }
  function open(){
    if(!root)build();
    state={loc:C.loc,lang:C.lang,region:C.region||''};
    render();lastFocus=document.activeElement;
    root.hidden=false;document.documentElement.classList.add('ms-lw-lock');
    requestAnimationFrame(function(){requestAnimationFrame(function(){root.classList.add('is-open')})});
    setTimeout(function(){panel.focus({preventScroll:true})},60);
  }
  function close(){
    if(!root||root.hidden)return;
    toggle(false);root.classList.remove('is-open');document.documentElement.classList.remove('ms-lw-lock');
    setTimeout(function(){if(!root.classList.contains('is-open'))root.hidden=true},750);
    if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
  }
  function apply(){
    var ctx=state.loc==='intl'?'en':state.loc+'/'+state.lang;
    var rg=state.loc==='intl'?state.region:'';
    if(ctx===C.ctx&&rg===(C.region||'')){close();return}
    try{document.cookie='ms_loc='+ctx+';path=/;max-age=31536000;samesite=lax';document.cookie='ms_region='+rg+';path=/;max-age='+(rg?31536000:0)+';samesite=lax'}catch(e){}
    var p=location.pathname.replace(HAS,'')||'/';
    location.href='/'+ctx+HOME(p)+location.search+location.hash;
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('.ms-foot__lang,[data-ms-locale]');
    if(b){e.preventDefault();e.stopPropagation();open()}
  },true);
  window.msLocale=open;
})();`
