import React from 'react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto w-full text-gray-900 dark:text-gray-300">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">Cookie Policy</h1>
      <p className="text-sm text-gray-500 mb-12">Last Updated: October 26, 2024</p>

      <div className="space-y-10 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">1. What Are Cookies?</h2>
          <p>
            Cookies are simple text files that are stored on your computer or mobile device by a website's server. Each cookie is unique to your web browser. 
            It will contain some anonymous information such as a unique identifier, website's domain name, and some digits and numbers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">2. How We Use Cookies</h2>
          <p>We use cookies to improve your browsing experience by:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>Remembering your preferences (such as Light or Dark mode settings).</li>
            <li>Keeping you signed in (for Admin access).</li>
            <li>Understanding how you use our website via analytics tools to help us improve our content and user experience.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">3. Types of Cookies We Use</h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Necessary Cookies</h3>
            <p>
              These cookies are essential for the website to function properly. Without these cookies, the website would not work as intended. 
              Examples include session cookies for admin login authentication.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Functionality Cookies</h3>
            <p>
              These cookies allow our website to remember choices you make (such as your user name, language or the region you are in) and provide enhanced, more personal features. 
              We use `localStorage` to save your theme preference (Dark/Light mode).
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">4. Controlling Cookies</h2>
          <p>
            You can restrict, block or delete cookies by changing your browser settings but that may mean that the website won't work properly. 
            For more information on how to manage and delete cookies, visit <a href="https://www.aboutcookies.org/" target="_blank" rel="noreferrer" className="text-neon-purple hover:underline">aboutcookies.org</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us at: <br/>
            <a href="mailto:brandiqueagency@gmail.com" className="text-neon-purple hover:underline font-bold">brandiqueagency@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicy;