//Initialize Bot and login
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
bot.login(TOKEN);

bot.on('ready', () => {
  	console.info(`Logged in as ${bot.user.tag}!`);
});


//Wait for message triggers
bot.on('message', msg => {
  	if (msg.content === '!quote') {
		quote = generateRandomQuote();
    		msg.reply(quote);
  	} 
	else if (msg.content === '!help') {
		msg.channel.send(usage());
	}	
});


//Functions
function usage()
{
	return "!quote\t:\tfind a random quote \n\n!quote<user>\t:\tfind a random quote from a specific user\n\n!quote<user><search>\t:\tsearch for a specific quote"; 
};

function generateRandomQuote()		//return a random quote from the db
{
	var quote = 'Thorn has a nice bum';	
	return quote;
};

function quoteUser(user)		//return a random quote from a specific user
{

};

function findQuote(user, partialMsg)	//searches through db for a specific quote by a user
{
	
};

function topQuote()			//returns the highest ranking quote
{

};


