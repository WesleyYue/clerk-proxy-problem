import { Env } from './lib/utils/env';

const secrets = {
	VITE_CLERK_PROXY_URL: 'https://double-bot.clerk.dev', // [REPLACE]
	CLERK_PROD_BACKEND_KEY: 'xxx', // [REPLACE]
	ENV: 'production',
};

const DOMAIN = 'https://double.bot'; // [REPLACE]

export default {
	async fetch(req: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
		const url = req.url.replace(secrets.VITE_CLERK_PROXY_URL, 'https://frontend-api.clerk.dev');
		const proxyReq = new Request(req, {
			redirect: 'manual',
		});

		proxyReq.headers.set('Clerk-Proxy-Url', secrets.VITE_CLERK_PROXY_URL);
		proxyReq.headers.set('Clerk-Secret-Key', secrets.CLERK_PROD_BACKEND_KEY);
		proxyReq.headers.set('X-Forwarded-For', req.headers.get('CF-Connecting-IP') || '');

		const reqOrigin = getHeaderAsUrl({ resreq: req, header: 'origin' });
		if (reqOrigin !== null && (reqOrigin.protocol === 'vscode-webview:' || reqOrigin.hostname === 'localhost')) {
			proxyReq.headers.set('Origin', DOMAIN);
		}

		const res = await fetch(url, proxyReq);
		const newRes = new Response(res.body, res);

		const resOrigin = getHeaderAsUrl({ resreq: res, header: 'access-control-allow-origin' });
		const reqOriginRaw = req.headers.get('Origin'); // Can't use reqOrigin here because the URL constructor will add a trailing slash, which will not be EXACTLY the same as the request Origin header

		if (resOrigin !== null && reqOriginRaw !== null) {
			newRes.headers.set('Access-Control-Allow-Origin', reqOriginRaw);
		}

		return newRes;
	},
};

function getHeaderAsUrl({
	resreq,
	header,
}:
	| {
			resreq: Response;
			header: 'access-control-allow-origin';
	  }
	| {
			resreq: Request;
			header: 'origin';
	  }): URL | null {
	const origin = resreq.headers.get(header);
	console.log('origin: ', origin, 'header: ', header);
	if (origin !== null) {
		try {
			return new URL(origin);
		} catch {
			// Handles cases like origin = '*'
			return null;
		}
	}
	return null;
}
