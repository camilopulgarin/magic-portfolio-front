'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Play, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const portfolioExamples = [
  {
    id: 1,
    name: 'Académico Profesional',
    type: 'formal' as const,
    description: 'Estilo CV moderno, limpio y profesional. Ideal para desarrolladores, académicos y profesionales corporativos.',
    features: ['Layout limpio', 'Light mode', 'Secciones claras', 'Badges minimalistas'],
  },
  {
    id: 2,
    name: 'Creativo Glassmorphism',
    type: 'creative' as const,
    description: 'Diseño audaz con efectos de vidrio esmerilado, gradientes y animaciones. Perfecto para mostrar creatividad.',
    features: ['Glassmorphism', 'Dark mode', 'Animaciones', 'Gradientes'],
  },
];

function FormalPreview() {
  return (
    <div className="w-full h-full bg-linear-to-br from-slate-50 to-slate-100 p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-slate-300 to-slate-400" />
        <div>
          <div className="w-24 h-3 rounded bg-slate-300" />
          <div className="w-16 h-2 rounded bg-slate-200 mt-1" />
        </div>
      </div>
      
      {/* Skills */}
      <div className="flex gap-1.5 mb-4">
        <div className="px-2 py-1 rounded text-[8px] bg-slate-200 text-slate-600">React</div>
        <div className="px-2 py-1 rounded text-[8px] bg-slate-200 text-slate-600">TypeScript</div>
        <div className="px-2 py-1 rounded text-[8px] bg-slate-200 text-slate-600">Node.js</div>
      </div>
      
      {/* Projects Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="aspect-4/3 rounded-lg bg-white border border-slate-200 p-2">
          <div className="w-full h-2 rounded bg-slate-200 mb-1" />
          <div className="w-3/4 h-1.5 rounded bg-slate-100" />
        </div>
        <div className="aspect-4/3 rounded-lg bg-white border border-slate-200 p-2">
          <div className="w-full h-2 rounded bg-slate-200 mb-1" />
          <div className="w-3/4 h-1.5 rounded bg-slate-100" />
        </div>
      </div>
      
      {/* Divider */}
      <div className="w-full h-px bg-slate-200 my-3" />
      
      {/* Contact */}
      <div className="flex gap-2">
        <div className="w-6 h-6 rounded bg-slate-200" />
        <div className="w-6 h-6 rounded bg-slate-200" />
        <div className="w-6 h-6 rounded bg-slate-200" />
      </div>
    </div>
  );
}

