const PH = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
const CARD = `<article class="ms-car__card"><div class="ms-car__img"><img src="${PH}" alt="" loading="lazy" draggable="false"></div></article>`

export const STUDIO_THE_HTML = `<section class="stp-top" aria-label="The Studio">
  <h2 class="stp-title"><span>CREATION &amp;</span><span class="ms-it">INNOVATION</span></h2>
  <div class="stp-top__media"><img src="${PH}" alt="The Studio" loading="eager" draggable="false"></div>
</section>
<section class="ms-car ms-car--duo" aria-label="The Studio">
  <div class="ms-car__head">
    <div class="ms-car__intro">
      <div class="ms-car__desc ms-car__desc--lead">Conceived as a space for creativity and innovation, the Maison Sanguine Studio brings together the House’s creators and producers around a shared vision. An immersion into their expertise, offering an insight into how the artistic, spatial and technical creations that bring Maison Sanguine productions to life take shape.</div>
      <div class="ms-car__desc">Maison Sanguine productions are conceived by the House’s creators and producers within the Studio, where the artistic, spatial and technical creations that shape each edition are developed.</div>
    </div>
  </div>
</section>
<section class="ms-car ms-car--side ms-car--landscape" aria-label="Artistic Direction Studio">
  <div class="ms-car__head">
    <h2 class="ms-car__title"><span>ARTISTIC</span><span class="ms-it">DIRECTION</span><span class="ms-it">STUDIO</span></h2>
    <div class="ms-car__desc">The Artistic Direction Studio defines the creative and visual world of Maison Sanguine productions. Art directors and creators work together to conceive distinctive identities and bring the House’s vision to life.</div>
  </div>
  <div class="ms-car__stage">
    <button class="ms-car__arrow ms-car__arrow--prev" type="button" aria-label="Previous" disabled><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M9 1.5 3.5 7 9 12.5"/></svg></button>
    <div class="ms-car__track" tabindex="0">
      ${CARD}${CARD}${CARD}
    </div>
    <button class="ms-car__arrow ms-car__arrow--next" type="button" aria-label="Next"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M5 1.5 10.5 7 5 12.5"/></svg></button>
  </div>
  <div class="ms-car__dots" role="group" aria-label="Pagination"></div>
</section>
<section class="ms-car ms-car--side ms-car--landscape" aria-label="Spatial Design Studio">
  <div class="ms-car__head">
    <h2 class="ms-car__title"><span>SPATIAL</span><span class="ms-it">DESIGN</span><span class="ms-it">STUDIO</span></h2>
    <div class="ms-car__desc">The Spatial Design Studio offers a window into the conception of the spaces that host Maison Sanguine productions. Designers and architects work together to create environments in harmony with each property’s architecture and the character of each destination.</div>
  </div>
  <div class="ms-car__stage">
    <button class="ms-car__arrow ms-car__arrow--prev" type="button" aria-label="Previous" disabled><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M9 1.5 3.5 7 9 12.5"/></svg></button>
    <div class="ms-car__track" tabindex="0">
      ${CARD}${CARD}${CARD}
    </div>
    <button class="ms-car__arrow ms-car__arrow--next" type="button" aria-label="Next"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M5 1.5 10.5 7 5 12.5"/></svg></button>
  </div>
  <div class="ms-car__dots" role="group" aria-label="Pagination"></div>
</section>
<section class="ms-car ms-car--side ms-car--landscape" aria-label="Scenography Studio">
  <div class="ms-car__head">
    <h2 class="ms-car__title"><span>SCENOGRAPHY</span><span class="ms-it">STUDIO</span></h2>
    <div class="ms-car__desc">The Scenography Studio brings to life the worlds imagined by Maison Sanguine’s creators. Scenographers and designers combine structures, installations and lighting compositions to transform each property into an immersive environment.</div>
  </div>
  <div class="ms-car__stage">
    <button class="ms-car__arrow ms-car__arrow--prev" type="button" aria-label="Previous" disabled><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M9 1.5 3.5 7 9 12.5"/></svg></button>
    <div class="ms-car__track" tabindex="0">
      ${CARD}${CARD}${CARD}
    </div>
    <button class="ms-car__arrow ms-car__arrow--next" type="button" aria-label="Next"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M5 1.5 10.5 7 5 12.5"/></svg></button>
  </div>
  <div class="ms-car__dots" role="group" aria-label="Pagination"></div>
</section>
<section class="ms-car ms-car--side ms-car--landscape" aria-label="Sound Architecture Studio">
  <div class="ms-car__head">
    <h2 class="ms-car__title"><span>SOUND</span><span class="ms-it">ARCHITECTURE</span><span class="ms-it">STUDIO</span></h2>
    <div class="ms-car__desc">The Sound Architecture Studio offers a window into the creation of the musical identity of Maison Sanguine’s Seasons. The House entrusts the sound direction of each Season to a Master of Sound, who works alongside its producers to define a distinctive musical vision.</div>
  </div>
  <div class="ms-car__stage">
    <button class="ms-car__arrow ms-car__arrow--prev" type="button" aria-label="Previous" disabled><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M9 1.5 3.5 7 9 12.5"/></svg></button>
    <div class="ms-car__track" tabindex="0">
      ${CARD}${CARD}${CARD}
    </div>
    <button class="ms-car__arrow ms-car__arrow--next" type="button" aria-label="Next"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M5 1.5 10.5 7 5 12.5"/></svg></button>
  </div>
  <div class="ms-car__dots" role="group" aria-label="Pagination"></div>
</section>
<section class="ms-car ms-car--side ms-car--landscape" aria-label="Technical Engineering Studio">
  <div class="ms-car__head">
    <h2 class="ms-car__title"><span>TECHNICAL</span><span class="ms-it">ENGINEERING</span><span class="ms-it">STUDIO</span></h2>
    <div class="ms-car__desc">The Technical Engineering Studio is where the systems required to realise Maison Sanguine productions are studied and developed. Engineers and technicians work together to implement the technical solutions that bring the Studio’s creations to life.</div>
  </div>
  <div class="ms-car__stage">
    <button class="ms-car__arrow ms-car__arrow--prev" type="button" aria-label="Previous" disabled><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M9 1.5 3.5 7 9 12.5"/></svg></button>
    <div class="ms-car__track" tabindex="0">
      ${CARD}${CARD}${CARD}
    </div>
    <button class="ms-car__arrow ms-car__arrow--next" type="button" aria-label="Next"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M5 1.5 10.5 7 5 12.5"/></svg></button>
  </div>
  <div class="ms-car__dots" role="group" aria-label="Pagination"></div>
</section>
<section class="ms-car ms-car--split stp-split" aria-label="Masterclass The Making of a Night">
  <div class="ms-car__media"><img src="${PH}" alt="Masterclass The Making of a Night" loading="lazy" draggable="false"></div>
  <div class="ms-car__head">
    <h2 class="ms-car__title"><span>MASTERCLASS</span><span class="ms-it">THE MAKING</span><span class="ms-it">OF A NIGHT.</span></h2>
    <div class="ms-car__desc">This immersive experience invites each participant to discover the creative and production processes behind a Maison Sanguine night. From artistic direction and sound architecture to spatial design and scenography, participants explore the different disciplines that bring these productions to life. In close contact with the House’s creators and producers, they discover how every detail contributes to transforming a private property into an immersive nightlife experience.</div>
    <a class="ms-car__link" href="/#st-visit"><i></i>Learn more</a>
  </div>
</section>`
