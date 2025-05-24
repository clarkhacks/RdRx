import { renderPublicNavbar } from '../partials/publicNavbar';

export function renderPrivacyPolicyPage(): Response {
	const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy | RdRx</title>
    <meta name="description" content="Privacy Policy for RdRx">
    <meta property="og:title" content="Privacy Policy | RdRx">
    <meta property="og:description" content="Privacy Policy for RdRx">
    <meta property="og:image" content="https://cdn.rdrx.co/banner.jpg">
    <meta property="og:url" content="https://rdrx.co/privacy">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="RdRx">
    <link rel="apple-touch-icon" sizes="57x57" href="https://cdn.rdrx.co/favicons/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="https://cdn.rdrx.co/favicons/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="https://cdn.rdrx.co/favicons/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="https://cdn.rdrx.co/favicons/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="https://cdn.rdrx.co/favicons/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="https://cdn.rdrx.co/favicons/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="https://cdn.rdrx.co/favicons/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="https://cdn.rdrx.co/favicons/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192"  href="https://cdn.rdrx.co/favicons/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="https://cdn.rdrx.co/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="https://cdn.rdrx.co/favicons/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="https://cdn.rdrx.co/favicons/favicon-16x16.png">
    <<link rel="stylesheet" href="/assets/built.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background-color: #FFFFFF;
            color: #37352F;
        }
    </style>
</head>
<body class="bg-white min-h-screen flex flex-col">
    <!-- Navigation -->
    ${renderPublicNavbar()}

    <!-- Main Content -->
    <main class="flex-grow p-4 md:p-8">
      <div class="container mx-auto px-4 py-8 max-w-4xl mt-8">
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
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-600">
        <div class="max-w-7xl mx-auto">
            <div class="flex flex-col md:flex-row justify-center items-center gap-4">
                <div>© ${new Date().getFullYear()} RdRx. All rights reserved.</div>
                <div class="flex gap-4">
                    <a href="/terms" class="hover:text-primary-500 transition-colors duration-200">Terms of Service</a>
                    <a href="/privacy" class="font-medium text-primary-500 hover:text-primary-600 transition-colors duration-200">Privacy Policy</a>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>
	`;

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' },
	});
}
