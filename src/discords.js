import dotenv from "dotenv";
dotenv.config();

import {Client} from 'discord.js'
import process from "node:process";

const client =  new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMemebers,
        GatewayIntentBits.DirectMessages,
    ]
});


client.login(process.env.DISCORD_TOKEN);


client.on('messageCreate', async (message)=>{
  console.log(message);

  if(!message?.author.bot){
    message.author.send( `Echo ${message.content}`);

  }
  
});