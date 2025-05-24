import { renderPageLayout } from '../layouts/PageLayout';

export function renderPrivacyPolicyPage(): Response {
	return new Response(
		renderPageLayout({
			title: 'Privacy Policy',
			activeNavItem: '',
			content: `
      <div class="container mx-auto px-4 py-8 max-w-4xl">
        <h1 class="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div class="prose prose-lg">
          <p class="lead">
            This Privacy Policy describes how we collect, use, and handle your information when you use our services.
          </p>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
          <p>
            We collect information in the following ways:
          </p>
          <ul class="list-disc pl-6 my-3">
            <li><strong>Information you provide to us:</strong> This includes account information such as your name, email address, and any other information you provide during registration or when using our services.</li>
            <li><strong>Content you upload:</strong> This includes any files, images, text snippets, or other content you upload to our service.</li>
            <li><strong>Usage information:</strong> We collect information about how you use our service, such as the features you use, the actions you take, and the time, frequency, and duration of your activities.</li>
            <li><strong>Device information:</strong> We collect information about the device you use to access our service, including IP address, browser type, and operating system.</li>
          </ul>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul class="list-disc pl-6 my-3">
            <li>Provide, maintain, and improve our services</li>
            <li>Develop new features and functionality</li>
            <li>Understand how users interact with our services</li>
            <li>Detect, prevent, and address technical issues</li>
            <li>Protect against harmful or illegal activity</li>
          </ul>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">3. Information Sharing and Disclosure</h2>
          <p>
            We do not share your personal information with companies, organizations, or individuals outside of our organization except in the following cases:
          </p>
          <ul class="list-disc pl-6 my-3">
            <li><strong>With your consent:</strong> We will share personal information outside of our organization when we have your consent to do so.</li>
            <li><strong>For legal reasons:</strong> We will share personal information if we have a good-faith belief that access, use, preservation, or disclosure of the information is reasonably necessary to:
              <ul class="list-disc pl-6 my-3">
                <li>Comply with applicable law, regulation, legal process, or enforceable governmental request</li>
                <li>Detect, prevent, or otherwise address fraud, security, or technical issues</li>
                <li>Protect against harm to the rights, property, or safety of our users, our organization, or the public as required or permitted by law</li>
              </ul>
            </li>
            <li><strong>In case of Child Sexual Abuse Material (CSAM):</strong> If we detect or are notified of any CSAM on our service, we will report the content and all related information to the National Center for Missing & Exploited Children (NCMEC) and/or appropriate law enforcement agencies, and will share all data related to the upload, including but not limited to IP addresses, account information, and any other relevant data with the authorities.</li>
          </ul>
          
          <p>
            <strong>Important:</strong> We do not sell your personal information to advertisers or other third parties. We do not run ads on our service or share your information with advertising companies.
          </p>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">4. Public Content</h2>
          <p>
            Please note that any content you upload for sharing (such as images or text snippets) may be accessible to anyone with the link. When you upload content for sharing, it will be assigned a public URL that can be accessed by anyone who has that URL. This is an inherent part of the service's functionality.
          </p>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">5. Data Security</h2>
          <p>
            We work hard to protect your information from unauthorized access, alteration, disclosure, or destruction. We implement appropriate security measures to protect your data, including:
          </p>
          <ul class="list-disc pl-6 my-3">
            <li>Using encryption to keep your data private while in transit</li>
            <li>Reviewing our information collection, storage, and processing practices</li>
            <li>Restricting access to personal information to our employees, contractors, and agents who need that information to process it for us</li>
          </ul>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">6. Data Retention</h2>
          <p>
            We retain the information we collect for as long as necessary to provide the services you have requested, or for other essential purposes such as complying with our legal obligations, resolving disputes, and enforcing our policies.
          </p>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">7. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, such as:
          </p>
          <ul class="list-disc pl-6 my-3">
            <li>The right to access your personal information</li>
            <li>The right to correct inaccurate or incomplete information</li>
            <li>The right to delete your personal information</li>
            <li>The right to restrict or object to our processing of your personal information</li>
            <li>The right to data portability</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided in the "Contact Us" section.
          </p>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">8. Children's Privacy</h2>
          <p>
            Our service is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information as soon as possible.
          </p>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us.
          </p>
          
          <p class="mt-8 text-sm text-gray-600">Last updated: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `,
		}),
		{
			headers: { 'Content-Type': 'text/html' },
		}
	);
}
