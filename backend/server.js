import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const question = req.body.question;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${question}`,
      temperature: 0, // Higher values means model will take higher risk of being wrong
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    console.log("response", response);

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    res.status(500).send(error || "Something went wrong.");
  }
});

app.listen(8000, () => {
  console.log("App is running");
});
