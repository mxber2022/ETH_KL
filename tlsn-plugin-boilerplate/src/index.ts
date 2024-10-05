import icon from '../assets/icon.png';
import config_json from '../config.json';
import { redirect, notarize, outputJSON, getCookiesByHost, getHeadersByHost } from './utils/hf.js';

/**
 * Plugin configuration
 * This configurations defines the plugin, most importantly:
 *  * the different steps
 *  * the user data (headers, cookies) it will access
 *  * the web requests it will query (or notarize)
 */
export function config() {
  outputJSON({
    ...config_json,
    icon: icon
  });
}

function isValidHost(urlString: string) {
  const url = new URL(urlString);
  return url.hostname === 'devfolio.co' || url.hostname === 'devfolio.co';
}

/**
 * Implementation of the first (start) plugin step
  */
export function start() {
  if (!isValidHost(Config.get('tabUrl'))) {
    redirect('https://devfolio.co');
    outputJSON(false);
    return;
  }
  outputJSON(true);
}

/**
 * Implementation of step "two".
 * This step collects and validates authentication cookies and headers for 'api.x.com'.
 * If all required information, it creates the request object.
 * Note that the url needs to be specified in the `config` too, otherwise the request will be refused.
 */
export function two() {
  const cookies = getCookiesByHost('devfolio.co');
  const headers = getHeadersByHost('devfolio.co');
  console.log("cookies is ", cookies);
  // if (
  //   // !cookies.auth_token ||
  //   // !cookies.ct0 ||
  //   // !headers['x-csrf-token'] ||
  //   // !headers['authorization']
  // ) {
  //   outputJSON(false);
  //   console.log("false ");
  //   return;
  // }

  console.log(cookies.devfolio_auth);
  console.log();
  console.log(cookies.devfolio_user);

  outputJSON({
    url: 'https://api.devfolio.co/api/users/9bda9b43884647008ce0a577ae1a5681/basic_info',
    method: 'GET',
    headers: {
      Host: 'api.devfolio.co',
      Cookie: `devfolio_auth=${cookies.devfolio_auth}; devfolio_user=${cookies.devfolio_user};`
    },
    secretHeaders: [
      `cookie: devfolio_auth=${cookies.devfolio_auth}; devfolio_user=${cookies.devfolio_user};`,
    ],
  });
}

/**
 * This method is used to parse the Twitter response and specify what information is revealed (i.e. **not** redacted)
 * This method is optional in the notarization request. When it is not specified nothing is redacted.
 *
 * In this example it locates the `screen_name` and excludes that range from the revealed response.
 */
export function parseTwitterResp() {
  const bodyString = Host.inputString();
  const params = JSON.parse(bodyString);
  console.log("check 1: ", params.username);
  if (params.username) {
    const revealed = `"username":"${params.username}"`;
    console.log("revealed: ", revealed);
    const selectionStart = bodyString.indexOf(revealed);
    const selectionEnd =
      selectionStart + revealed.length;
    const secretResps = [
      bodyString.substring(0, selectionStart),
      bodyString.substring(selectionEnd, bodyString.length),
    ];
    console.log("secretResps: ", secretResps);
    outputJSON(secretResps);
  } else {
    outputJSON(false);
  }
}

/**
 * Step 3: calls the `notarize` host function
 */
export function three() {
  const params = JSON.parse(Host.inputString());
  console.log("parama:",JSON.stringify(params));

  if (!params) {
    outputJSON(false);
  } else {
    const id = notarize({
      ...params,
      getSecretResponse: 'parseTwitterResp',
    });
    outputJSON(id);
  }
}
