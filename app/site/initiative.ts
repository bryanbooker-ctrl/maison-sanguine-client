export const INITIATIVE_HTML = `<div class="ini-site"><section class="ini-pg ini-hero" id="ini-top" aria-label="Initiative Maison Sanguine">
  <div class="ini-bg"></div>
  <div class="ini-hero__in">
    <h1 class="ini-hero__title"><span>For art and culture</span><em>carried by every night of the Maison</em></h1>
    <a class="ini-btn" href="/about"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h17M14 6l6 6-6 6"/></svg></i><span>About</span></a>
  </div>
  <div class="ini-hero__bar">
    <div class="ini-hero__l"><a class="ini-in" href="https://www.linkedin.com/company/maison-sanguine/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="5" r="1.8" fill="currentColor"/><path fill="currentColor" d="M3.4 9h3.2v11H3.4zM9.4 9h3v1.6c.7-1.2 2-1.9 3.6-1.9 3 0 4.4 1.9 4.4 5V20h-3.2v-5.6c0-1.6-.6-2.6-2-2.6-1.5 0-2.6 1-2.6 2.8V20H9.4z"/></svg></a><div class="ini-hero__t"><span class="ini-hero__copy">© 2026 Initiative Maison Sanguine</span></div></div>
    <div class="ini-hero__links"><span>For Art</span><span>For Culture</span></div>
  </div>
</section></div>
`

export const INITIATIVE_ABOUT_HTML = `<div class="ini-site ini-about"><section class="ini-col" aria-label="Initiative Maison Sanguine"><div class="ini-col__i"></div><div class="ini-col__i"></div><div class="ini-col__i"></div></section>
<section class="ini-quote"><p>Statement to be added.</p></section>
<section class="ini-sec">
  <div class="ini-sec__in">
    <h2 class="ini-h">Our Vision</h2>
    <div class="ini-sec__txt"><p>Content to be added.</p></div>
    <div class="ini-img"></div>
  </div>
</section>
<section class="ini-sec ini-sec--alt">
  <div class="ini-sec__in">
    <h2 class="ini-h">Our Missions</h2>
    <div class="ini-sec__txt"><p>Content to be added.</p><p>Content to be added.</p></div>
    <div class="ini-img"></div>
  </div>
</section>
<section class="ini-sec">
  <div class="ini-sec__in">
    <h2 class="ini-h">Our Approach</h2>
    <div class="ini-sec__txt"><p>Content to be added.</p></div>
    
  </div>
</section>
<section class="ini-sec ini-sec--alt">
  <div class="ini-sec__in">
    <h2 class="ini-h">Our Values</h2>
    <div class="ini-sec__txt"><p>The values that guide us.</p><ul><li>Value one, to be added.</li><li>Value two, to be added.</li><li>Value three, to be added.</li></ul></div>
    
  </div>
</section>
<section class="ini-duo" aria-hidden="true"><div class="ini-duo__i"></div><div class="ini-duo__i"></div><div class="ini-duo__i"></div></section>
<section class="ini-sec">
  <div class="ini-sec__in">
    <h2 class="ini-h">Our Fields of Action</h2>
    <div class="ini-sec__txt"><p>Content to be added.</p><p>Content to be added.</p><p>Content to be added.</p></div>
    <div class="ini-img"></div>
  </div>
</section>
<section class="ini-sec ini-sec--alt">
  <div class="ini-sec__in">
    <h2 class="ini-h">Governance</h2>
    <div class="ini-sec__txt"><p>Content to be added.</p><p>Content to be added.</p></div>
    
  </div>
</section>
<footer class="ini-end">
  <div class="ini-hero__bar ini-hero__bar--end">
    <div class="ini-hero__l"><a class="ini-in" href="https://www.linkedin.com/company/maison-sanguine/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="5" r="1.8" fill="currentColor"/><path fill="currentColor" d="M3.4 9h3.2v11H3.4zM9.4 9h3v1.6c.7-1.2 2-1.9 3.6-1.9 3 0 4.4 1.9 4.4 5V20h-3.2v-5.6c0-1.6-.6-2.6-2-2.6-1.5 0-2.6 1-2.6 2.8V20H9.4z"/></svg></a><div class="ini-hero__t"><nav class="ini-end__nav" aria-label="Legal"><a href="https://press.maisonsanguine.com">Press</a><a href="https://maisonsanguine.com/legal/terms-of-use">Terms of Use</a><a href="https://maisonsanguine.com/legal/privacy-notice">Privacy Notice</a></nav><span class="ini-hero__copy">© 2026 Initiative Maison Sanguine</span></div></div>
    <div class="ini-hero__links"><span>For Art</span><span>For Culture</span></div>
  </div>
</footer>
<button class="ini-top" type="button" aria-label="Back to top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20V4M5 11l7-7 7 7"/></svg></button></div>
`

export const INITIATIVE_APP = "(function(){\n  var n=0,t=setInterval(function(){\n    var a=document.querySelector('.ms-navigation__top-center-column');\n    if(a&&!a.getAttribute('data-ini')){\n      a.setAttribute('data-ini','1');\n      a.setAttribute('href','/');\n      a.innerHTML='<img src=\"/brand/ims-logo.png\" alt=\"Initiative Maison Sanguine\">';\n    }\n    if(a||++n>60)clearInterval(t);\n  },100);\n  var b=document.querySelector('.ini-top');\n  if(b&&!b.getAttribute('data-ready')){\n    b.setAttribute('data-ready','1');\n    var on=function(){b.classList.toggle('is-on',window.scrollY>window.innerHeight*.6)};\n    window.addEventListener('scroll',on,{passive:true});on();\n    b.addEventListener('click',function(){window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})});\n  }\n})();\n"
