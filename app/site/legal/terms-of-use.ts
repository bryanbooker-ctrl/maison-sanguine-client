import type { LegalDoc } from './LegalPage'

const MS = 'https://maisonsanguine.com'

export const TERMS_OF_USE: LegalDoc = {
  title: 'Terms of Use',
  sections: [
    {
      title: 'Preamble',
      blocks: [
        'The website www.maisonsanguine.com (the “Site”) is published and administered by Maison Sanguine, a company registered in France with its registered office in Paris (“Maison Sanguine”). Access to and use of the Site are governed by these terms and conditions of use (the “Terms of Use”).',
        `By accessing, browsing, or using the Site, you unconditionally accept the Terms of Use. By using the Site, you also acknowledge Maison Sanguine’s [Privacy Notice](/legal/privacy-notice) and [Cookie Policy](/legal/cookie-policy). Maison Sanguine reserves the right to modify these Terms of Use at any time by publishing an updated version. Maison Sanguine invites you to regularly consult this page to stay informed of the Terms of Use applicable to your use of the Site.`,
      ],
    },
    {
      title: 'Copyright and Intellectual Property',
      blocks: [
        'Maison Sanguine is the owner of the Site. All content available on the Site, including, without limitation, texts, trademarks, logos, graphics, photographs, videos, illustrations, wallpapers, music, layouts, design elements, know-how, concepts, software, and processes (the “Content”), is the property of Maison Sanguine or its partners, or is used with the authorization of their respective rights holders. This Content is protected by copyright, trademark law, design law, patent law, and any other applicable intellectual property rights.',
        'You may download, display, or print the Content solely for personal and non-commercial use. All proprietary notices or usage conditions included with any downloaded material must be observed and retained. Any other use, including reproduction, modification, downloading, transmission, distribution, or publication of all or part of the Content, is strictly prohibited without prior written authorization from Maison Sanguine.',
        'Any breach of these Terms of Use constitutes a violation of Maison Sanguine’s intellectual property rights.',
      ],
    },
    {
      title: 'Personal Data',
      blocks: [
        `Personal data that may be collected when you access our online or offline services is processed in accordance with our [Privacy Notice](/legal/privacy-notice). You must be at least 21 years old to register or submit personal data via the Site.`,
      ],
    },
    {
      title: 'Hypertext Links',
      blocks: [
        'For your convenience, the Site may provide links to websites not operated or controlled by Maison Sanguine. Maison Sanguine cannot be held responsible for the accuracy, relevance, legality, availability, or any other aspect of the content or documents hosted on such third-party sites.',
        'The creation of hypertext links to the Site is prohibited without prior written consent from Maison Sanguine.',
      ],
    },
    {
      title: 'Maison Sanguine Services',
      blocks: [
        'The experiences, events, and services presented on the Site may be available through Maison Sanguine or its authorized partners. Maison Sanguine does not guarantee the availability of services or invitations displayed on the Site, as access may be limited due to capacity, eligibility, or selection criteria.',
        `Maison Sanguine reserves the right to modify or remove, at any time and without notice, the services presented on the Site. For further information, Maison Sanguine invites users to contact the House via the [Contact](${MS}/contact) section of the Site.`,
      ],
    },
    {
      title: 'Online Services',
      blocks: [
        `The availability of certain online services may depend on the region from which you access the Site. Each service may be subject to its own specific terms and conditions, displayed when the service is requested or available upon inquiry through the [Contact](${MS}/contact) section. Maison Sanguine reserves the right to modify or suspend online services at any time.`,
      ],
    },
    {
      title: 'Limitation of Liability',
      blocks: [
        'To the fullest extent permitted by law, Maison Sanguine shall not be liable for any direct, indirect, or consequential damages, including loss of profits or third-party claims, that may arise from, without limitation:',
        {
          list: [
            'information or images available on the Site;',
            'temporary inaccessibility of the Site;',
            'Internet network malfunctions affecting access to the Site;',
            'malfunction or improper use of the user’s device;',
            'errors, defects, delays, or interruptions in data transmission beyond the control of Maison Sanguine;',
            'use of any material from the Site (including infringement of third-party rights);',
            'content hosted on third-party websites accessible via hyperlinks;',
            'the presence of viruses or malicious software that may affect your equipment as a result of browsing the Site or downloading Content.',
          ],
        },
        'Maison Sanguine makes every effort to ensure the accuracy and updating of the information displayed on the Site; however, the House provides no guarantee, explicit or implied, regarding the Content, which is provided for informational purposes and has no contractual value.',
      ],
    },
    {
      title: 'Applicable Law and Jurisdiction',
      blocks: [
        'Any dispute concerning these Terms of Use, the Content, or the use of the Site shall be governed by French law, to the exclusion of any conflict-of-law rules.',
        'The courts of Paris shall have exclusive jurisdiction, subject to the right to appeal before competent French courts.',
      ],
    },
    {
      title: 'Contact',
      blocks: [
        `Any request relating to these Terms of Use, the Site, or its Content may be submitted through the [Contact](${MS}/contact) section.`,
        'These Terms of Use were last updated on December 1, 2025.',
      ],
    },
  ],
}
