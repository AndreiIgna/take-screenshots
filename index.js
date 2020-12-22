const _ = require('lodash')

let browser

const getBrowserPage = async () => {

	if (!browser) {
		const puppeteer = require('puppeteer')
		browser = await puppeteer.launch({args: ['--no-sandbox']})
	}

	return browser.newPage()
}

let takeScreenshots = async function(url, options) {
	if (typeof options === 'string') {
		options = {
			screenshot:	{ path: options }
		};
	}

	options = _.defaults(options, {
		userAgent:		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
		animationSpeed:	20,
		pageDelay:		250,
		headers:		{
			'Accept-Language':	'en;q=0.9'
		},
		viewport:		{
			width:			1280,
			height:			800,
			isMobile:		false,
			isLandscape:	false
		},
		screenshot:		{
			type:			'png',
			fullPage:		false
		}
	});

	const page = await getBrowserPage();

	// set User Agent & headers - bypass Captchas or security popups on some websites
	await page.setUserAgent(options.userAgent)
	await page.setExtraHTTPHeaders(options.headers)

	// set viewport options, see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagesetviewportviewport
	await page.setViewport(options.viewport)

	await page.goto(url, { waitUntil: 'networkidle2' })

	if (options.animationSpeed) {
		await page._client.send('Animation.setPlaybackRate', { playbackRate: Number.isInteger(options.animationSpeed) ? options.animationSpeed : 20 })
	}

	// TODO add functionality to extend or hook new cleaner

	// clean - cookie consent dialogs
	let dialogClasses = ['[role="dialog"]', '[id*="sp_message_container"]'];
	['class', 'id'].forEach(attr => {
		['consent', 'gdpr', 'cookie', 'banner', 'privacy', 'ads'].forEach(keyword => dialogClasses.push('[' + attr + '*="' + keyword + '"]'))
	});
	await page.$$eval(dialogClasses.join(','), elements => {
		elements.forEach(el => {
			const elContent = el.innerText.toLowerCase().trim()
			if (!elContent.length || elContent.includes('cookie') || elContent.includes('consent') || elContent.includes('newsletter') || elContent.includes('subscribe')) {
				let maybeOverlay = [
					el.previousSibling,
					el.nextSibling,
					el.parentElement,
					el.parentElement.previousSibling,
					el.parentElement.nextSibling
				];
				el.remove();
				maybeOverlay.forEach(elOverlay => {
					if (elOverlay && elOverlay.className && elOverlay.className.includes('overlay')) {
						elOverlay.remove();
					}
				});
			}
		});
	});

	// clean - notifications and dialogs
	await page.$$eval('[class*="toast"], [class*="alert"], [role="dialog"], [class*="dialog"]', elements => {
		elements.forEach(el => el.remove())
	});

	// clean - Quantcast cookie consent dialog
	try {
		await page.$eval('.qc-cmp-button', element => {
			if (element && '__cmpui' in window) {
				window.__cmpui('setAndSaveAllConsent', true);
			}
		});
	} catch (err) {}

	// delay for good measure. Animation playback rate is multiplied also
	await page.waitFor(options.pageDelay)

	// set screenshot options, see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions
	const imageBuffer = await page.screenshot(options.screenshot)
	await page.close()

	return imageBuffer
}

takeScreenshots.setBrowser = function(newBrowser) {
	return browser = newBrowser
}

takeScreenshots.closeBrowser = async function() {
	await browser.close()
	browser = null
}

module.exports = takeScreenshots
