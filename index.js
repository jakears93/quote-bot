//Initialize Bot and login
require('dotenv').config();
const Discord = require('discord.js');
const mysql = require('mysql');

const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const MYSQLHOST = process.env.MYSQLHOST;
const MYSQLUSER = process.env.MYSQLUSER;
const MYSQLPASS = process.env.MYSQLPASS;
const MYSQLDATABASE = process.env.MYSQLDATABASE;

bot.login(TOKEN);

var con = mysql.createConnection({
     host: MYSQLHOST,
     user: MYSQLUSER,
     password: MYSQLPASS,
     database: MYSQLDATABASE
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to Database!");
});

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
     else if (msg.content === '!add') {
          if (checkUser(msg))
          {
               addQuote(msg);
          }
     }
});


//Functions
function checkUser(msg)
{
     var user = msg.member.user.id;
     var sql = "SELECT * FROM user WHERE user_id = "+msg.member.user.id+" limit 1;";

     con.query(sql, function (err, result) {
          if (err)
          {
               console.log("Error in DB Checking User");
               return false;
          }
          else
          {
               if(result.length)
               {
                    console.log(msg.member.user.tag+" already in db");
                    sql = "UPDATE user SET no_of_quotes = no_of_quotes + 1 WHERE user_id LIKE '"+msg.member.user.id+"' ";
                    con.query(sql, function (error, row){
                         if (error)
                         {
                              console.log("Error adding quote to user");
                              return false;
                         }

                    })
                    return true;
               }
               else
               {
                    if(addUser(msg))
                    {
                       return true;
                    }
               }
          }
          return false;
     });
}

function addUser(msg)
{
     var id = msg.member.user.id;
     var user = msg.member.user.username;
     var sql = "INSERT INTO user (user_id, name) VALUES ('"+id+"','"+user+"')";
     con.query(sql, function (err, result) {
          if (err)
          {
               console.log("Error in DB Adding User");
               return false;
          }
          else
          {
               console.log(msg.member.user.tag+" Added to DB!")
               return true;
          }
     });
}

function addQuote(msg, msgInfo)
{

}

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
