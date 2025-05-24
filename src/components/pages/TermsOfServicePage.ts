import { renderPublicNavbar } from '../partials/publicNavbar';

export function renderTermsOfServicePage(): Response {
	const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service | RdRx</title>
    <meta name="description" content="Terms of Service for RdRx">
    <meta property="og:title" content="Terms of Service | RdRx">
    <meta property="og:description" content="Terms of Service for RdRx">
    <meta property="og:image" content="https://cdn.rdrx.co/banner.jpg">
    <meta property="og:url" content="https://rdrx.co/terms">
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
    <link rel="stylesheet" href="/assets/built.css" />
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
        <h1 class="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div class="prose prose-lg">
          <h2 class="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our service, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">2. Description of Service</h2>
          <p>
            Our service provides users with the ability to upload, share, and manage various types of content including but not limited to images, text snippets, and other files.
          </p>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account.
          </p>
          <p>
            We reserve the right to terminate or suspend your account at any time, for any reason, without notice or liability to you. This includes, but is not limited to, violations of these Terms of Service or inactivity.
          </p>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">4. Service Availability</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue the service (or any part thereof) at any time, for any reason, without prior notice or liability to you. We may shut down the service entirely at our discretion without any obligation to provide compensation or alternative services.
          </p>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">5. User Content</h2>
          <p>
            You retain all ownership rights to the content you upload to our service. However, by uploading content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, adapt, publish, and distribute such content for the purpose of providing and promoting our service.
          </p>
          <p>
            You are solely responsible for the content you upload and share through our service. You agree not to upload, share, or otherwise transmit any content that:
          </p>
          <ul class="list-disc pl-6 my-3">
            <li>Is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
            <li>Infringes on any patent, trademark, trade secret, copyright, or other proprietary rights</li>
            <li>Contains software viruses or any other computer code designed to interrupt, destroy, or limit the functionality of any computer software or hardware</li>
            <li>Constitutes Child Sexual Abuse Material (CSAM) or any content that exploits or harms minors</li>
          </ul>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">6. Child Sexual Abuse Material (CSAM) Policy</h2>
          <p>
            We have zero tolerance for Child Sexual Abuse Material (CSAM) or any content that exploits or harms minors. If we detect or are notified of any CSAM on our service:
          </p>
          <ul class="list-disc pl-6 my-3">
            <li>We will immediately remove the content and terminate the associated account</li>
            <li>We will report the content and all related information to the National Center for Missing & Exploited Children (NCMEC) and/or appropriate law enforcement agencies</li>
            <li>We will preserve and share all data related to the upload, including but not limited to IP addresses, account information, and any other relevant data with the authorities</li>
            <li>We will cooperate fully with law enforcement investigations</li>
          </ul>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
          </p>
          <ul class="list-disc pl-6 my-3">
            <li>Your use or inability to use the service</li>
            <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
            <li>Any interruption or cessation of transmission to or from the service</li>
            <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the service</li>
          </ul>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">8. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms of Service at any time at our sole discretion. It is your responsibility to check these Terms periodically for changes. Your continued use of the service following the posting of any changes constitutes acceptance of those changes.
          </p>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">9. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.
          </p>
          
          <h2 class="text-xl font-semibold mt-6 mb-3">10. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us.
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
                    <a href="/terms" class="font-medium text-primary-500 hover:text-primary-600 transition-colors duration-200">Terms of Service</a>
                    <a href="/privacy" class="hover:text-primary-500 transition-colors duration-200">Privacy Policy</a>
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
