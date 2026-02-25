import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <Hero />

        <section id="caracteristicas" className="py-20 container mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground">Características</h2>
        </section>

        <section id="precios" className="py-20 container mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground">Precios</h2>
        </section>

        <section id="explorar" className="py-20 container mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground">Explorar Portafolios</h2>
        </section>
      </main>
    </div>
  );
}
