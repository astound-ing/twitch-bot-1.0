require('dotenv').config();

const { is } = require('express/lib/request');
const tmi = require('tmi.js');

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
	website: {
		responce: 'somewebsite.lol'
	},
	like: {
		responce: (user) => `${user} liked this`
	},
	pyramid: {
		responce: (user) => `FallWinning `,
		responce: (user) => `FallWinning FallWinning `,
		responce: (user) => `FallWinning FallWinning FallWinning `,
		responce: (user) => `FallWinning FallWinning FallWinning FallWinning `,
		responce: (user) => `FallWinning FallWinning FallWinning `,
		responce: (user) => `FallWinning FallWinning `,
		responce: (user) => `FallWinning `,
	}
}

const client = new tmi.Client({
	connection: {
		reconnect: true
	},
	channels: [ 'astound_ing' ],
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	}
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	const isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME;

	if (!isNotBot) return;

	const [raw, command, argument] = message.match(regexpCommand);

	const { responce } = commands[command] || {};
	if (typeof responce === 'function') {
		client.say(channel, responce(tags.username));
	} else if (typeof responce === 'string') {
		client.say(channel, responce);
	}
	// "Alca: Hello, World!"
	console.log(`${tags['display-name']}: ${message}`);
});
		