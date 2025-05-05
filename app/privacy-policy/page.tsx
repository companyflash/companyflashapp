export default function Privacy() {
    return (
        <article className="mx-auto max-w-3xl px-4 py-12 prose">
        <h1>Privacy Policy</h1>
        <p><em>Last updated: 5 May 2025</em></p>
  
        <h2>1. Introduction</h2>
        <p>
          CompanyFlash Ltd (“CompanyFlash”, “we”, “us”) is committed to protecting
          your personal data in line with the UK General Data Protection
          Regulation (UK GDPR) and the Data Protection Act 2018.
        </p>
  
        <h2>2. What data we collect</h2>
        <ul>
          <li>
            <strong>Contact data&nbsp;</strong>—name, email address and any
            details you include when you write to us at{" "}
            <a href="mailto:matt@companyflash.com">matt@companyflash.com</a>.
          </li>
          <li>
            <strong>Usage data&nbsp;</strong>—anonymous analytics such as page
            views, device type and referring site.
          </li>
        </ul>
  
        <h2>3. How we use your data</h2>
        <ul>
          <li>To respond to enquiries you send us (UK GDPR Article 6 (1)(f)).</li>
          <li>To improve the Site via aggregated analytics (legitimate interest).</li>
        </ul>
  
        <h2>4. How long we keep your data</h2>
        <p>
          We keep email correspondence for up to 24 months, then delete it unless
          still required for ongoing business or legal reasons.
        </p>
  
        <h2>5. Third‑party processors</h2>
        <p>We use the following trusted services, each with its own safeguards:</p>
        <ul>
          <li>
            <strong>Vercel Inc.</strong> – hosting and global CDN (servers in EU &
            UK edge locations).
          </li>
          <li>
            <strong>Plausible Analytics OÜ</strong> – privacy‑focused analytics,
            hosted in the EU.
          </li>
        </ul>
  
        <h2>6. Your rights</h2>
        <p>You can ask us to:</p>
        <ul>
          <li>access the personal data we hold on you;</li>
          <li>correct any mistakes;</li>
          <li>erase your data or restrict its processing;</li>
          <li>transfer your data to another provider;</li>
          <li>object to processing based on legitimate interest.</li>
        </ul>
        <p>
          To exercise any right, email{" "}
          <a href="mailto:matt@companyflash.com">matt@companyflash.com</a>.
          We will respond within one calendar month.
        </p>
  
        <h2>7. Complaints</h2>
        <p>
          If you are unhappy with how we handle your data, please contact us
          first. You also have the right to lodge a complaint with the UK
          Information Commissioner’s Office (<a href="https://ico.org.uk">
            ico.org.uk
          </a>).
        </p>
  
        <hr />
  
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} CompanyFlash Ltd. This policy is provided
          as a template and does not constitute legal advice.
        </p>
      </article>
    );
  }
  