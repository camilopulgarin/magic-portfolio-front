import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Demo - Plantillas de Portafolio | MagicPortfolio',
  description:
    'Explora nuestras plantillas de portafolio y descubre cómo podría verse tu portafolio profesional con MagicPortfolio.',
  openGraph: {
    title: 'Demo - Plantillas de Portafolio | MagicPortfolio',
    description:
      'Explora nuestras plantillas de portafolio y descubre cómo podría verse tu portafolio profesional.',
    type: 'website',
  },
};

const templates = [
  {
    id: 'formal',
    name: 'Academic Portfolio',
    type: 'formal',
    description:
      'Estilo CV moderno, limpio y profesional. Ideal para desarrolladores, académicos y profesionales corporativos.',
    href: '/demo/formal',
    features: ['Light mode', 'Layout limpio', 'Secciones claras', 'Badges minimalistas'],
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    type: 'creative',
    description:
      'Diseño audaz con efectos de vidrio esmerilado, gradientes y animaciones. Perfecto para mostrar creatividad.',
    href: '/demo/creative',
    features: ['Glassmorphism', 'Dark mode', 'Animaciones', 'Gradientes'],
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">MagicPortfolio</span>
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            Volver al Inicio
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Elige tu{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent">
              Estilo de Portafolio
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Explora nuestras plantillas y descubre cómo podría verse tu portafolio profesional.
            Selecciona una para ver la demostración completa.
          </p>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              {/* Preview Header */}
              <div
                className={`h-48 ${
                  template.type === 'formal'
                    ? 'bg-linear-to-br from-slate-100 to-slate-200'
                    : 'bg-linear-to-br from-primary/20 via-secondary/10 to-transparent'
                }`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {template.type === 'formal' ? (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-slate-300 mb-3" />
                      <div className="w-32 h-3 bg-slate-300 rounded mx-auto mb-2" />
                      <div className="w-24 h-2 bg-slate-200 rounded mx-auto" />
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-linear-to-br from-primary via-secondary to-accent p-0.5 mb-3">
                        <div className="w-full h-full rounded-full bg-[#0a0a0f]" />
                      </div>
                      <div className="w-32 h-3 bg-white/20 rounded mx-auto mb-2" />
                      <div className="w-24 h-2 bg-white/10 rounded mx-auto" />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      template.type === 'formal'
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-primary/20 text-primary'
                    }`}
                  >
                    {template.type === 'formal' ? '📐 Formal' : '✨ Creativo'}
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-2">{template.name}</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {template.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {template.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 text-xs rounded-full bg-white/5 text-slate-400 border border-white/5"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={template.href}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-slate-200 transition-colors w-full justify-center"
                >
                  <Eye className="w-4 h-4" />
                  Ver Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
