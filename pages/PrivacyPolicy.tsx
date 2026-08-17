import React from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const PrivacyPolicy: React.FC = () => {
  const { settings } = useSiteSettings();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto w-full text-gray-900 dark:text-gray-300">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-12">Last Updated: October 26, 2024</p>

      <div className="space-y-10 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">1. Introduction</h2>
          <p>
            Welcome to BrandiQue Web Solutions ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">2. Information We Collect</h2>
          <p className="mb-4">We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and services.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, phone number, and other contact details provided via our contact forms.</li>
            <li><strong>Project Details:</strong> Information regarding your budget, project scope, and requirements submitted through our inquiry forms.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information, and operating system collected automatically for analytics and security purposes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">3. How We Use Your Information</h2>
          <p>We use the information we collect or receive:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>To facilitate account creation and logon processes (for admin users).</li>
            <li>To send you marketing and promotional communications (with your consent).</li>
            <li>To respond to user inquiries and offer support.</li>
            <li>To deliver and facilitate delivery of services to the user.</li>
            <li>To protect our website and enforce our terms and conditions.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to access or store information. Specific information about how we use such technologies 
            and how you can refuse certain cookies is set out in our Cookie Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">5. Third-Party Tools</h2>
          <p>
            We may share data with trusted third-party service providers to help us perform statistical analysis, send you email or postal mail, 
            provide customer support, or arrange for deliveries. All such third parties are prohibited from using your personal information except 
            to provide these services to us, and they are required to maintain the confidentiality of your information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">6. Data Security</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. 
            However, please also remember that we cannot guarantee that the internet itself is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">7. Contact Us</h2>
          <p>
            If you have questions or comments about this policy, you may email us at: <br/>
            <a href={`mailto:${settings.email}`} className="text-neon-purple hover:underline font-bold">{settings.email}</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;