export const FIT_SCRIPT = `(function(){
  if(window.__msFit){window.__msFit();return}
  var SEL='main h1,main h2,main h3';
  function need(h){
    var w=h.scrollWidth;
    [].forEach.call(h.children,function(c){if(c.scrollWidth>w)w=c.scrollWidth});
    return w;
  }
  function fit(){
    [].forEach.call(document.querySelectorAll(SEL),function(h){
      if(h.getAttribute('data-fit')){h.style.removeProperty('font-size');h.removeAttribute('data-fit')}
      var cw=h.clientWidth;if(!cw)return;
      var n=need(h);
      if(n>cw+1){
        var fs=parseFloat(getComputedStyle(h).fontSize);
        h.style.setProperty('font-size',(Math.floor(fs*cw/n*0.98*10)/10)+'px','important');
        h.setAttribute('data-fit','1');
      }
    });
  }
  var t;
  window.addEventListener('resize',function(){clearTimeout(t);t=setTimeout(fit,60)});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
  window.__msFit=fit;
  fit();setTimeout(fit,400);setTimeout(fit,1500);
})();`
