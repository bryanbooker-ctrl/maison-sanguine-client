export const INITIATIVE_HTML = `<section class="ini-pg ini-hero" id="ini-top" aria-label="Initiative Maison Sanguine">
  <div class="ini-bg"></div>
  <div class="ini-hero__in">
    <h1 class="ini-hero__title"><span>For art and culture</span><em>carried by every night of the Maison</em></h1>
    <a class="ini-btn" href="#ini-about" data-ini-go="ini-about"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h17M14 6l6 6-6 6"/></svg></i><span>About</span></a>
  </div>
  <div class="ini-hero__bar">
    <span class="ini-hero__copy">© 2026 Initiative Maison Sanguine</span>
    <nav class="ini-hero__links" aria-label="Areas of action"><a href="#ini-art" data-ini-go="ini-art">For Art</a><a href="#ini-culture" data-ini-go="ini-culture">For Culture</a></nav>
  </div>
  <a class="ini-cue" href="#ini-about" data-ini-go="ini-about" aria-label="Scroll down"><svg viewBox="0 0 24 40" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v34M4 28l8 8 8-8"/></svg></a>
</section>
<section class="ini-pg" id="ini-about" aria-label="Initiative Maison Sanguine">
  <div class="ini-bg"></div>
  <div class="ini-pg__in">
    <div class="ini-kicker">Initiative Maison Sanguine</div>
    <h2 class="ini-title"><span>Initiative</span><em>Maison Sanguine</em></h2>
    <div class="ini-cols"><p class="ini-text">Initiative Maison Sanguine brings the philosophy of the Maison into concrete action. Guided by the same standards as every one of its productions, it supports artistic and cultural initiatives and gives them the means to last.</p><p class="ini-text">Its main resource is the Ritual of Jubilation. At Rite of Summer, an exceptional bottle entrusted by a partner champagne house is transformed by an artist, unveiled during a dedicated artistic production, then offered at auction. All proceeds go to the Initiative.</p></div>
  </div>
</section>
<section class="ini-pg" id="ini-art" aria-label="For Art">
  <div class="ini-bg"></div>
  <div class="ini-pg__in">
    <div class="ini-kicker">Initiative Maison Sanguine</div>
    <h2 class="ini-title"><em>For Art</em></h2>
    <p class="ini-text">Backing the creation of new artistic works and the artists who bring them to life, from the first idea to the stage.</p>
  </div>
</section>
<section class="ini-pg" id="ini-culture" aria-label="For Culture">
  <div class="ini-bg"></div>
  <div class="ini-pg__in">
    <div class="ini-kicker">Initiative Maison Sanguine</div>
    <h2 class="ini-title"><em>For Culture</em></h2>
    <p class="ini-text">Supporting cultural initiatives that carry creative expression further, and sharing them beyond the nights of the Maison.</p>
  </div>
</section>
<nav class="ini-dots" aria-label="Pagination"></nav>`

export const INITIATIVE_APP = "(function(){\n  var pg=[].slice.call(document.querySelectorAll('.ini-pg')),box=document.querySelector('.ini-dots');\n  if(!pg.length||!box||box.getAttribute('data-ready'))return;\n  box.setAttribute('data-ready','1');\n  var still=window.matchMedia('(prefers-reduced-motion:reduce)').matches;\n  function go(el){if(el)el.scrollIntoView({behavior:still?'auto':'smooth',block:'start'})}\n  var dots=pg.map(function(p,i){\n    var b=document.createElement('button');b.type='button';b.className='ini-dot';b.setAttribute('aria-label','Page '+(i+1));\n    b.addEventListener('click',function(){go(p)});box.appendChild(b);return b;\n  });\n  [].forEach.call(document.querySelectorAll('[data-ini-go]'),function(a){\n    a.addEventListener('click',function(e){var t=document.getElementById(a.getAttribute('data-ini-go'));if(t){e.preventDefault();go(t)}});\n  });\n  var seen={};\n  if('IntersectionObserver' in window){\n    var io=new IntersectionObserver(function(es){\n      es.forEach(function(x){seen[x.target.id]=x.isIntersecting?x.intersectionRatio:0});\n      var best=-1,bi=0;pg.forEach(function(p,i){var r=seen[p.id]||0;if(r>best){best=r;bi=i}});\n      dots.forEach(function(d,i){d.classList.toggle('is-on',i===bi&&best>0)});\n      box.classList.toggle('is-off',best<=0);\n    },{threshold:[0,.25,.5,.75,1]});\n    pg.forEach(function(p){io.observe(p)});\n  }else dots[0].classList.add('is-on');\n})();\n"
