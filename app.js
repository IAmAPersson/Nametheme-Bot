const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./config.json");
let stonks = JSON.parse(fs.readFileSync("./stonks.json"));
let stonkprice = 0;

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
			message.channel.send("```Help with stonks:\n\n!stonks help - Displays this menu\n!stonks count - Shows how many stonks you currently own\n!stonks buyprice [count] - Displays current price of buying [count] stonks\n!stonks sellprice [count] - Displays the current price of selling [count] stonks\n!stonks sell [count] - Sells [count] of your stonks\n!stonks value - Gets the current value of your stonks in timcoin (the amount you would receive if you sold all of your stonks)\n\nTo buy stonks, run \"!stonks update\" to update the stock price, \"!stonks price [count]\" to see how much it will cost, then run \"\\pay nogmBOT [cost]\" to pay the bot. The boy will auto-detect who paid it and allocate the correct amount of stonks to that user.```");
		else if (command[1] == "buyprice")
		{
			client.channels.get("498927226838974476").send("\\timcoins").then(() =>
			{
				client.channels.get("498927226838974476").awaitMessages(response1 => response1.author.id === "647054485465595914", { "max": 1 }).then(collected =>
				{
					stonkprice = parseFloat(/nogmBOT has `([0-9]+\.[0-9]+)` TIMCOINS/.exec(collected.first().content)[1]);
					let total = 0;
					let stonk = stonkprice;
					for (let i = 0; i < parseInt(command[2]); i++)
					{
						total += stonk * 0.05;
						stonk += stonk * 0.05;
					}
					message.channel.send("To buy " + command[2] + " stonks will cost `" + total + "` timcoins.");
				});
			});
		}
		else if (command[1] == "sellprice")
		{
			client.channels.get("498927226838974476").send("\\timcoins").then(() =>
			{
				client.channels.get("498927226838974476").awaitMessages(response1 => response1.author.id === "647054485465595914", { "max": 1 }).then(collected =>
				{
					stonkprice = parseFloat(/nogmBOT has `([0-9]+\.[0-9]+)` TIMCOINS/.exec(collected.first().content)[1]);
					let total = 0;
					let stonk = stonkprice;
					for (let i = 0; i < parseInt(command[2]); i++)
					{
						stonk -= stonk * 0.05;
						total += stonk * 0.05;
					}
					message.channel.send("Selling " + command[2] + " stonks will earn you `" + total + "` timcoins.");
				});
			});
		}
		else if (command[1] == "sell")
		{
			message.channel.send("Unable to sell stonks at the moment. Just buy and let the value grow!");
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
						stonkprice = parseFloat(/nogmBOT has `([0-9]+\.[0-9]+)` TIMCOINS/.exec(collected.first().content)[1]);
						let total = 0;
						let stonk = stonkprice;
						for (let i = 0; i < stonks[message.author.id]; i++)
						{
							stonk -= stonk * 0.05;
							total += stonk * 0.05;
						}
						message.channel.send("You currently own " + total + " timcoins in stonks.");
					});
				});
		}
	}
	else if (message.content.substring(0, 12) == "\\pay nogmBOT")
	{
		client.channels.get("498927226838974476").awaitMessages(response1 => response1.author.id === "647054485465595914", { "max": 1 }).then(collected =>
		{
			if (collected.first().content == "payment success")
				client.channels.get("498927226838974476").send("\\timcoins").then(() =>
				{
					client.channels.get("498927226838974476").awaitMessages(response1 => response1.author.id === "647054485465595914", { "max": 1 }).then(collected =>
					{
						stonkprice = parseFloat(/nogmBOT has `([0-9]+\.[0-9]+)` TIMCOINS/.exec(collected.first().content)[1]);
						let stonk = stonkprice;
						let price = parseFloat(message.content.substring(13));
						let bought = 0;
						let total = 0;
						if (stonkprice == 0)
						{
							message.channel.send("Please run `!stonks update`. Your timcoin cannot be refunded at this time.");
							return;
						}
		
						while (total < price)
						{
							console.log("total:" + total);
							console.log("price: " + price);
							console.log("bought: " + bought);
							total += stonk * 0.05;
							stonk += stonk * 0.05;
							bought++;
						}
						bought--;
		
						if (bought < 0) bought = 0;
						if (!stonks.hasOwnProperty(message.author.id))
							stonks[message.author.id] = 0;
						stonks[message.author.id] += bought;
						message.channel.send("With what you have paid me, you have earned `" + bought + "` stonks.");
				
						fs.writeFileSync("./stonks.json", JSON.stringify(stonks));
					});
				});
			else
				message.channel.send("The transaction failed to go through... I cannot give you any stonks.");
		});
	}
});

client.login(config.token);