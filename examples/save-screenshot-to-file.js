const takeScreenshot = require('../index.js');

(async () => {

	// quick save screenshot to file with default options
	await takeScreenshot('https://bloomberg.com', 'ex1.png')

	// with options
	await takeScreenshot('https://theverge.com', {
		screenshot:		{
			path:	'ex2.png'
		},
		viewport:		{
			width:	800,
			height:	600
		}
	})

	await takeScreenshot.closeBrowser();
})();
