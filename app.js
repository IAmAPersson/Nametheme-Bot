const Discord = require("discord.js");
const randomNormal = require("random-normal");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./config.json");
let stonks = JSON.parse(fs.readFileSync("./stonks.json"));
let stonkprice = 0;
let stonkmult = { "mult": 0 };
let purchasequeue = { };

do
{
	stonkmult.mult = randomNormal({ "mean": 2.5, "dev": 1 });
} while (stonkmult.mult <= 0);

setInterval(() => {
	do
	{
		stonkmult.mult = randomNormal({ "mean": 2.5, "dev": 1 });
	} while (stonkmult.mult <= 0);
}, 14400000);

client.on("ready", () =>
{
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setGame("trading timcoins");
});

client.on("guildCreate", guild =>
{
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild =>
{
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on("message", async message =>
{
	console.log(message.author + ": " + message.content);
	//if (message.author.bot) return;

	if (message.content === "<@!359138435203596291>" || message.content === "<@359138435203596291>")
		message.channel.send("What's up " + message.author);

	if (message.content.substring(0, 10) === "!nametheme")
	{
		const command = message.content.split(" ");
		if (command[1] == "set")
		{
			fs.writeFileSync("nametheme.txt", command.splice(2).join(" "));
			let sendmessage = "Name theme set to: " + fs.readFileSync("nametheme.txt");
			message.channel.send(sendmessage);

			setTimeout(() =>
			{
				client.channels.get("525945106193448970").send(sendmessage);
			}, 5000);
		}
		else
			message.channel.send("Current theme: " + fs.readFileSync("nametheme.txt"));
	}
	else if (message.content.substring(0, 5) === "!ping")
		message.channel.send("Pong!");
	else if (message.content.substring(0, 28) == "!informLanceThatHisBotIsDown")
		message.channel.send("Lance...");
	else if (message.content.substring(0, 4) == "!say" && message.author.id == "302215274252337152")
		message.channel.send(message.content.substring(5));
	else if (message.content.substring(0, 7) == "!stonks")
	{
		const command = message.content.split(" ");
		if (command[1] == "help")
			message.channel.send("```Help with stonks:\n\n!stonks help - Displays this menu\n!stonks value - Shows the current market stats\n!stonks count - Shows how many stonks you currently own\n!stonks buyprice [count] - Displays current price of buying [count] stonks\n!stonks sellprice [count] - Displays the current price of selling [count] stonks\n!stonks sell [count] - Sells [count] of your stonks\n!stonks value - Gets the current value of your stonks in timcoin (the amount you would receive if you sold all of your stonks)\n\nTo buy stonks, run \"!stonks update\" to update the stock price, \"!stonks price [count]\" to see how much it will cost, then run \"\\pay nogmBOT [cost]\" to pay the bot. The boy will auto-detect who paid it and allocate the correct amount of stonks to that user.```");
		else if (command[1] == "buyprice")
		{
			client.channels.get("498927226838974476").send("\\timcoins").then(() =>
			{
				client.channels.get("498927226838974476").awaitMessages(response1 => response1.author.id === "647054485465595914", { "max": 1 }).then(collected =>
				{
					stonkprice = verifyFloat(/nogmBOT has `([0-9]+\.[0-9]+)` TIMCOINS/.exec(collected.first().content)[1]);
					let total = 0;
					let stonk = stonkprice;
					for (let i = 0; i < verifyInt(command[2]); i++)
					{
						total += stonk * (stonkmult.mult / 100);
						stonk += stonk * (stonkmult.mult / 100);
					}
					message.channel.send("To buy " + command[2] + " stonks will cost `" + (total + (total * 0.01)) + "` timcoins.");
				});
			});
		}
		else if (command[1] == "sellprice")
		{
			client.channels.get("498927226838974476").send("\\timcoins").then(() =>
			{
				client.channels.get("498927226838974476").awaitMessages(response1 => response1.author.id === "647054485465595914", { "max": 1 }).then(collected =>
				{
					stonkprice = verifyFloat(/nogmBOT has `([0-9]+\.[0-9]+)` TIMCOINS/.exec(collected.first().content)[1]);
					let total = 0;
					let stonk = stonkprice;
					for (let i = 0; i < verifyInt(command[2]); i++)
					{
						stonk -= stonk * (stonkmult.mult / 100);
						total += stonk * (stonkmult.mult / 100);
					}
					message.channel.send("Selling " + command[2] + " stonks will earn you `" + total + "` timcoins.");
				});
			});
		}
		else if (command[1] == "sell")
		{
			if (parseInt(command[2]) < 0)
			{
				message.channel.send("No.");
			}
			else if (stonks.hasOwnProperty(message.author.id) && stonks[message.author.id] >= parseInt(command[2]))
			{
				client.channels.get("498927226838974476").send("\\timcoins").then(() =>
				{
					client.channels.get("498927226838974476").awaitMessages(response1 => response1.author.id === "647054485465595914", { "max": 1 }).then(collected =>
					{
						stonkprice = verifyFloat(/nogmBOT has `([0-9]+\.[0-9]+)` TIMCOINS/.exec(collected.first().content)[1]);
						let total = 0;
						let stonk = stonkprice;
						for (let i = 0; i < verifyInt(command[2]); i++)
						{
							stonk -= stonk * (stonkmult.mult / 100);
							total += stonk * (stonkmult.mult / 100);
						}
						client.channels.get("498927226838974476").send("\\pay " + message.author.id + " " + total);
						
						stonks[message.author.id] -= parseInt(command[2]);
						fs.writeFileSync("./stonks.json", JSON.stringify(stonks));
					});
				});
			}
			else
				message.channel.send("You do not have this many stonks available to sell!");
		}
		else if (command[1] == "count")
		{
			if (!stonks.hasOwnProperty(message.author.id))
				message.channel.send("<@" + message.author.id + ">, you current do not own any stonks.");
			else
				message.channel.send("<@" + message.author.id + ">, you currently own " + stonks[message.author.id] + " stonks.");
		}
		else if (command[1] == "value")
		{
			if (!stonks.hasOwnProperty(message.author.id))
				message.channel.send("You do not own any stonks!");
			else
				client.channels.get("498927226838974476").send("\\timcoins").then(() =>
				{
					client.channels.get("498927226838974476").awaitMessages(response1 => response1.author.id === "647054485465595914", { "max": 1 }).then(collected =>
					{
						stonkprice = verifyFloat(/nogmBOT has `([0-9]+\.[0-9]+)` TIMCOINS/.exec(collected.first().content)[1]);
						let total = 0;
						let stonk = stonkprice;
						for (let i = 0; i < stonks[message.author.id]; i++)
						{
							stonk -= stonk * (stonkmult.mult / 100);
							total += stonk * (stonkmult.mult / 100);
						}
						message.channel.send("You currently own " + total + " timcoins in stonks.");
					});
				});
		}
		else if (command[1] == "stats")
		{
			if (stonkmult.mult > 10)
				message.channel.send("SELL FUCKING EVERYTHING.");
			else if (stonkmult.mult > 5)
				message.channel.send("Stonk price is very high. You should sell!");
			else if (stonkmult.mult > 4)
				message.channel.send("Stonk price is high. Consider selling.");
			else if (stonkmult.mult > 3)
				message.channel.send("Stonk price is slightly above average. I'd recommend holding.");
			else if (stonkmult.mult > 2)
				message.channel.send("Stonk price is slightly below average. I'd recommend holding.");
			else if (stonkmult.mult > 1)
				message.channel.send("Stonk price is low. Consider buying.");
			else
				message.channel.send("Stonk price is very low. You should buy!");
		}
		else if (command[1] == "buy")
		{
			client.channels.get("498927226838974476").send("\\timcoins").then(() =>
			{
				client.channels.get("498927226838974476").awaitMessages(response1 => response1.author.id === "647054485465595914", { "max": 1 }).then(collected =>
				{
					stonkprice = verifyFloat(/nogmBOT has `([0-9]+\.[0-9]+)` TIMCOINS/.exec(collected.first().content)[1]);
					let total = 0;
					let stonk = stonkprice;
					for (let i = 0; i < verifyInt(command[2]); i++)
					{
						total += stonk * (stonkmult.mult / 100);
						stonk += stonk * (stonkmult.mult / 100);
					}
					let code = Math.floor(Math.random() * 1000000000000)
					message.channel.send("To buy " + command[2] + " stonks will cost `" + total + "` timcoins. Please accept the following charges.");
					message.channel.send("\\charge " + message.author.id + " " + total + " " + code);
					purchasequeue[code] = { "stonks": verifyInt(command[2]), "id": message.author.id };
				});
			});
		}
	}
	else if (/\<\@\!?359138435203596291\> ([0-9]+) has been accepted/.exec(message.content) != null)
	{
		let code = /\<\@\!?359138435203596291\> ([0-9]+) has been accepted/.exec(message.content)[1];
		stonks[purchasequeue[code].id] += purchasequeue[code].stonks;
		fs.writeFileSync("./stonks.json", JSON.stringify(stonks));
		message.channel.send("<@!" + purchasequeue[code].id + ">, you have been allotted `" + purchasequeue[code].stonks + "` stonks!");
	}
});

client.login(config.token);

function verifyInt(num)
{
	let newnum = parseInt(num);
	if (newnum != NaN && newnum > 0)
		return newnum;
	else
		return 1;
}

function verifyFloat(num)
{
	let newnum = parseFloat(num);
	if (newnum != NaN && newnum > 0)
		return newnum;
	else
		throw num;
}