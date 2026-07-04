import { Metadata } from 'next';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';
import { mockPortfolioData } from '@/lib/mock/portfolio-data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Demo - Portafolio Creativo | MagicPortfolio',
  description:
    'Explora una demostración de nuestra plantilla de Portafolio Creativo con efectos de glassmorphism. Mira cómo podría verse tu portafolio con MagicPortfolio.',
  openGraph: {
    title: 'Demo - Portafolio Creativo | MagicPortfolio',
    description:
      'Explora una demostración de nuestra plantilla de Portafolio Creativo con efectos de glassmorphism.',
    type: 'website',
  },
};

export default function CreativeDemoPage() {
  return <CreativeTemplate data={mockPortfolioData} />;
}
