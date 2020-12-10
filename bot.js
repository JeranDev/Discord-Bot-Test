require('dotenv').config()

const Discord = require('discord.js')
const axios = require('axios');
const client = new Discord.Client({
  partials: ['MESSAGE'],
})

const cheweyURL = 'https://api.chewey-bot.top/'

const BOT_PREFIX = '!'

client.on('ready', () => {
  console.log('Our bot is ready to go')
})

client.on('messageDelete', msg => {
  msg.channel.send('Stop deleting messages!')
})

client.on('message', msg => {
  if (msg.content.split(/[\s,\?\,\.!]+/).some(word => word.toUpperCase === 'BASED')) {
    msg.react(`🇧`)
    msg.react(`🇦`)
    msg.react(`🇸`)
    msg.react(`🇪`)
    msg.react(`🇩`)
    msg.react(`😍`)
  }
  if (msg.content.startsWith(`${BOT_PREFIX}`)) {
    const messageRegex = msg.content.replace(/[\s,\?\,\.!]+/, '')
    console.log(messageRegex)
    cheweyFunction(msg, messageRegex)
  }
})

async function cheweyFunction(msg, command) {
  try {
    const response = await axios.get(`${cheweyURL}${command}${process.env.CHEWEY_API_KEY}`)
    msg.channel.send(`${response.data.data}`)
  } catch (error) {
    console.log(error)
  }
}

client.login(process.env.BOT_TOKEN)
