export function injectCookieDeclarationScript(target = document.head) {
	if (typeof document === 'undefined') return;
	if (document.getElementById('CookieDeclaration')) return;

	const script = document.createElement('script');
	script.id = 'CookieDeclaration';
	script.src = 'https://consent.cookiebot.com/c4162480-9dd0-4d9a-9d64-3527d2289375/cd.js';
	script.type = 'text/javascript';
	script.async = true;

	target.appendChild(script);
}

export const cookieDeclarationSrc =
	'https://consent.cookiebot.com/c4162480-9dd0-4d9a-9d64-3527d2289375/cd.js';
