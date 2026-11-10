import type { LegalDoc } from './LegalPage'

const PN = '[Privacy Notice](/legal/privacy-notice)'

export const COOKIE_POLICY: LegalDoc = {
  title: 'Cookie Policy',
  sections: [
    {
      title: '1. What is a Cookie?',
      blocks: [
        'A “cookie” is a small text file stored on the hard drive of your computer, tablet, mobile phone or any other electronic device (the “Device”) used to access our website and online services (the “Services”).',
        'Your web browser stores information on your Device relating to your visit and your use of the Services, for example to remember your session, your language preferences or certain navigation settings.',
        'We use cookies to:',
        {
          list: [
            'improve your browsing experience;',
            'understand how our website is used;',
            'maintain the security and performance of the Services;',
            'where applicable, measure the impact of our communication and campaigns.',
          ],
        },
        `Cookies do not generally allow us to identify you directly as an individual, but certain cookies may be associated with other information you have provided to us (for example via a contact or registration form). In such cases, the cookie data may be considered personal data and will be processed in accordance with our ${PN}.`,
        'In addition to cookies, we may also use similar technologies, such as pixels or tags, which enable us to measure the performance of our content and campaigns, especially on third-party platforms.',
      ],
    },
    {
      title: '2. Types of Cookies We Use',
      blocks: [
        'When you access our Services, the following categories of cookies may be placed on your Device. They can be distinguished by their source, their duration and their purpose.',
        { sub: '2.1. First-party cookies' },
        'These cookies are placed directly by Maison Sanguine or by the service provider operating our website (for example, our website platform). They are generally used to ensure the technical operation of the site, remember your choices or measure audience and performance.',
        { sub: '2.2. Third-party cookies' },
        'These cookies are placed by third parties (for example, analytics or social media partners) when you browse our site or interact with certain integrated features (such as embedded videos, social sharing buttons, or measurement tools).',
        'These third parties process data in accordance with their own privacy and cookie policies.',
        { sub: '2.3. Session cookies' },
        'Session cookies are stored on your Device only for the duration of your browsing session. They are deleted once you close your browser. They are typically used to:',
        {
          list: [
            'maintain your session while you navigate the site;',
            'remember certain temporary actions or technical choices;',
            'ensure the proper functioning and security of the website.',
          ],
        },
        { sub: '2.4. Persistent cookies' },
        'Persistent cookies remain on your Device for a defined period after your browsing session (for instance, several days or months, depending on their purpose and settings). They are typically used to:',
        {
          list: [
            'remember your preferences (for example, language, consent choices);',
            'measure the performance of the website over time;',
            'contribute to analytics and audience measurement.',
          ],
        },
      ],
    },
    {
      title: '3. Cookie Categories by Purpose',
      blocks: [
        { sub: '3.1. Strictly necessary cookies' },
        'These cookies are essential for the proper functioning of the website and cannot be disabled in our systems. They are usually set in response to actions taken by you that amount to a request for services, such as:',
        {
          list: [
            'navigating between pages;',
            'setting your privacy preferences;',
            'filling in forms;',
            'securing access to certain sections.',
          ],
        },
        'If you configure your browser to block these cookies, some parts of the website may no longer function correctly. These cookies do not store information that directly identifies you.',
        { sub: '3.2. Functional cookies' },
        'These cookies enable the website to provide enhanced features and a more personalised experience. They can be used, for example, to:',
        {
          list: [
            'remember your language or location preferences;',
            'maintain certain display settings or user interface choices;',
            'facilitate the use of forms or interactive modules.',
          ],
        },
        'If you disable these cookies, some functionalities may not operate as intended, and your browsing experience may be less fluid.',
        { sub: '3.3. Performance and analytics cookies' },
        'These cookies allow us to measure traffic, usage and performance of our website in order to improve its quality, relevance and ergonomics. They help us understand:',
        {
          list: [
            'which pages are visited most or least;',
            'how visitors navigate the site;',
            'how fast pages load;',
            'more broadly, how the site is used.',
          ],
        },
        'The information collected by these cookies is generally aggregated and not used to identify you directly. If you disable these cookies, we may be less able to improve our Services based on usage data.',
        { sub: '3.4. Advertising and targeting cookies (if used)' },
        'Where applicable, these cookies may be set by our partners to:',
        {
          list: [
            'measure the performance of our communication campaigns;',
            'display content that is more relevant to your interests;',
            'limit the number of times you see a given message.',
          ],
        },
        'These cookies do not store information that directly identifies you, but are based on the unique identification of your browser or Device. If you do not allow these cookies, you may receive less tailored content.',
        { sub: '3.5. Social media cookies' },
        'These cookies may be set by social media platforms integrated into our website (for example, via sharing buttons or embedded content). They allow:',
        {
          list: [
            'sharing our content with your networks;',
            'tracking your browsing for the purpose of measuring or personalising content on these platforms.',
          ],
        },
        'If you disable these cookies, some sharing features or embedded social content may not be available.',
      ],
    },
    {
      title: '4. Pixels and Similar Technologies',
      blocks: [
        'We may use pixels, tags or similar technologies in our emails, pages or on third-party platforms to:',
        {
          list: [
            'measure the performance of a campaign;',
            'determine whether an email has been opened;',
            'know whether a user has visited a certain page after clicking on a link;',
            'optimise our communication and marketing actions.',
          ],
        },
        'These technologies do not store files on your Device like cookies, but may rely on cookies already present or create associations with third-party tools (for example, analytics platforms or social media).',
      ],
    },
    {
      title: '5. Cookie Consent and Preferences',
      blocks: [
        'When you first visit the Site, a banner or consent tool may invite you to:',
        { list: ['accept all cookies;', 'refuse certain categories of cookies;', 'customise your choices.'] },
        'You can modify your preferences at any time via:',
        {
          list: [
            'the cookie management tool available on the Site (where applicable);',
            'your browser settings, as described below.',
          ],
        },
        'If you choose to refuse certain cookies (in particular functional or performance cookies), some features of the Site may not operate as intended.',
      ],
    },
    {
      title: '6. How to Manage Cookies in Your Browser',
      blocks: [
        'You can configure your browser so that:',
        { list: ['it accepts all cookies;', 'it rejects all cookies;', 'it informs you when a cookie is stored.'] },
        'The procedure differs depending on the browser used. You can consult the help section of your browser for more information, for example Safari™, Chrome™, Firefox™, Edge™ or Opera™.',
        'For more information on cookies and how to manage or delete them, you can also consult:',
        {
          list: [
            'Network Advertising Initiative: [www.networkadvertising.org](https://www.networkadvertising.org)',
            'Your Online Choices: [www.youronlinechoices.com](https://www.youronlinechoices.com)',
          ],
        },
      ],
    },
    {
      title: '7. Third-Party Data Management',
      blocks: [
        'Certain cookies or tracking technologies may be operated by third parties. These third parties process data in accordance with their own privacy and cookie policies.',
        'Depending on the configuration of the Site, such third parties may include, for example:',
        {
          list: [
            'website hosting or platform providers (such as Squarespace);',
            'analytics providers (such as Google Analytics);',
            'social media platforms (such as Meta / Facebook, Instagram, LinkedIn, TikTok).',
          ],
        },
        'We encourage you to consult the privacy and cookie policies of these third parties in order to understand how they use your data and how to manage your preferences directly with them.',
      ],
    },
    {
      title: '8. Updates to this Cookie Policy',
      blocks: [
        'Maison Sanguine reserves the right to modify this Cookie Policy at any time. Any changes will be published on this page and will take effect upon publication. We invite you to consult this page regularly to stay informed of the most recent version.',
        `For more information on how we process personal data, please consult our ${PN}.`,
        'Latest update: December 1, 2025.',
      ],
    },
  ],
}
