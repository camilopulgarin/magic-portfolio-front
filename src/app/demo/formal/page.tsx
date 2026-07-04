import { Metadata } from 'next';
import { FormalTemplate } from '@/components/templates/FormalTemplate';
import { mockPortfolioData } from '@/lib/mock/portfolio-data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Demo - Portafolio Académico | MagicPortfolio',
  description:
    'Explora una demostración de nuestra plantilla de Portafolio Académico. Mira cómo podría verse tu portafolio profesional con MagicPortfolio.',
  openGraph: {
    title: 'Demo - Portafolio Académico | MagicPortfolio',
    description:
      'Explora una demostración de nuestra plantilla de Portafolio Académico.',
    type: 'website',
  },
};

export default function FormalDemoPage() {
  return <FormalTemplate data={mockPortfolioData} />;
}
