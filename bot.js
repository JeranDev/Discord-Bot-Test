require('dotenv').config()

const Discord = require('discord.js')
const axios = require('axios')
const owoify = require('owoifyx')
const client = new Discord.Client({
  partials: ['MESSAGE'],
})

const cheweyURL = 'https://api.chewey-bot.top/'
const animeChanURL = 'https://animechanapi.xyz/api/quotes/'

const BOT_PREFIX = '!'
const BOT_PREFIX_ANIME = '~'
const BOT_PREFIX_LYRICS = '$'
const BOT_PREFIX_OWO = 'owo'

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
    // const messageRegex = msg.content.replace(/[\s,\?\,\.!]+/, '')
    // cheweyFunction(msg, messageRegex)
    return
  } else if (msg.content.startsWith(`${BOT_PREFIX_ANIME}`)) {
    // const messageRegex = msg.content.replace(/[\s,\?\,\.~]+/, '')
    // animeChanFunction(msg, messageRegex)
    return
  } else if (msg.content.startsWith(`${BOT_PREFIX_LYRICS}`)) {
    // const messageRegex = msg.content.replace(/[\s,\?\,\.$]+/, '')
    // getSongLyrics(msg, messageRegex)
    return
  } else if (msg.content.toLocaleLowerCase().startsWith(`${BOT_PREFIX_OWO}`)) {
    handleOwo(msg)
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

async function getSongLyrics(msg, command) {
  const [track, artist] = command.split(',')
  try {
    const trackResponse = await axios.get(
      `https://api.musixmatch.com/ws/1.1/track.search?apikey=${process.env.MUSIXMATCH_API_KEY}&q_track=${track}&q_artist=${artist}`
    )
    const tracks = trackResponse.data.message.body.track_list.filter(
      track => track.track.has_lyrics
    )
    const trackId = tracks[0].track.track_id
    const lyricsResponse = await axios.get(
      `https://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=${process.env.MUSIXMATCH_API_KEY}&track_id=${trackId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    msg.channel.send(`
    🎵 ${lyricsResponse.data.message.body.lyrics.lyrics_body.split('...')[0]}`)
  } catch (error) {
    msg.channel.send("Can't seem to find those lyrics...")
  }
}

async function handleOwo(msg) {
  try {
    const owoText = await owoify(msg.content.slice(3) + ' (*^ω^)')
    msg.channel.send(owoText)
    return
  } catch (error) {
    console.log(error)
  }
}

client.login(process.env.BOT_TOKEN)
