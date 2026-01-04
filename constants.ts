
import { Prompt } from './types';

export const MOCK_OFFER_END_DATE = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

// Initial sample data for prompts
export const PROMPTS_DATA: Prompt[] = [
  {
    id: '1',
    title: 'Cyberpunk Ronin',
    description: 'A futuristic samurai in a neon-lit Tokyo street.',
    promptText: 'Cyberpunk samurai, neon lights, rain, high detail, cinematic lighting, 8k --v 6.0',
    imageUrl: 'https://cdn.imgchest.com/files/63bb11beb595.jpg',
    category: 'Men',
    likes: 1240,
    style: 'Cyberpunk'
  },
  {
    id: '2',
    title: 'Ethereal Forest Guardian',
    description: 'A magical woman protecting an ancient glowing forest.',
    promptText: 'Ethereal woman, forest guardian, glowing plants, magical atmosphere, intricate details --v 6.0',
    imageUrl: 'https://cdn.imgchest.com/files/3359d7725202.jpg',
    category: 'Women',
    likes: 980,
    style: 'Fantasy'
  },
  {
    id: '3',
    title: 'Neon Lovers',
    description: 'A couple standing under a glowing neon sign in a rain-slicked alley.',
    promptText: 'Couple in love, neon sign, rain-slicked alley, cinematic, atmospheric lighting --v 6.0',
    imageUrl: 'https://cdn.imgchest.com/files/63bb11beb595.jpg',
    category: 'Couple',
    likes: 1560,
    style: 'Cinematic'
  }
];
