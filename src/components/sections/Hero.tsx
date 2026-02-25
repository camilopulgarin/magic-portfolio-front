import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden pt-28">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-400 drop-shadow-[0_0_20px_rgba(167,139,250,0.5)]">
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
              >
                <Play className="mr-2 h-5 w-5" />
                Ver Ejemplos
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-card" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent border-2 border-card" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary border-2 border-card" />
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
                <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-xl border border-white/10 shadow-soft rotate-6" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 rounded-3xl bg-card/80 backdrop-blur-xl border border-white/10 shadow-soft -rotate-3">
                  <div className="p-6 h-full flex flex-col gap-4">
                    {/* Mock Portfolio Preview */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary" />
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
  );
}
