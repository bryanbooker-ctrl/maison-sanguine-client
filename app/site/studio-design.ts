const PH = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

const MARK = '<svg class="ms-qt__mark" viewBox="0 0 58 36" aria-hidden="true"><path d="M8.6 21.6C9.8 12.4 15.2 5.2 23.6.4l1.2 1.9C19.3 6.1 15.9 11.3 15.1 19.4 18.4 20.6 20.6 23.7 20.6 27.3c0 4.8-3.7 8.7-8.4 8.7C6.9 36 3.6 32 3.6 27.6c0-2.6 1.9-4.9 5-6zM38.6 21.6C39.8 12.4 45.2 5.2 53.6.4l1.2 1.9C49.3 6.1 45.9 11.3 45.1 19.4 48.4 20.6 50.6 23.7 50.6 27.3c0 4.8-3.7 8.7-8.4 8.7-5.3 0-8.6-4-8.6-8.4 0-2.6 1.9-4.9 5-6z"/></svg>'

const CARD = `<article class="ms-car__card"><div class="ms-car__img"><img src="${PH}" alt="" loading="lazy" draggable="false"></div></article>`

export const STUDIO_DESIGN_HTML = `<section class="stp-top" aria-label="At the Forefront of Design">
  <h2 class="stp-title"><span>AT THE FOREFRONT</span><span class="ms-it">OF DESIGN</span></h2>
  <div class="stp-top__media"><img src="${PH}" alt="At the Forefront of Design" loading="eager" draggable="false"></div>
</section>
<section class="ms-car ms-car--duo" aria-label="At the Forefront of Design">
  <div class="ms-car__head">
    <div class="ms-car__intro">
      <div class="ms-car__desc ms-car__desc--lead">Season after season, Maison Sanguine’s creators conceive avant-garde spatial designs, pushing architectural and aesthetic conventions to explore new forms of expression.</div>
      <div class="ms-car__desc">Looking to the past, the present and the future, these creations come to life in a variety of settings, from iconic private properties such as villas, penthouses and yachts to the most demanding territories, from desert landscapes to mountainous terrain. The architecture of each location, local cultural influences, materials and natural constraints become sources of inspiration, reinterpreted through Maison Sanguine’s creative vision.</div>
    </div>
  </div>
</section>
<section class="ms-car ms-car--square ms-car--float" aria-label="Art Nouveau">
  <div class="ms-car__head">
    <h2 class="ms-car__title"><span>ART</span><span class="ms-it">NOUVEAU</span></h2>
    <div class="ms-car__desc">Since its inception, Maison Sanguine’s creators have drawn inspiration from the cultural and artistic world, collaborating with renowned designers and artists to bring their vision to an international stage.</div>
  </div>
  <div class="ms-car__stage">
    <button class="ms-car__arrow ms-car__arrow--prev" type="button" aria-label="Previous" disabled><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M9 1.5 3.5 7 9 12.5"/></svg></button>
    <div class="ms-car__track" tabindex="0">
      ${CARD}${CARD}${CARD}${CARD}
    </div>
    <button class="ms-car__arrow ms-car__arrow--next" type="button" aria-label="Next"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M5 1.5 10.5 7 5 12.5"/></svg></button>
  </div>
  <div class="ms-car__dots" role="group" aria-label="Pagination"></div>
</section>
<section class="ms-car ms-car--square ms-car--float" aria-label="Art Deco">
  <div class="ms-car__head">
    <h2 class="ms-car__title"><span>ART</span><span class="ms-it">DECO</span></h2>
    <div class="ms-car__desc">Inspired by the Art Deco aesthetic, at the intersection of architectural heritage and contemporary design, Maison Sanguine’s avant-garde spatial compositions are distinguished by bold geometric forms and structured lines.</div>
  </div>
  <div class="ms-car__stage">
    <button class="ms-car__arrow ms-car__arrow--prev" type="button" aria-label="Previous" disabled><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M9 1.5 3.5 7 9 12.5"/></svg></button>
    <div class="ms-car__track" tabindex="0">
      ${CARD}${CARD}${CARD}${CARD}
    </div>
    <button class="ms-car__arrow ms-car__arrow--next" type="button" aria-label="Next"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M5 1.5 10.5 7 5 12.5"/></svg></button>
  </div>
  <div class="ms-car__dots" role="group" aria-label="Pagination"></div>
</section>
<section class="ms-car ms-car--square ms-car--float" aria-label="Bauhaus and Modernism">
  <div class="ms-car__head">
    <h2 class="ms-car__title"><span>BAUHAUS &amp;</span><span class="ms-it">MODERNISM</span></h2>
    <div class="ms-car__desc">The period from the late 1940s through the 1960s extends the influence of the Bauhaus and represents a Golden Age for Modernist design in terms of creativity and technical innovation. It saw the emergence of asymmetrical compositions, geometric interplay of volumes, and streamlined structures incorporating new materials and organic forms.</div>
  </div>
  <div class="ms-car__stage">
    <button class="ms-car__arrow ms-car__arrow--prev" type="button" aria-label="Previous" disabled><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M9 1.5 3.5 7 9 12.5"/></svg></button>
    <div class="ms-car__track" tabindex="0">
      ${CARD}${CARD}${CARD}${CARD}
    </div>
    <button class="ms-car__arrow ms-car__arrow--next" type="button" aria-label="Next"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M5 1.5 10.5 7 5 12.5"/></svg></button>
  </div>
  <div class="ms-car__dots" role="group" aria-label="Pagination"></div>
</section>
<section class="ms-qt ms-qt--grey">
  <div class="ms-qt__in">
    ${MARK}
    <div class="ms-qt__text">We create experiences designed to leave a lasting impression and stand the test of time. Each production is an expression of our creative vision, artistic mastery and the expertise of our creators.</div>
    <div class="ms-qt__by"><span class="ms-qt__name">Bryan Booker</span><span class="ms-qt__role">Founder and Creative Director, Maison Sanguine</span></div>
  </div>
</section>
<section class="ms-car ms-car--square ms-car--float" aria-label="The Years 1970 to 1990">
  <div class="ms-car__head">
    <h2 class="ms-car__title"><span>THE YEARS</span><span class="ms-it">1970–1990</span></h2>
    <div class="ms-car__desc">As Postmodernism challenges established codes of design and architecture, Maison Sanguine draws on this new creative freedom to conceive spatial compositions defined by bold forms, expressive colours and unexpected combinations.</div>
  </div>
  <div class="ms-car__stage">
    <button class="ms-car__arrow ms-car__arrow--prev" type="button" aria-label="Previous" disabled><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M9 1.5 3.5 7 9 12.5"/></svg></button>
    <div class="ms-car__track" tabindex="0">
      ${CARD}${CARD}${CARD}${CARD}
    </div>
    <button class="ms-car__arrow ms-car__arrow--next" type="button" aria-label="Next"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M5 1.5 10.5 7 5 12.5"/></svg></button>
  </div>
  <div class="ms-car__dots" role="group" aria-label="Pagination"></div>
</section>
<section class="ms-car ms-car--square ms-car--float" aria-label="Late 20th Century">
  <div class="ms-car__head">
    <h2 class="ms-car__title"><span>LATE</span><span class="ms-it">20TH CENTURY</span></h2>
    <div class="ms-car__desc">As new technologies and innovative materials open up new possibilities in the world of design, Maison Sanguine’s creators draw inspiration from these developments to explore streamlined architectural forms, lightweight structures and bold compositions, bringing technical innovation into dialogue with aesthetic expression.</div>
  </div>
  <div class="ms-car__stage">
    <button class="ms-car__arrow ms-car__arrow--prev" type="button" aria-label="Previous" disabled><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M9 1.5 3.5 7 9 12.5"/></svg></button>
    <div class="ms-car__track" tabindex="0">
      ${CARD}${CARD}${CARD}${CARD}
    </div>
    <button class="ms-car__arrow ms-car__arrow--next" type="button" aria-label="Next"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M5 1.5 10.5 7 5 12.5"/></svg></button>
  </div>
  <div class="ms-car__dots" role="group" aria-label="Pagination"></div>
</section>
<section class="ms-car ms-car--square ms-car--float" aria-label="21st Century">
  <div class="ms-car__head">
    <h2 class="ms-car__title"><span>21ST</span><span class="ms-it">CENTURY</span></h2>
    <div class="ms-car__desc">With the advent of the digital age, Maison Sanguine positions itself at the forefront of a new vision of nightlife entertainment, integrating emerging technologies into the creation of immersive and avant-garde experiences, while remaining true to its artistic references and club culture.</div>
  </div>
  <div class="ms-car__stage">
    <button class="ms-car__arrow ms-car__arrow--prev" type="button" aria-label="Previous" disabled><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M9 1.5 3.5 7 9 12.5"/></svg></button>
    <div class="ms-car__track" tabindex="0">
      ${CARD}${CARD}${CARD}${CARD}
    </div>
    <button class="ms-car__arrow ms-car__arrow--next" type="button" aria-label="Next"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M5 1.5 10.5 7 5 12.5"/></svg></button>
  </div>
  <div class="ms-car__dots" role="group" aria-label="Pagination"></div>
</section>
<section class="stp-next" aria-label="Next chapter">
  <h2 class="stp-next__title"><span>The</span><span class="ms-it">Studio</span></h2>
  <a class="stp-next__link" href="/about/the-studio" data-st-page="the-studio"><i></i><span>Next chapter</span></a>
</section>`