function CreativePreview() {
  return (
    <div className="w-full h-full bg-linear-to-br from-slate-900 via-purple-900/30 to-slate-900 p-4 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/30 rounded-full blur-2xl" />
      
      {/* Avatar with glow */}
      <div className="flex justify-center mb-3 relative z-10">
        <div className="w-14 h-14 rounded-full bg-linear-to-br from-primary via-secondary to-accent p-0.5">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-700 to-slate-800" />
          </div>
        </div>
      </div>
      
      {/* Title with gradient */}
      <div className="text-center mb-3 relative z-10">
        <div className="w-20 h-2.5 rounded bg-linear-to-r from-primary via-secondary to-accent mx-auto mb-1" />
        <div className="w-16 h-1.5 rounded bg-white/20 mx-auto" />
      </div>
      
      {/* Glass Card - Skills */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-2 mb-2 relative z-10">
        <div className="flex gap-1 justify-center">
          <div className="px-1.5 py-0.5 rounded text-[7px] bg-primary/20 text-primary border border-primary/30">React</div>
          <div className="px-1.5 py-0.5 rounded text-[7px] bg-secondary/20 text-secondary border border-secondary/30">Next.js</div>
          <div className="px-1.5 py-0.5 rounded text-[7px] bg-accent/20 text-accent border border-accent/30">Tailwind</div>
        </div>
      </div>
      
      {/* Projects */}
      <div className="grid grid-cols-2 gap-2 relative z-10">
        <div className="aspect-4/3 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
          <div className="w-full h-2/3 bg-linear-to-br from-primary/20 to-secondary/20" />
          <div className="p-1.5">
            <div className="w-full h-1.5 rounded bg-white/20 mb-0.5" />
            <div className="w-2/3 h-1 rounded bg-white/10" />
          </div>
        </div>
        <div className="aspect-4/3 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
          <div className="w-full h-2/3 bg-linear-to-br from-secondary/20 to-accent/20" />
          <div className="p-1.5">
            <div className="w-full h-1.5 rounded bg-white/20 mb-0.5" />
            <div className="w-2/3 h-1 rounded bg-white/10" />
          </div>
        </div>
      </div>
      
      {/* Contact Footer */}
      <div className="mt-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-2 relative z-10">
        <div className="flex justify-center gap-3">
          <div className="w-5 h-5 rounded-full bg-white/10 hover:bg-primary/30 transition-colors" />
          <div className="w-5 h-5 rounded-full bg-white/10 hover:bg-primary/30 transition-colors" />
          <div className="w-5 h-5 rounded-full bg-white/10 hover:bg-primary/30 transition-colors" />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExample, setSelectedExample] = useState<number | null>(null);

  return (
    <>
      <section className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden pt-28">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-accent/10 rounded-full blur-3xl" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-white/10 backdrop-blur-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-sm text-muted-foreground">
                  La nueva forma de crear portafolios
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Crea tu{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 via-violet-400 to-cyan-400 drop-shadow-[0_0_20px_rgba(167,139,250,0.5)]">
                  Portafolio Perfecto
                </span>{' '}
                en minutos
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Destácate frente a recruiters y clientes con portafolios personalizados, modernos y
                profesionales. Sin conocimientos técnicos.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 h-12">
                  Crea tu Portafolio Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 h-12 border-white/10 hover:bg-white/5"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Ver Ejemplos
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary border-2 border-card" />
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-secondary to-accent border-2 border-card" />
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-accent to-primary border-2 border-card" />
                  </div>
                  <span>+10K usuarios</span>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1">5.0</span>
                </div>
              </div>
            </div>

            {/* Hero Visual - Glassmorphism Card */}
            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Floating Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-80 h-80 rounded-3xl bg-linear-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-xl border border-white/10 shadow-soft rotate-6" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-72 h-72 rounded-3xl bg-card/80 backdrop-blur-xl border border-white/10 shadow-soft -rotate-3">
                    <div className="p-6 h-full flex flex-col gap-4">
                      {/* Mock Portfolio Preview */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-secondary" />
                        <div>
                          <div className="w-24 h-4 rounded bg-muted" />
                          <div className="w-16 h-3 rounded bg-muted mt-2" />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <div className="w-16 h-6 rounded-full bg-primary/20" />
                        <div className="w-16 h-6 rounded-full bg-secondary/20" />
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-2 mt-4">
                        <div className="rounded-lg bg-muted/50" />
                        <div className="rounded-lg bg-muted/50" />
                        <div className="rounded-lg bg-muted/50 col-span-2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="absolute top-4 -right-12 px-4 py-2 rounded-full bg-card/90 backdrop-blur-xl border border-white/10 shadow-soft">
                  <span className="text-sm font-medium text-foreground">✨ 100% Personalizable</span>
                </div>
                <div className="absolute bottom-4 -left-12 px-4 py-2 rounded-full bg-card/90 backdrop-blur-xl border border-white/10 shadow-soft">
                  <span className="text-sm font-medium text-foreground">🎨 Templates Modernos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Examples Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-white/10 p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Elige tu Estilo de Portafolio
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Selecciona la plantilla que mejor se adapte a tu estilo profesional
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 p-6">
            {portfolioExamples.map((example) => (
              <div
                key={example.id}
                className={`group relative rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                  selectedExample === example.id
                    ? 'border-primary shadow-lg ring-2 ring-primary/20'
                    : 'border-white/10 hover:border-white/20 hover:shadow-md'
                }`}
                onClick={() => setSelectedExample(example.id)}
              >
                {/* Preview Container */}
                <div className="relative aspect-4/3 overflow-hidden">
                  {example.type === 'formal' ? <FormalPreview /> : <CreativePreview />}
                  
                  {/* Selected Indicator */}
                  {selectedExample === example.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* View Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 z-20">
                    <Button
                      size="sm"
                      className="bg-white/90 text-gray-900 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/demo/${example.type}`);
                      }}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver Demo
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      example.type === 'formal'
                        ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        : 'bg-linear-to-r from-primary/20 to-secondary/20 text-primary'
                    }`}>
                      {example.type === 'formal' ? '📐 Formal' : '✨ Creativo'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{example.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {example.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {example.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="px-6 pb-6 text-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              disabled={selectedExample === null}
            >
              {selectedExample === 1 
                ? 'Comenzar con Plantilla Formal' 
                : selectedExample === 2 
                  ? 'Comenzar con Plantilla Creativa' 
                  : 'Selecciona una Plantilla'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Personaliza cualquier plantilla según tus necesidades
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
