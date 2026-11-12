export const LANG_CSS = `#ms-foot .ms-foot__langw{position:relative;display:flex;justify-self:start}
#ms-foot .ms-foot__langs{position:absolute;left:0;top:calc(100% + 14px);z-index:5;min-width:168px;padding:10px 0;background:var(--bg);border:1px solid var(--line)}
#ms-foot .ms-foot__langs[hidden]{display:none}
html body #ms-foot .ms-foot__langs a{display:block;padding:8px 18px;font:400 14px/20px var(--font);letter-spacing:0}
html body #ms-foot .ms-foot__langs a[aria-current="true"]{font-weight:500}`

export const LANG_SCRIPT = `(function(){
  var doc=document.documentElement,LS=(doc.getAttribute('data-langs')||'en').split(','),DEF=LS[0],L=LS.indexOf(doc.lang)>-1?doc.lang:DEF;
  var PRE=LS.slice(1).join('|');
  function nm(k){try{var n=new Intl.DisplayNames([k],{type:'language'}).of(k);return n.charAt(0).toUpperCase()+n.slice(1)}catch(e){return k.toUpperCase()}}
  var NAMES={};LS.forEach(function(k){NAMES[k]=nm(k)});
  var OWN=/^https?:\\/\\/((?:www|careers|press|msarchives)\\.)?maisonsanguine\\.com(?=\\/|$|[?#])/i;
  var SKIP=new RegExp('^/(?:api|_next'+(PRE?'|'+PRE:'')+')(?:/|$)|\\\\.[a-z0-9]{2,4}$','i');
  var STRIP=new RegExp('^/(?:'+(PRE||'_')+')(?=/|$)');
  function lz(h){
    if(!h||L===DEF)return h;
    var m=h.match(OWN),r;
    if(m){r=h.slice(m[0].length).match(/^([^?#]*)(.*)$/);if(r[1]&&SKIP.test(r[1]))return h;return m[0]+'/'+L+(r[1]==='/'||!r[1]?'':r[1])+r[2]}
    if(h.charAt(0)==='/'&&h.charAt(1)!=='/'){r=h.match(/^([^?#]*)(.*)$/);if(SKIP.test(r[1]))return h;return '/'+L+(r[1]==='/'?'':r[1])+r[2]}
    return h;
  }
  function swap(to){
    var base=location.pathname.replace(STRIP,'')||'/';
    return (to===DEF?base:'/'+to+(base==='/'?'':base))+location.search+location.hash;
  }
  function fill(box){
    box.innerHTML=Object.keys(NAMES).map(function(k){return '<a href="'+swap(k)+'" hreflang="'+k+'" lang="'+k+'"'+(k===L?' aria-current="true"':'')+'>'+NAMES[k]+'</a>'}).join('');
  }
  function bind(btn){
    if(btn.__msLang)return;btn.__msLang=1;
    var w=document.createElement('div');w.className='ms-foot__langw';
    btn.parentNode.insertBefore(w,btn);w.appendChild(btn);
    var box=document.createElement('div');box.className='ms-foot__langs';box.hidden=true;box.id='ms-foot-langs';w.appendChild(box);
    btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls','ms-foot-langs');
    btn.addEventListener('click',function(e){e.stopPropagation();var o=box.hidden;if(o)fill(box);box.hidden=!o;btn.setAttribute('aria-expanded',o?'true':'false')});
    document.addEventListener('click',function(e){if(!box.hidden&&!w.contains(e.target)){box.hidden=true;btn.setAttribute('aria-expanded','false')}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!box.hidden){box.hidden=true;btn.setAttribute('aria-expanded','false');btn.focus()}});
  }
  function fix(a){if(a.hasAttribute('hreflang')||a.closest('.ms-foot__langs'))return;var h=a.getAttribute('href'),n=lz(h);if(n!==h)a.setAttribute('href',n)}
  function scan(n){
    if(!n||n.nodeType!==1)return;
    if(n.matches('.ms-foot__lang'))bind(n);
    [].forEach.call(n.querySelectorAll('.ms-foot__lang'),bind);
    if(L===DEF)return;
    if(n.matches('a[href]'))fix(n);
    [].forEach.call(n.querySelectorAll('a[href]'),fix);
  }
  scan(document.body);
  new MutationObserver(function(ms){ms.forEach(function(m){
    if(m.type==='attributes'){if(L!==DEF&&m.target.matches('a[href]'))fix(m.target);return}
    [].forEach.call(m.addedNodes,scan);
  })}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['href']});
})();`
