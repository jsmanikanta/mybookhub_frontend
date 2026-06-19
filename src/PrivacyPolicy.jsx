import React from "react";
import "./styles/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <h1>Privacy Policy</h1>
        <section>
          <p>
            MyBookHub is committed to protecting your privacy. This Privacy
            Policy explains how we collect, use, and safeguard your information
            when you use our platform.
          </p>

          <p>
            By using MyBookHub, you agree to the collection and use of
            information in accordance with this Privacy Policy.
          </p>

          <p>
            MyBookHub is a platform that helps users buy, sell, donate, and
            discover books. MyBookHub does not act as a party in transactions
            between buyers and sellers. Users are solely responsible for
            agreeing upon prices, payment methods, delivery arrangements, and
            the authenticity of listings.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>

          <p>
            To provide our services, we may collect the following information:
          </p>

          <ul>
            <li>Name</li>
            <li>Email Address</li>
            <li>Phone Number</li>
            <li>Profile Information</li>
            <li>Book Listings and Uploaded Images</li>
            <li>Messages and User Interactions</li>
          </ul>

          <p>
            Some information is required for account creation and platform
            functionality, while other information is optional.
          </p>
        </section>

        <section>
          <h2>How We Use Your Information</h2>

          <ul>
            <li>Create and manage user accounts.</li>
            <li>Enable communication between buyers and sellers.</li>
            <li>Display book listings and user-generated content.</li>
            <li>Improve platform performance and user experience.</li>
            <li>Prevent fraudulent activity and misuse.</li>
            <li>Provide customer support.</li>
          </ul>
        </section>

        <section>
          <h2>Book Listings and User Content</h2>

          <p>
            Information you choose to publish, including book details, images,
            descriptions, and contact information, may be visible to other
            users of the platform.
          </p>

          <p>
            Please avoid sharing sensitive personal information in public
            listings.
          </p>
        </section>

        <section>
          <h2>Third-Party Services</h2>

          <p>
            MyBookHub may use trusted third-party services for hosting,
            authentication, analytics, image storage, and communication.
          </p>

          <ul>
            <li>Cloudinary (Image Storage)</li>
            <li>Google Services</li>
            <li>MongoDB Atlas</li>
            <li>Render / Vercel Hosting Services</li>
          </ul>

          <p>
            These providers may process information only to the extent required
            to deliver their services.
          </p>
        </section>

        <section>
          <h2>Log Data</h2>

          <p>
            When using MyBookHub, we may automatically collect technical
            information such as:
          </p>

          <ul>
            <li>IP Address</li>
            <li>Browser Type</li>
            <li>Device Information</li>
            <li>Operating System</li>
            <li>Date and Time of Access</li>
            <li>Error Logs and Diagnostic Information</li>
          </ul>
        </section>

        <section>
          <h2>Data Security</h2>

          <p>
            We use commercially reasonable security measures to protect your
            information. However, no method of electronic transmission or
            storage is completely secure, and we cannot guarantee absolute
            security.
          </p>
        </section>

        <section>
          <h2>External Links</h2>

          <p>
            MyBookHub may contain links to third-party websites. We are not
            responsible for the content, security practices, or privacy policies
            of external websites.
          </p>
        </section>

        <section>
          <h2>Children's Privacy</h2>

          <p>
            MyBookHub is not intended for children under the age of 13. We do
            not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2>Changes to This Privacy Policy</h2>

          <p>
            We may update this Privacy Policy periodically. Changes become
            effective immediately upon posting on this page.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>

          <p>
            If you have questions regarding this Privacy Policy, please contact
            us at:
          </p>

          <p>
            <strong>Email:</strong> support@mybookhub.store
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;