// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  // Seed episodes
  const episodes = [
    {
      title: 'How Saudi Coffee Culture Shapes Business Deals',
      slug: 'saudi-coffee-culture-business-deals',
      description: 'Discover how the ritual of Arabic coffee (qahwa) is deeply embedded in Saudi business culture. From the symbolism of the small cup to the protocol of refusal, we explore how this centuries-old tradition creates trust, signals hierarchy, and closes multi-million dollar deals — all before a single contract is signed.',
      type: 'video',
      youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      guestName: 'Dr. Khalid Al-Mansouri',
      guestTitle: 'Cultural Business Consultant, Riyadh',
      guestBio: 'Dr. Al-Mansouri has spent 20 years advising Fortune 500 companies on GCC market entry strategies.',
      score: 98,
      published: true,
      publishedAt: new Date('2024-01-15'),
    },
    {
      title: 'The Japanese Art of Meishi: Business Cards as Identity',
      slug: 'japanese-meishi-business-cards-identity',
      description: 'In Japan, the exchange of business cards — meishi koukan — is a ritual loaded with meaning. A card is not just contact info; it represents the person\'s professional soul. This episode unpacks why mishandling a meishi can end a partnership before it begins, and how respecting this tradition unlocks extraordinary loyalty.',
      type: 'audio',
      audioUrl: '/audio/episode-2.mp3',
      thumbnail: '/thumbnails/episode-2.jpg',
      guestName: 'Yuki Tanaka',
      guestTitle: 'Cross-Cultural Business Trainer, Tokyo',
      guestBio: 'Yuki has trained executives from over 40 countries to navigate Japanese corporate culture successfully.',
      score: 94,
      published: true,
      publishedAt: new Date('2024-01-22'),
    },
    {
      title: 'Wasta: How Connections Drive Commerce in the Arab World',
      slug: 'wasta-connections-arab-world-commerce',
      description: 'Wasta — influence through connections — is the invisible engine of business across the Arab world. Is it nepotism or is it trust-based networking taken to its highest form? We explore how wasta works, why Westerners misread it, and how to build authentic relationships that create real business value.',
      type: 'video',
      youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      guestName: 'Layla Hassan',
      guestTitle: 'Regional Director, MENA Business Council',
      guestBio: 'Layla bridges Western corporations and Arab family businesses, facilitating deals across 12 countries.',
      score: 91,
      published: true,
      publishedAt: new Date('2024-02-05'),
    },
    {
      title: 'Guanxi: China\'s Social Currency and Business Power',
      slug: 'guanxi-china-social-currency-business',
      description: 'No concept is more essential to understanding Chinese business than guanxi — the network of relationships and reciprocal obligations that governs commerce. This episode explores how guanxi is built over decades, why gifts matter enormously, and what happens when foreign companies try to shortcut it.',
      type: 'audio',
      audioUrl: '/audio/episode-4.mp3',
      thumbnail: '/thumbnails/episode-4.jpg',
      guestName: 'Wei Chen',
      guestTitle: 'Business Development Director, Shanghai',
      guestBio: 'Wei has helped dozens of multinationals build sustainable guanxi networks in mainland China and Hong Kong.',
      score: 89,
      published: true,
      publishedAt: new Date('2024-02-19'),
    },
    {
      title: 'Ubuntu Philosophy: African Community-Centered Business',
      slug: 'ubuntu-philosophy-african-business',
      description: '"I am because we are." The Ubuntu philosophy — foundational across sub-Saharan Africa — fundamentally challenges Western individualistic business models. We examine how Ubuntu principles create deeply loyal teams, shape negotiation styles, and why businesses that ignore it fail in African markets.',
      type: 'video',
      youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      guestName: 'Amara Diallo',
      guestTitle: 'CEO, Pan-African Business Institute',
      guestBio: 'Amara is a leading voice on African business philosophy, advising governments and corporations across 15 countries.',
      score: 95,
      published: true,
      publishedAt: new Date('2024-03-04'),
    },
    {
      title: 'Indian Jugaad: Innovation from Constraint',
      slug: 'indian-jugaad-frugal-innovation',
      description: 'Jugaad — the Hindi concept of frugal, flexible innovation — has produced some of the world\'s most elegant solutions. From multi-million dollar companies to village entrepreneurs, this episode explores how resource scarcity breeds creativity and why global corporations are now trying to bottle the jugaad mindset.',
      type: 'audio',
      audioUrl: '/audio/episode-6.mp3',
      thumbnail: '/thumbnails/episode-6.jpg',
      guestName: 'Priya Sharma',
      guestTitle: 'Innovation Strategist & Author',
      guestBio: 'Priya\'s book "The Jugaad Way" has been translated into 14 languages and is required reading at three business schools.',
      score: 87,
      published: true,
      publishedAt: new Date('2024-03-18'),
    },
  ];

  for (const episode of episodes) {
    await prisma.episode.upsert({
      where: { slug: episode.slug },
      update: {},
      create: episode,
    });
  }

  console.log('✅ Database seeded successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
