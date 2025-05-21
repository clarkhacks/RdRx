export const renderVerify = () => {
	return new Response(
		`<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="robots" content="noindex, nofollow">
		<title>Verify Owner</title>
		<script src="https://cdn.tailwindcss.com"></script>
	</head>
	<body class="bg-gray-100 min-h-screen flex items-center justify-center">
		<div class="bg-white shadow-lg rounded-lg p-6 md:p-8 w-full max-w-md flex flex-col items-center justify-center">
			<h1 class="font-bold text-center">Domain Owner: Clark Weckmann</h1>
			<h2 class="font-bold text-center">Contact: <a href="https://www.clark.today" class="">https://www.clark.today</a></h2>
			<p class="">This is not an official RDRX tool, but a personal project by Clark Weckmann. If you have any questions or concerns, please reach out to me directly.</p>
			<p class="">I built this tool to make my life easier, and I hope it helps you too. If you have any feedback or suggestions, I'd love to hear them.</p>
		</div>
	</body>
	</html>`,
		{
			headers: { 'Content-Type': 'text/html' },
		}
	);
};
