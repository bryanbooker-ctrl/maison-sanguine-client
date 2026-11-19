export const INITIATIVE_HTML = `<section class="ini-pg ini-hero" id="ini-top" aria-label="Initiative Maison Sanguine">
  <div class="ini-bg"></div>
  <div class="ini-hero__in">
    <h1 class="ini-hero__title"><span>For art and culture</span><em>carried by every night of the Maison</em></h1>
    <a class="ini-btn" href="https://maisonsanguine.com/about/house-of-jubilation"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h17M14 6l6 6-6 6"/></svg></i><span>About</span></a>
  </div>
  <div class="ini-hero__bar">
    <div class="ini-hero__l"><a class="ini-in" href="https://www.linkedin.com/company/maison-sanguine/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="5" r="1.8" fill="currentColor"/><path fill="currentColor" d="M3.4 9h3.2v11H3.4zM9.4 9h3v1.6c.7-1.2 2-1.9 3.6-1.9 3 0 4.4 1.9 4.4 5V20h-3.2v-5.6c0-1.6-.6-2.6-2-2.6-1.5 0-2.6 1-2.6 2.8V20H9.4z"/></svg></a><span class="ini-hero__copy">© 2026 Initiative Maison Sanguine</span></div>
    <div class="ini-hero__links"><span>For Art</span><span>For Culture</span></div>
  </div>
</section>
`

export const INITIATIVE_APP = "(function(){\n  var n=0,t=setInterval(function(){\n    var a=document.querySelector('.ms-navigation__top-center-column');\n    if(a&&!a.getAttribute('data-ini')){\n      a.setAttribute('data-ini','1');\n      a.innerHTML='<img src=\"/brand/ims-logo.png\" alt=\"Initiative Maison Sanguine\">';\n    }\n    if(a||++n>60)clearInterval(t);\n  },100);\n})();\n"
