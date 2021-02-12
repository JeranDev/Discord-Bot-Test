require('dotenv').config()

const Discord = require('discord.js')
const axios = require('axios')
const client = new Discord.Client({
  partials: ['MESSAGE'],
})

const cheweyURL = 'https://api.chewey-bot.top/'
const animeChanURL = 'https://animechanapi.xyz/api/quotes/'

const BOT_PREFIX = '!'
const BOT_PREFIX_ANIME = '~'

client.on('ready', () => {
  console.log('Our bot is ready to go')
})

client.on('messageDelete', msg => {
  msg.channel.send('Stop deleting messages!')
})

client.on('message', msg => {
  if (
    msg.content
      .split(/[\s,\?\,\.!]+/)
      .some(word => word.toLocaleLowerCase() === 'based')
  ) {
    msg.react(`🇧`)
    msg.react(`🇦`)
    msg.react(`🇸`)
    msg.react(`🇪`)
    msg.react(`🇩`)
    msg.react(`😍`)
  }
  if (msg.content.startsWith(`${BOT_PREFIX}`)) {
    const messageRegex = msg.content.replace(/[\s,\?\,\.!]+/, '')
    cheweyFunction(msg, messageRegex)
  } else if (msg.content.startsWith(`${BOT_PREFIX_ANIME}`)) {
    const messageRegex = msg.content.replace(/[\s,\?\,\.~]+/, '')
    animeChanFunction(msg, messageRegex)
  }
})

async function cheweyFunction(msg, command) {
  try {
    const response = await axios.get(
      `${cheweyURL}${command}${process.env.CHEWEY_API_KEY}`
    )
    msg.channel.send(`${response.data.data}`)
  } catch (error) {
    msg.channel.send("Sorry, I don't reconize that command.")
  }
}

async function animeChanFunction(msg, command) {
  try {
    if (command === 'random') {
      const response = await axios.get(`${animeChanURL}/random`)
      msg.channel.send(
        `"${response.data.data[0].quote}" - ${response.data.data[0].character} [${response.data.data[0].anime}]`
      )
    } else {
      const response = await axios.get(`${animeChanURL}?anime=${command}`)
      msg.channel.send(
        `"${response.data.data[0].quote}" - ${response.data.data[0].character}`
      )
    }
  } catch (error) {
    msg.channel.send("Can't seem to find that anime... uwu")
  }
}

client.login(process.env.BOT_TOKEN)
