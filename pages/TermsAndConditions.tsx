import React from 'react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto w-full text-gray-900 dark:text-gray-300">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">Terms & Conditions</h1>
      <p className="text-sm text-gray-500 mb-12">Last Updated: October 26, 2024</p>

      <div className="space-y-10 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">1. Agreement to Terms</h2>
          <p>
            These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and BrandiQue Web Solutions ("we," "us" or "our"), 
            concerning your access to and use of our website and services. By accessing the site, you agree that you have read, understood, and agree to be bound by all of these Terms and Conditions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">2. Intellectual Property Rights</h2>
          <p className="mb-4">
            Unless otherwise indicated, the Site and its proprietary source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site 
            (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
          </p>
          <p>
            <strong>Client Work:</strong> Upon full payment, rights to the final delivered project (website code, designs) are transferred to the client, excluding any third-party tools, libraries, or stock assets used.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">3. User Representations</h2>
          <p>
            By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; 
            (2) you have the legal capacity and you agree to comply with these Terms and Conditions; (3) you will not use the Site for any illegal or unauthorized purpose.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">4. Services and Payment</h2>
          <p>
            We offer web development, branding, and digital marketing services. Prices listed on the website are indicative and subject to change based on project scope. 
            Specific terms regarding payment schedules, deliverables, and timelines will be outlined in a separate service agreement or invoice for each project.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">5. Limitation of Liability</h2>
          <p>
            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, 
            or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site or our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">6. Governing Law</h2>
          <p>
            These Terms shall be governed by and defined following the laws of India. BrandiQue Web Solutions and yourself irrevocably consent that the courts of India 
            shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">7. Contact Us</h2>
          <p>
            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <br/>
            <a href="mailto:brandiqueagency@gmail.com" className="text-neon-purple hover:underline font-bold">brandiqueagency@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;