const PH = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

const MARK = '<svg class="ms-qt__mark" viewBox="0 0 58 36" aria-hidden="true"><path d="M8.6 21.6C9.8 12.4 15.2 5.2 23.6.4l1.2 1.9C19.3 6.1 15.9 11.3 15.1 19.4 18.4 20.6 20.6 23.7 20.6 27.3c0 4.8-3.7 8.7-8.4 8.7C6.9 36 3.6 32 3.6 27.6c0-2.6 1.9-4.9 5-6zM38.6 21.6C39.8 12.4 45.2 5.2 53.6.4l1.2 1.9C49.3 6.1 45.9 11.3 45.1 19.4 48.4 20.6 50.6 23.7 50.6 27.3c0 4.8-3.7 8.7-8.4 8.7-5.3 0-8.6-4-8.6-8.4 0-2.6 1.9-4.9 5-6z"/></svg>'

const CARD = `<article class="ms-car__card"><div class="ms-car__img"><img src="${PH}" alt="" loading="lazy" draggable="false"></div></article>`

export const STUDIO_BORN_HTML = `<section class="stp-top" aria-label="The Capital of Art &amp; Culture">
  <h2 class="stp-title"><span>THE CAPITAL OF</span><span class="ms-it">ART &amp; CULTURE</span></h2>
  <div class="stp-top__media"><img src="${PH}" alt="The Capital of Art &amp; Culture" loading="eager" draggable="false"></div>
</section>
<section class="stp-intro" aria-label="Born in Paris">
  <div class="stp-intro__col">
    <p class="stp-intro__lead">Paris is a capital of exceptional artistic and cultural heritage, whose nocturnal identity has been shaped over centuries. At the heart of the city, cafés, cabarets and entertainment venues gradually gave rise to a thriving nightlife, making Paris a place of encounter and creative expression.</p>
    <p>From the 19th century onwards, artists, writers and musicians gathered in these establishments, transforming Parisian nights into spaces of expression, freedom and creative energy. From Montmartre to the Grands Boulevards, these venues welcomed generations of talent and helped shape the cultural identity of the capital.</p>
  </div>
  <div class="stp-intro__col">
    <p>This remarkable heritage gave rise to some of the most iconic establishments in the history of Parisian nightlife. It is within this artistic and nocturnal tradition that Maison Sanguine finds its inspiration, drawing on its legacy to reinterpret the art of celebration on an international stage today.</p>
  </div>
</section>
<section class="ms-car ms-car--square ms-car--float" aria-label="Inspired by Art &amp; Architecture">
  <div class="ms-car__head">
    <h2 class="ms-car__title"><span>INSPIRED</span><span class="ms-it">BY ART &amp; ARCHITECTURE</span></h2>
    <div class="ms-car__desc">Paris has inspired artists and creators for centuries. Its architectural heritage, historic monuments, art galleries, iconic venues and distinctive neighbourhoods form an exceptionally rich cultural landscape. This diversity has shaped the evolution of art, hospitality and entertainment, providing creators with an ever-evolving setting for expression and experimentation. To this day, the capital’s architectural beauty and artistic energy continue to inspire new forms of creation, reflecting the timeless connection between art, architecture and the art of hospitality.</div>
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
<section class="ms-car ms-car--split ms-car--flip stp-split" aria-label="The Studio">
  <div class="ms-car__media"><img src="${PH}" alt="The Studio" loading="lazy" draggable="false"></div>
  <div class="ms-car__head">
    <h2 class="ms-car__title"><span>The</span><span class="ms-it">Studio</span></h2>
    <div class="ms-car__desc ms-car__desc--lead">The Maison Sanguine Studio brings together creators and talents from diverse backgrounds, each driven to push the boundaries of their art and expertise, edition after edition.</div>
    <div class="ms-car__desc">Deeply rooted in Parisian culture, the Maison Sanguine Studio conceives each production in Paris before bringing it to life across the destinations that host its events, season after season. Informed by local cultures and guided by a shared creative vision, Maison Sanguine nights are conceived in Paris to resonate around the world.</div>
  </div>
</section>
<section class="ms-qt ms-qt--grey">
  <div class="ms-qt__in">
    ${MARK}
    <div class="ms-qt__text">Maison Sanguine keeps one foot rooted in Parisian nightlife heritage and one foot stepping into the future of entertainment and culture.</div>
    <div class="ms-qt__by"><span class="ms-qt__name">Bryan Booker</span><span class="ms-qt__role">Founder and Creative Director, Maison Sanguine</span></div>
  </div>
</section>
<section class="ms-car ms-car--split ms-car--flip stp-split" aria-label="The Founder">
  <div class="ms-car__media"><img src="${PH}" alt="The Founder" loading="lazy" draggable="false"></div>
  <div class="ms-car__head">
    <h2 class="ms-car__title"><span>The</span><span class="ms-it">Founder</span></h2>
    <div class="ms-car__desc ms-car__desc--lead">In 2023, Bryan Booker founded Maison Sanguine in Paris, with the ambition of creating a new vision of luxury entertainment and hospitality.</div>
    <div class="ms-car__desc">Driven by a singular vision, he conceived an independent House dedicated to the design and production of immersive nightlife experiences in exceptional private properties. At the intersection of international club culture, artistic creation and production excellence, Maison Sanguine develops a new approach to celebration, where each destination becomes the setting for a distinctive experience.</div>
    <div class="ms-car__desc">Since its founding, Maison Sanguine has cultivated a spirit of independence and an uncompromising vision. This philosophy continues to guide its development, driven by the ambition to push the boundaries of entertainment and redefine the codes of nightlife on an international scale.</div>
  </div>
</section>
<section class="stp-next" aria-label="Next chapter">
  <h2 class="stp-next__title"><span>An</span><span class="ms-it">Architecture</span></h2>
  <a class="stp-next__link" href="/about/an-architecture" data-st-page="an-architecture"><i></i><span>Next chapter</span></a>
</section>`
