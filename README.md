# 📸 take-screenshots

**take-screenshots** is a small JS library than can take clean website screenshots, without any popups or cookie consent dialogs that may appear when browsing.

It uses [Puppeteer](https://github.com/GoogleChrome/puppeteer) with a set of optimal settings for loading pages & cleaning any unwanted sections (any contributions for this are welcome).

## Use cases
* Display Info Cards of link hover/tap
* Rich preview for links in messaging apps or blog articles
* Automatic site tracking with screenshots

## Getting Started

#### Installation

To use Puppeteer in your project, run:

```npm i puppeteer take-screenshots```

> Note: `take-screenshots` requires Puppeteer to be installed in your project. It is a peer dependency so that the correct version or build is used in your app.

#### Usage
The library has a simple API.

**Example** - Take a screenshot of twitter.com and save it as `twitter.png`:
```js
const takeScreenshot = require('take-screenshots');

(async () => {
	await takeScreenshot('https://twitter.com', {screenshot: {path: 'twitter.png'}});

	await takeScreenshot.closeBrowser();
})();
```

Main function returns the image [buffer](https://nodejs.org/api/buffer.html), which you can manipulate or send forwards as a HTTP Response
**Example** - Take a screenshot of nyt.com and process the image:
```js
const takeScreenshot = require('take-screenshots');

(async () => {
	let img = await takeScreenshot('https://twitter.com', {viewport: {width: 800, height: 600}});

	// process the image, img is the image buffer
	// sharp(img)

	// if using Express, image can be sent as response
	// res.send(img)

	await takeScreenshot.closeBrowser();
})();
```

## More

Please report any issues here on GitHub.
[Any contributions are welcome](CONTRIBUTING.md)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) Andrei Igna
