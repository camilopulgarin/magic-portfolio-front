import { PortfolioData } from '@/types/portfolio';

export const mockPortfolioData: PortfolioData = {
  fullName: 'Alex Rivera',
  profession: 'Ingeniero Full-Stack Senior',
  avatarUrl: '/demo/avatar.jpg',
  bio: 'Especializado en la intersección entre arquitectura cloud escalable y experiaturas de usuario intuitivas. Más de 8 años de experiencia construyendo aplicaciones críticas para instituciones de investigación y empresas líderes. Enfocado en código limpio, documentación formal y optimización de rendimiento.',
  skills: [
    'TypeScript',
    'React',
    'Node.js',
    'AWS (Certificado)',
    'Python',
    'GraphQL',
    'PostgreSQL',
    'Docker',
  ],
  projects: [
    {
      id: '1',
      title: 'NeuralGraph Explorer',
      description:
        'Herramienta de visualización de código abierto para arquitecturas complejas de redes neuronales, utilizada por investigadores en MIT.',
      tags: ['React', 'D3.js', 'WebGL'],
      liveUrl: 'https://example.com/neuralgraph',
      githubUrl: 'https://github.com/example/neuralgraph',
    },
    {
      id: '2',
      title: 'QuantScale API',
      description:
        'API de modelado financiero de alto rendimiento capaz de procesar más de 10,000 peticiones por segundo con latencia inferior a 50ms.',
      tags: ['Node.js', 'Redis', 'AWS'],
      liveUrl: 'https://example.com/quantscale',
    },
    {
      id: '3',
      title: 'Sentient CMS',
      description:
        'Sistema de gestión de contenido headless diseñado para revistas académicas con soporte integrado de LaTeX.',
      tags: ['TypeScript', 'PostgreSQL'],
      githubUrl: 'https://github.com/example/sentient-cms',
    },
  ],
  socialLinks: [
    {
      platform: 'email',
      url: 'mailto:alex@rivera.dev',
      label: 'alex@rivera.dev',
    },
    {
      platform: 'github',
      url: 'https://github.com/alexrivera',
      label: '@alexrivera-dev',
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/in/alexrivera',
      label: 'in/alexrivera',
    },
  ],
};
