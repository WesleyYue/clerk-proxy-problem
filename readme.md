- ctrl-f for `[REPLACE]` for all the vars that should be replaced with your environment.
- install deps with `pnpm i`
- deploy with `pnpm run deploy` (Must be deployed since Clerk JS will always attempt to reach the proxyUrl via https. You cannot test this locally with `wrangler dev`)
- `pnpm exec wrangler tail` to see streamed logs from the deployed CF Worker.

`clerk.browser.js`, `client`, `environment` fetches work:

```bash
curl 'https://double.bot/__clerk/v1/client?_clerk_js_version=4.67.0' \
  -H 'authority: double.bot' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'dnt: 1' \
  -H 'origin: http://localhost:5174' \
  -H 'referer: http://localhost:5174/' \
  -H 'sec-ch-ua: "Not_A Brand";v="8", "Chromium";v="120"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' \
  --compressed
```

`/sign_ups` does not work:

```bash
curl 'https://double.bot/__clerk/v1/client/sign_ups?_clerk_js_version=4.67.0' \
  -H 'authority: double.bot' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -H 'dnt: 1' \
  -H 'origin: http://localhost:5174' \
  -H 'referer: http://localhost:5174/' \
  -H 'sec-ch-ua: "Not_A Brand";v="8", "Chromium";v="120"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' \
  --data-raw 'strategy=oauth_google&redirect_url=http%3A%2F%2Flocalhost%3A5174%2Fsign-up%2Fsso-callback%3Fredirect_url%3Dhttp%253A%252F%252Flocalhost%253A5174%252Fredirect-to-vscode&action_complete_redirect_url=%2Fredirect-to-vscode' \
  --compressed
```
