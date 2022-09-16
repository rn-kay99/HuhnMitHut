require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const axios = require("axios")
const Tokenizer = require("./main")

const { TOKEN, SERVER_URL } = process.env
const TELEGRAM_API = "https://api.telegram.org/bot" + TOKEN
const URI = "/webhook/" + TOKEN
const WEBHOOK_URL = "https://clean-bottles-exist-87-188-159-21.loca.lt"

const app = express()
app.use(bodyParser.json())

const init = async () => {
    const res = await axios.get(TELEGRAM_API + "/setwebhook?url=" + WEBHOOK_URL)
    console.log(res.data)
}

//init Tokenizer
function parseText(text) {
    tokenizer = new Tokenizer(text);
    let resultString = ""

    while (tokenizer.hasToken()) {
        token = tokenizer.getNextToken();
        if (token.type == "Number") {
            token = tokenizer.getNumericTokenValue(token)
        }
        else {
            token.value = token.text
        }

        resultString += token.value + "  "
    }

    return resultString
}

app.post("/", async (req, res) => {
    console.log(req.body)


    if (req.body.message == null) {
        return res.send()
    }

    const userName = req.body.message.from.first_name
    const chatId = req.body.message.chat.id
    const text = req.body.message.text
    resultString = parseText(text)


    // console.log(req.body.message)


    await axios.post(TELEGRAM_API + "/sendMessage", {
        chat_id: chatId,
        text: "\"" + text + "\" = " + resultString,
        'reply_markup': {
            'keyboard': [['🥚', '🐣', '🐥', '🐔'], ['💧', '🌈', '🎈', '⏳'], ['Marie Knopf 👀', '⚽️']],
            resize_keyboard: true,
        }
    }).catch(err => { console.log('There was an error!', err); })

    return res.send()
})

app.listen(process.env.PORT || 3000, async () => {
    console.log('🐣 app running on port', process.env.PORT || 3000)
    await init()
})