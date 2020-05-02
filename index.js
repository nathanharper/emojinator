const { existsSync } = require('fs');
const Slack = require('slack');
const download = require('download-file');
const { forEach, last, split, startsWith } = require('lodash');

const directory = './emoji';
const token = process.env.EMOJINATOR_SLACKBOT_TOKEN;
const bot = new Slack({ token });

bot.emoji.list().then(({ emoji }) => {
	forEach(emoji, (url, key) => {
		try {
			downloadEmojum(url, key);
		} catch (err) {
			console.error(err.message, { url, key });
		}
	})
});

function downloadEmojum(url, key) {
	if (startsWith(url, 'alias:')) {
		console.log(`Skipping alias: ${key}`);
		return;
	}

	const ext = last(split(url, '.')).toLowerCase();

	if (ext === 'gif') {
		console.log(`Skipping GIF :${key}:`);
		return; // free Discord disables animated emoji
	}

	const filename = `${key}.${ext}`;

	if (existsSync(`${directory}/${filename}`)) {
		console.log(`File exists, skipping: ${filename}`);
		return;
	}

	download(url, { directory, filename }, err => {
		if (err) {
			console.error(err.message);
			return;
		}

		console.log(`Downloaded ${filename}`);
	});
}
