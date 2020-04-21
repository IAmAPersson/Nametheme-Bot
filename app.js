const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () =>
{
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setGame("existential crisis");
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
	if (message.author.bot) return;

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
});

client.login(config.token);
