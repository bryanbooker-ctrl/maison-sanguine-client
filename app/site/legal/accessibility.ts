import type { LegalDoc } from './LegalPage'

const MAIL = '[accessibility@maisonsanguine.com](mailto:accessibility@maisonsanguine.com)'

export const ACCESSIBILITY: LegalDoc = {
  title: 'Accessibility Statement',
  sections: [
    {
      blocks: [
        'Maison Sanguine is a contemporary house dedicated to culture, nightlife and artistic celebration. Driven by a spirit of openness and modernity, the House brings together diverse communities and strives to create environments where creativity, design and emotion coexist.',
        'This commitment extends to our digital presence.',
      ],
    },
    {
      title: 'Our Commitment',
      blocks: [
        'Maison Sanguine is committed to providing digital content, platforms and online services that are accessible to all users, regardless of ability, device or technology. The House makes every reasonable effort to ensure that its website conforms to applicable accessibility standards, including the Web Content Accessibility Guidelines (WCAG) 2.1 level A and AA.',
        'To support this objective, Maison Sanguine conducts ongoing reviews, technical adjustments and experience audits to identify, prevent and correct accessibility issues. Our goal is to offer an inclusive, intuitive and seamless browsing experience across all sections of the Site, including event information, membership enquiries, visual content, registration forms and interactive components.',
        'Accessibility is an essential extension of the values of Maison Sanguine: openness, creativity, and respect for all individuals who engage with the House. We believe that every person should be able to access, understand and enjoy our digital content without limitation.',
      ],
    },
    {
      title: 'Contact',
      blocks: [
        'If you encounter any difficulty using the Site, experience a functional limitation, or wish to request accessible alternatives to any content, we invite you to contact us. Your feedback supports our continuous improvement process and helps us ensure that our digital platforms remain accessible and welcoming to everyone.',
        `Contact: ${MAIL}`,
        'Maison Sanguine will continue to evolve its accessibility practices in line with technological advancements, regulatory developments, and the needs of its global community.',
      ],
    },
  ],
}
