import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY || '';

export const isOpenAIConfigured = () => {
  return apiKey && apiKey !== 'your-openai-api-key' && apiKey.startsWith('sk-');
};

export const openai = isOpenAIConfigured()
  ? new OpenAI({ apiKey })
  : null;
