# Omviro Official Website

A responsive, premium dark-navy website starter for the Omviro technology brand, built with plain HTML, CSS and JavaScript.

## Included

- Responsive layout for desktop, tablet and mobile
- Home, Services, Products, Omviro Academy, About and Contact sections
- Mobile navigation menu
- Contact form validation
- Concept showcase cards for SmartBus and ExamPro
- Accessible labels, keyboard-friendly controls and reduced-motion support
- SVG favicon and basic SEO metadata

## Run locally

1. Download and extract the ZIP.
2. Open the `omviro-official-website` folder.
3. Double-click `index.html` to preview in your browser.

Recommended: in VS Code, install/use **Live Server**, open the folder, right-click `index.html`, and choose **Open with Live Server**.

## Configure contact inquiries

The contact form is intentionally frontend-only and does not store or transmit data. To enable inquiries:

1. Open `script.js`.
2. Set `CONTACT_EMAIL` to a real inbox you monitor, e.g. `hello@yourdomain.com`.
3. With this setting, form submission opens the visitor's default email application using a `mailto:` link. The visitor must still send the email; this is not a guaranteed delivery method.

For a production website, connect a backend or a trusted form service. Configure server-side validation, spam protection/rate limiting, secure handling of submissions and a privacy notice. Never put private API keys or email-service secrets in frontend JavaScript.

## Before publishing

- Verify the final brand/legal name and incorporation status. Do not present “Pvt. Ltd.” as a registered legal designation until incorporation is complete.
- Replace sample contact details and add verified business email, phone and social profiles if desired.
- SmartBus and ExamPro are labelled as concept projects. Keep this wording unless they are genuinely launched.
- Add a privacy policy and terms if collecting visitor information.
- Test all pages and the contact workflow on mobile and desktop.
- Deploy the folder to a static host such as GitHub Pages, Netlify, Cloudflare Pages or your own hosting provider. A custom domain is optional.

## File structure

```text
omviro-official-website/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── favicon.svg
```

## Customization

- Main colors and typography variables: top of `style.css`
- Page copy, links and sections: `index.html`
- Mobile navigation, contact form behavior and year: `script.js`
- Favicon: `assets/favicon.svg`

## Backend functionality not included

This project does **not** include a database, admin panel, authentication, student accounts, course delivery, payments, email delivery service or a server-side contact form. Those require a backend or third-party service and additional configuration.


## Logo customization

The website uses `assets/omviro-logo.svg` for the header/footer brand mark and `assets/favicon.svg` for the browser tab icon. Replace these SVG files with your own logo artwork (keep the same filenames), or update the image paths in `index.html`. The logo currently included is a starter Omviro concept mark, not a user-supplied official trademark.


## Brand logo
The provided Omviro logo is saved at `assets/omviro-logo.jpeg` and is used in the header, footer, and browser favicon. Replace this image while keeping the same filename to update the logo.


## Demo cart, orders, customer login and admin view
- The Store section includes sample service cards and Add to cart / Request quote buttons.
- The cart supports quantity changes and creates a local demo order.
- Customer demo login and admin demo login are front-end demonstrations only.
- Demo admin credentials: username `demo-admin`, password `OmviroDemo2026!`. These are visible in the JavaScript and are NOT secure.
- Cart, session and orders are saved in the current browser's localStorage only. They do not reach Omviro or any server and are not shared across devices.
- Before public launch, replace demo auth/orders with a secure backend, database, password hashing, server-side authorization, input validation, privacy protections, email notifications, and a trusted payment provider. Never collect real passwords or payment details in this demo.

## Customer profile and admin demo
The customer area now includes a profile form (name, email, phone, company/shop, city, address), profile editing, logout, and an order history filtered to the current demo profile. The admin demo shows order totals, customer profiles saved in the current browser, customer contact details, project requirements, and order-status controls.

**Important limitation:** This is still a browser-only prototype using localStorage. Admin/customer data is not shared across devices or visitors and can be edited by the browser user. Do not use it for real customer data or public production accounts. Production requires a secure backend/API, database, password hashing, authorization checks, server-side validation, privacy/security controls, and backups.


## UPI payment demo setup
1. Open `script.js` and replace `YOUR-UPI-ID@bank` in `OMVIRO_UPI_ID` with your own verified UPI ID.
2. Keep the payee name correct. Test the QR with a small amount before sharing the site. The QR image uses an online QR-generation service, so internet is required for that image.
3. The checkout asks the customer for the UPI transaction reference/UTR and records the order as **Payment verification pending**. In Admin demo, check the payment in your own UPI app/bank statement before selecting **Verified by admin**. A typed UTR or screenshot is not proof by itself.
4. This is frontend-only and uses localStorage; the customer and admin need the same browser/device to see the demo data. Do not use for real customer payments. For production, use a backend/database and a payment gateway/merchant UPI integration with server-side payment verification and secure admin authentication. Never ask customers for UPI PIN or OTP.


### Owner-provided payment QR
The uploaded QR image is stored at `assets/omviro-payment-qr.jpeg` and displayed in checkout. This is a static QR: it may not encode the current cart amount. Customer must check the payee and enter the exact amount displayed by checkout in their UPI app if needed. UTR is only a reference; verify the payment in the UPI/bank account before confirming any order. This browser-only demo does not automatically verify payments.


## Visual updates
- Added subtle scroll-reveal animations and hover motion with reduced-motion accessibility support.
- Added a “How we work” section explaining discovery, planning, building/testing, and launch/support.
- Animations are decorative; the site still works if IntersectionObserver is unavailable.
