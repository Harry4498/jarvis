import express from 'express'
import * as dotenv from 'dotenv'
 // this is to import data from env file 
import cors from 'cors'  // it allows us to make cross origin request 
import { Configuration, OpenAIApi } from 'openai'

dotenv.config();  // this is use  so that we can use env variable 

//console.log(process.env.OPENAI_API_KEY);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
 // creating the instance 
const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors()) // allow us to use cors origin request aalow server to call from frontend

app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0., increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))