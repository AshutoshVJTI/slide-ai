import OpenAI from "openai";

export const openai = new OpenAI({
  
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateCreativePrompt = async (prompt: string) => {
  // const res = await openai.chat.completions.create({
  //   model: "gpt-3.5-turbo",
  //   messages: [
  //     {
  //       role: "user",
  //       content: `Generate a list of 5 creative writing prompts based on the following prompt: ${prompt}`,
  //     },
  //   ],
  // });

  // return res.choices[0].message.content;
}