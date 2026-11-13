import type { LegalDoc } from './LegalPage'

const MS = 'https://maisonsanguine.com'
const MAIL = '[privacy@maisonsanguine.com](mailto:privacy@maisonsanguine.com)'

export const PRIVACY_NOTICE: LegalDoc = {
  title: 'Privacy Notice',
  sections: [
    {
      title: 'Introduction',
      blocks: [
        'Your personal data is very important to Maison Sanguine (“we” or “our”). This Privacy Notice explains how we collect, use, store and protect personal data when you access our online and offline services, including data gathered via our websites, applications, social media platforms, event registration forms, customer relations channels, and during experiences, celebrations or private events organised by Maison Sanguine.',
        `The Maison Sanguine [Cookie Policy](/legal/cookie-policy) supplements this Privacy Notice and describes what cookies are, how we use them, and how you may accept or refuse them.`,
        'Whenever you provide personal data to Maison Sanguine, the relevant Maison Sanguine entity is responsible for its collection and processing in accordance with applicable laws, in particular the GDPR.',
        'You must be 21 years of age or older to submit personal data or request access to any service relating to Maison Sanguine events.',
        `We invite you to read this Privacy Notice carefully. You may request a copy at any time by contacting us at ${MAIL}.`,
      ],
    },
    {
      title: '1. Personal Data We Collect',
      blocks: [
        'This Privacy Notice applies to any personal data collected from you or about you, from the following sources:',
        {
          list: [
            'registration for Maison Sanguine events or private celebrations;',
            'participation in experiences, installations, or brand activations;',
            'requests for access, invitations or guest-list submissions;',
            'electronic communications or direct interactions with our team;',
            'on-site or digital forms (maisonsanguine.com, Typeform, WhatsApp Business);',
            'visits to our websites or use of digital services;',
            'interaction with Maison Sanguine on social media;',
            'partnership or collaboration requests;',
            'security or operational systems at certain events.',
          ],
        },
        'Depending on your interactions, we may collect the following categories of personal data:',
        { sub: 'Identity and contact information' },
        'Name, surname, email address, telephone number, nationality (when relevant), social media identifiers, and photographs voluntarily provided or captured during certain events.',
        { sub: 'Personal preferences and event history' },
        'Preferred event locations, RSVP history, interests related to nightlife, culture or entertainment, concierge preferences, and optional personal preferences you choose to share.',
        { sub: 'Event participation information' },
        'Attendance confirmations, registration data, surveys, and participation in contests or invitations.',
        { sub: 'Website and technical data' },
        'IP address, device and browser type, navigation data, time zone, interaction logs, and analytics collected through tools such as Google Analytics.',
        { sub: 'Communications and feedback' },
        'Information you voluntarily provide regarding your experience with Maison Sanguine.',
        { sub: 'Security and operational data' },
        'When strictly necessary for the safety of our guests and staff, certain events may involve the processing of limited video or environmental data in accordance with legal requirements.',
        { sub: 'Payment or transaction data' },
        'When applicable (for paid events or reservations), billing or transaction information, processed securely and in line with legal obligations.',
        { sub: 'Social media information' },
        'Content you share publicly on social media that relates to Maison Sanguine.',
        { sub: 'Minors' },
        'Maison Sanguine does not knowingly collect personal data from individuals under 21 years of age. If such data has been submitted, please contact us immediately so that appropriate measures can be taken.',
      ],
    },
    {
      title: '2. Use of Your Personal Data',
      blocks: [
        'We process your personal data based on:',
        { list: ['your consent;', 'the performance of a contract or service you request;', 'our legitimate interest;', 'compliance with legal obligations.'] },
        'Depending on context, your data may be used for:',
        {
          list: [
            'managing event access, invitations and guest-list verification;',
            'processing your registration for Maison Sanguine events;',
            'responding to your requests and enquiries;',
            'providing concierge or hospitality-related services;',
            'developing and improving our relationship with you;',
            'managing your participation in Maison Sanguine experiences;',
            'sending updates, announcements or invitations (with consent);',
            'personalising your online experience;',
            'ensuring security and operational management of events;',
            'conducting surveys and statistical analysis;',
            'handling claims or legal matters;',
            'preventing fraud, abuse or unauthorised resale of invitations.',
          ],
        },
      ],
    },
    {
      title: '3. How We Protect Your Personal Data',
      blocks: [
        'We implement strict organisational, technical and security measures to protect your data against unauthorised access, alteration or disclosure.',
        'Although we apply high-level security standards, no method of Internet transmission is entirely secure during transit.',
      ],
    },
    {
      title: '4. Sharing of Your Personal Data',
      blocks: [
        'Maison Sanguine does not sell or rent your personal data.',
        'We may share your data with:',
        {
          list: [
            'internal Maison Sanguine teams;',
            'service providers assisting with website hosting, communication, event management or security;',
            'payment service providers (when applicable);',
            'trusted partners involved in the organisation of events;',
            'legal authorities when legally required.',
          ],
        },
        'Transfers outside the EU are governed by GDPR-approved mechanisms.',
      ],
    },
    {
      title: '5. Storage of Your Personal Data',
      blocks: [
        'We retain your personal data only for the time necessary to fulfil the purposes listed in Section 2, except where a longer retention period is required or permitted by law. For example:',
        {
          list: [
            'contact and communication data: up to 3 years from last interaction;',
            'event-related data: retained for operational needs and legal compliance;',
            'transaction data: retained in accordance with accounting requirements;',
            'security data: retained only for legally permitted periods.',
          ],
        },
        'You may request deletion at any time unless legal obligations require retention.',
      ],
    },
    {
      title: '6. Your Rights',
      blocks: [
        'Under the GDPR, you may:',
        {
          list: [
            'access your personal data;',
            'request correction, deletion or limitation of processing;',
            'withdraw your consent at any time;',
            'object to certain types of processing;',
            'request a digital copy of your data (data portability);',
            'lodge a complaint with your data protection authority.',
          ],
        },
        `Requests may be sent to ${MAIL}.`,
      ],
    },
    {
      title: '7. Amendments to this Privacy Notice',
      blocks: [
        'Maison Sanguine may update this Privacy Notice at any time. Changes take effect upon publication. We encourage you to consult this page regularly.',
      ],
    },
    {
      title: '8. Contact Us',
      blocks: [
        `For any questions regarding this Privacy Notice, please contact the Maison Sanguine Data Protection Office at ${MAIL}.`,
        'This document was last updated on December 1, 2025.',
      ],
    },
  ],
}
