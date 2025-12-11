import { createClient } from 'microcms-js-sdk';

export type Work = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  description: string;
  image: {
    url: string;
    height: number;
    width: number;
  }[];
  category: string[];
  year?: number; // Optional field for artwork creation year
  displayDate?: string; // Custom display date (YYYY/MM/DD format)
};

export type Profile = {
  name: string;
  bio: string;
  avatar: {
    url: string;
    height: number;
    width: number;
  };
  sns: {
    platform: string;
    url: string;
  }[];
};

export type Config = {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: {
    url: string;
    height: number;
    width: number;
  };
  copyright?: string;
  snsLink?: string;
};

export type News = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content: string; // Rich editor content (HTML)
  category?: string;
  displayDate?: string; // Custom display date (YYYY/MM/DD format)
  thumbnail?: {
    url: string;
    height: number;
    width: number;
  };
};

export type DateConfig = {
  format?: string;
  date?: string; // Fallback if user named the field 'date'
};

// Check if API key is present
const isMock = !process.env.MICROCMS_SERVICE_DOMAIN || !process.env.MICROCMS_API_KEY;

// Sanitize Service Domain (remove .microcms.io if present)
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN || '';
const serviceDomainId = serviceDomain.replace('.microcms.io', '');

export const client = isMock
  ? null
  : createClient({
    serviceDomain: serviceDomainId,
    apiKey: process.env.MICROCMS_API_KEY || '',
  });

// Mock Data
const mockWorks: Work[] = [
  {
    id: '1',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    publishedAt: '2023-01-01T00:00:00Z',
    revisedAt: '2023-01-01T00:00:00Z',
    title: 'Abstract Harmony',
    description: 'A study of color and form in motion.',
    image: [
      {
        url: 'https://placehold.co/800x600/1a1a1a/ffffff?text=Abstract+Harmony',
        height: 600,
        width: 800,
      },
    ],
    category: ['Painting', 'Abstract'],
    displayDate: '2020/2/20',
  },
  {
    id: '2',
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2023-02-01T00:00:00Z',
    publishedAt: '2023-02-01T00:00:00Z',
    revisedAt: '2023-02-01T00:00:00Z',
    title: 'Urban Solitude',
    description: 'Capturing the silence in the city.',
    image: [
      {
        url: 'https://placehold.co/800x600/1a1a1a/ffffff?text=Urban+Solitude',
        height: 600,
        width: 800,
      },
    ],
    category: ['Photography'],
    displayDate: '2021/5/15',
  },
  {
    id: '3',
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2023-03-01T00:00:00Z',
    publishedAt: '2023-03-01T00:00:00Z',
    revisedAt: '2023-03-01T00:00:00Z',
    title: 'Digital Dreams',
    description: 'Exploring the boundaries of reality and digital art.',
    image: [
      {
        url: 'https://placehold.co/800x600/1a1a1a/ffffff?text=Digital+Dreams',
        height: 600,
        width: 800,
      },
    ],
    category: ['Digital', '3D'],
    displayDate: '2023/8/10',
  },
];

const mockProfile: Profile = {
  name: 'Koudai Artist',
  bio: 'Creating visual experiences that challenge perception.',
  avatar: {
    url: 'https://placehold.co/400x400/1a1a1a/ffffff?text=KA',
    height: 400,
    width: 400,
  },
  sns: [
    { platform: 'Instagram', url: 'https://instagram.com' },
    { platform: 'Twitter', url: 'https://twitter.com' },
  ],
};

const mockConfig: Config = {
  siteName: 'Artist Name',
  heroTitle: 'ART IS\nPERCEPTION',
  heroSubtitle: 'Digital & Analog / Tokyo Based',
};

const mockDateConfig: DateConfig = {
  format: 'yyyy/MM/dd', // Default mock format
};

const mockNews: News[] = [
  {
    id: '1',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    publishedAt: '2024-01-15T00:00:00Z',
    revisedAt: '2024-01-15T00:00:00Z',
    title: '新作展示会のお知らせ',
    content: '<p>2024年2月1日より、渋谷ギャラリーにて新作展示会を開催いたします。</p><p><strong>会期:</strong> 2月1日〜2月28日<br><strong>場所:</strong> 渋谷ギャラリーX</p><p>皆様のご来場をお待ちしております。</p>',
    category: 'Exhibition',
    displayDate: '2024/02/01',
  },
  {
    id: '2',
    createdAt: '2023-12-20T00:00:00Z',
    updatedAt: '2023-12-20T00:00:00Z',
    publishedAt: '2023-12-20T00:00:00Z',
    revisedAt: '2023-12-20T00:00:00Z',
    title: 'ウェブサイトをリニューアルしました',
    content: '<p>ポートフォリオサイトを全面リニューアルいたしました。</p><p>新しいデザインで、作品をより魅力的にご覧いただけます。</p>',
    category: 'Update',
    displayDate: '2023/12/20',
  },
];

export const getWorks = async (): Promise<Work[]> => {
  if (isMock || !client) {
    return mockWorks;
  }
  try {
    const data = await client.getList<Work>({ endpoint: 'works' });
    return data.contents;
  } catch (error) {
    console.error('Failed to fetch works:', error);
    return mockWorks;
  }
};

export const getWork = async (id: string): Promise<Work | null> => {
  if (isMock || !client) {
    return mockWorks.find((w) => w.id === id) || null;
  }
  try {
    const data = await client.getListDetail<Work>({ endpoint: 'works', contentId: id });
    return data;
  } catch (error) {
    console.error('Failed to fetch work:', error);
    return mockWorks.find((w) => w.id === id) || null;
  }
};

export const getProfile = async (): Promise<Profile> => {
  if (isMock || !client) {
    return mockProfile;
  }
  try {
    const data = await client.getObject<Profile>({ endpoint: 'profile' });
    return data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return mockProfile;
  }
};

export const getConfig = async (): Promise<Config> => {
  if (isMock || !client) {
    return mockConfig;
  }
  try {
    const data = await client.getObject<Config>({ endpoint: 'config' });
    return data;
  } catch (error) {
    console.error('Failed to fetch config:', error);
    return mockConfig;
  }
};

export const getDateConfig = async (): Promise<DateConfig> => {
  if (isMock || !client) {
    return mockDateConfig;
  }
  try {
    const data = await client.getObject<DateConfig>({ endpoint: 'date' });
    return data;
  } catch (error) {
    console.error('Failed to fetch date config:', error);
    return mockDateConfig;
  }
};

export const getNews = async (): Promise<News[]> => {
  if (isMock || !client) {
    return mockNews;
  }
  try {
    const data = await client.getList<News>({ endpoint: 'news' });
    return data.contents;
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return mockNews;
  }
};

export const getNewsItem = async (id: string): Promise<News | null> => {
  if (isMock || !client) {
    return mockNews.find((n) => n.id === id) || null;
  }
  try {
    const data = await client.getListDetail<News>({ endpoint: 'news', contentId: id });
    return data;
  } catch (error) {
    console.error('Failed to fetch news item:', error);
    return mockNews.find((n) => n.id === id) || null;
  }
};
