export const INITIATIVE_HTML = `<section class="ini-pg ini-hero" id="ini-top" aria-label="Initiative Maison Sanguine">
  <div class="ini-bg"></div>
  <div class="ini-hero__in">
    <h1 class="ini-hero__title"><span>For art and culture</span><em>carried by every night of the Maison</em></h1>
    <a class="ini-btn" href="https://maisonsanguine.com/about/house-of-jubilation"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h17M14 6l6 6-6 6"/></svg></i><span>About</span></a>
  </div>
</section>
`

export const INITIATIVE_APP = "(function(){\n  var n=0,t=setInterval(function(){\n    var a=document.querySelector('.ms-navigation__top-center-column');\n    if(a&&!a.getAttribute('data-ini')){\n      a.setAttribute('data-ini','1');\n      a.innerHTML='<img src=\"/brand/ims-logo.png\" alt=\"Initiative Maison Sanguine\">';\n    }\n    if(a||++n>60)clearInterval(t);\n  },100);\n})();\n"
