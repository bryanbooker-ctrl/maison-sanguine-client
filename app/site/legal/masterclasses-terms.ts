import type { LegalDoc } from './LegalPage'

const PARIS = '[aphouse.paris@maisonsanguine.com](mailto:aphouse.paris@maisonsanguine.com)'
const NY = '[aphouse.newyork@maisonsanguine.com](mailto:aphouse.newyork@maisonsanguine.com)'
const PRIVACY = '[privacy@maisonsanguine.com](mailto:privacy@maisonsanguine.com)'

export const MASTERCLASSES_TERMS: LegalDoc = {
  title: 'Masterclasses Terms of Sale',
  sections: [
    {
      title: '1. Scope',
      blocks: [
        'These Masterclasses Terms of Sale (the “Terms”) govern the online booking and purchase of in-person masterclasses (the “Masterclasses”) offered by Maison Sanguine on the website www.maisonsanguine.com and any related digital channel (together, the “Site”), and held in the Maison Sanguine Houses (each, an “MS House”). The MS Houses currently offering Masterclasses are listed on the [Masterclasses](/masterclasses) page of the Site.',
        'By confirming a booking, the purchaser acknowledges having read and accepted these Terms, together with the [Terms of Use](/legal/terms-of-use) and the [Privacy Notice](/legal/privacy-notice) of the Site.',
        'Maison Sanguine may update these Terms at any time. The version in force on the date of the booking applies to that booking. These Terms may be displayed, saved and printed by the purchaser.',
      ],
    },
    {
      title: '2. Identity of the Organiser',
      blocks: [
        'Masterclasses are sold and organised by Maison Sanguine, a société par actions simplifiée (simplified joint-stock company) registered in France, with its registered office at 60 rue François Ier, 75008 Paris, France (the “Organiser”).',
        { list: ['SIREN: 992 327 999', 'SIRET: 992 327 999 00015', 'VAT number: FR77992327999'] },
        'The MS Houses can be contacted at the following addresses:',
        { list: [`MS House Paris: ${PARIS}`, `MS House New York: ${NY}`] },
      ],
    },
    {
      title: '3. Masterclasses and Booking',
      blocks: [
        'Masterclasses are in-person experiences held on a fixed date and time, designed to introduce participants to the savoir-faire of Maison Sanguine and the world of Haute Nuit. The topic, level, date, duration, MS House, language and price of each Masterclass are described on the Site.',
        'To book a Masterclass, the purchaser must hold an MS Account or create one on the Site. Each booking is nominative: the name of every participant must be provided, and a booking may not be transferred to a person who is not registered.',
        'Masterclasses are reserved for participants aged 21 or older. Certain Masterclasses, such as those relating to mixology, involve the tasting of alcoholic beverages, which is subject to the laws of the country in which the MS House is located.',
        'Bookings are accepted within the limit of the places available for each Masterclass. The Organiser may be unable to accept a booking where required by applicable law or international regulations, including sanctions.',
      ],
    },
    {
      title: '4. Price and Payment',
      blocks: [
        'Prices are displayed on the Site, all taxes included, in the currency of the MS House where the Masterclass takes place. The price displayed at the time of booking is the price payable.',
        'Before confirming, the purchaser is shown a summary of the selected Masterclass, the number of places and the total price, and may correct or cancel the booking. The booking is confirmed once the purchaser accepts these Terms and completes payment.',
        'Payment is due in full at the time of booking, by credit or debit card. Payments are processed by our secure payment provider, Stripe, through an encrypted connection. Maison Sanguine does not store card details.',
        'Once payment has been successfully completed, the purchaser receives a confirmation email setting out the details of the booking. The booking can also be consulted at any time from the MS Account.',
      ],
    },
    {
      title: '5. Access to the Masterclass',
      blocks: [
        'Access to the Masterclass is subject to the verification of the booking confirmation. The Organiser may ask the purchaser and registered participants to present an official identity document and may refuse access, without refund, where the identity of a participant does not match the booking or where a participant does not meet the minimum age requirement.',
        'Masterclasses begin at the scheduled time. Access may be refused, without refund, to any participant arriving more than ten (10) minutes after the scheduled start time.',
        'Participants are required to follow the instructions of the Maison Sanguine teams and the rules applicable within the MS House. A participant who does not comply with these rules may be asked to leave the Masterclass, without compensation or refund.',
      ],
    },
    {
      title: '6. Cancellation and Changes',
      blocks: [
        'The purchaser may change or cancel a booking free of charge up to three (3) days before the date of the Masterclass, from the MS Account or by contacting the relevant MS House. In this case, the price paid is refunded in full.',
        'No refund is due for a cancellation made less than three (3) days before the Masterclass, or in the event of absence on the day.',
        'Should the Organiser have to cancel a Masterclass, the purchaser will be offered a new date or a full refund of the price paid, at the purchaser’s choice.',
        'Refunds are made to the card used for the original payment, within fifteen (15) days of the cancellation.',
      ],
    },
    {
      title: '7. Right of Withdrawal',
      blocks: [
        'In accordance with Article L.221-28, 12° of the French Consumer Code, the purchase of a Masterclass, as a leisure service provided on a specific date, is not subject to the legal right of withdrawal. This is without prejudice to the cancellation conditions offered by the Organiser in Section 6.',
      ],
    },
    {
      title: '8. Personal Data',
      blocks: [
        `The personal data of purchasers and participants is processed by Maison Sanguine to manage bookings and the organisation of Masterclasses, in accordance with the GDPR and our [Privacy Notice](/legal/privacy-notice). Purchasers and participants may exercise their rights by writing to ${PRIVACY}.`,
        'The personal data of participants other than the purchaser is used only for the purpose of the Masterclass, unless they have agreed otherwise.',
      ],
    },
    {
      title: '9. Liability',
      blocks: [
        'To the extent permitted by applicable law, the liability of the Organiser is limited to the price paid for the Masterclass. The Organiser is not liable for travel or accommodation costs, nor for any indirect damage.',
        'The Organiser cannot be held liable for damage resulting from the use of the Internet, including service interruptions, viruses, or fraudulent communications that impersonate Maison Sanguine. Maison Sanguine will never request payment or confidential information outside the Site and the MS Account; the purchaser is invited to verify the authenticity of any suspicious message.',
      ],
    },
    {
      title: '10. Governing Law, Mediation and Jurisdiction',
      blocks: [
        'These Terms are governed by French law. Where the purchaser is a consumer residing in another country, this choice does not deprive the purchaser of the protection afforded by the mandatory consumer protection provisions of the country of residence.',
        'In the event of a dispute, the purchaser is invited to contact the Organiser first in order to find an amicable solution. In accordance with Articles L.611-1 and following of the French Consumer Code, a consumer may also refer the dispute, free of charge, to a consumer mediator, whose details are available upon request from the Organiser.',
        'Failing an amicable solution, the dispute may be brought before the competent courts of Paris, France, or, where the purchaser is a consumer, before the courts of the place of the purchaser’s residence.',
      ],
    },
    {
      title: '11. Language',
      blocks: [
        'These Terms are drafted in English. Where a translation is provided, the English version prevails, except for Masterclasses held in France, for which the French version prevails where one is made available.',
      ],
    },
    {
      title: '12. Contact',
      blocks: [
        `For any question regarding a Masterclass or these Terms, please contact MS House Paris at ${PARIS} or MS House New York at ${NY}.`,
        'Effective date: November 11, 2026.',
      ],
    },
  ],
}
