const Slack = require('slack');

const token = process.env.EMOJINATOR_SLACKBOT_TOKEN;
const bot = new Slack({ token });

bot.emoji.list().then(res => console.log(JSON.stringify(res)));
