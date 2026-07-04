import { PortfolioData } from '@/types/portfolio';
import { Mail, ArrowUpRight } from 'lucide-react';

interface CreativeTemplateProps {
  data: PortfolioData;
}

export function CreativeTemplate({ data }: CreativeTemplateProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">CREATIVE.LAB</span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#work" className="hover:text-white transition-colors">
              Proyectos
            </a>
            <a href="#expertise" className="hover:text-white transition-colors">
              Habilidades
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contacto
            </a>
            <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors">
              Contrátame
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        {/* Avatar with glow */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-linear-to-r from-primary via-secondary to-accent rounded-full blur-2xl opacity-30" />
          <div className="w-32 h-32 rounded-full bg-linear-to-br from-primary via-secondary to-accent p-1">
            <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-linear-to-br from-slate-700 to-slate-800" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4">
          Hola, soy{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent">
            {data.fullName.split(' ')[0]}
          </span>{' '}
          <span className="text-white">{data.fullName.split(' ')[1]}</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 text-center max-w-2xl mb-8">
          {data.profession} y Artesano Digital creando experiencias web inmersivas de alto
          rendimiento.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-slate-200 transition-colors">
            Ver Proyectos
          </button>
          <button className="px-6 py-3 border border-white/20 rounded-full font-medium hover:bg-white/5 transition-colors">
            Contáctame
          </button>
        </div>
      </section>

      {/* Core Expertise */}
      <section id="expertise" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
              Mis
            </span>{' '}
            Habilidades
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {data.skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center gap-2 px-5 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm text-slate-300 hover:bg-white/10 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Works */}
      <section id="work" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Proyectos Destacados</h2>
              <p className="text-slate-400">
                Una selección curada de mis proyectos y colaboraciones recientes.
              </p>
            </div>
            <a
              href="#"
              className="hidden md:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Ver Todos
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {data.projects.map((project, index) => (
              <div
                key={project.id}
                className={`group relative rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 ${
                  index === 0 ? 'md:row-span-2' : ''
                }`}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 ${
                    index === 0
                      ? 'bg-linear-to-br from-primary/20 via-secondary/10 to-transparent'
                      : index === 1
                        ? 'bg-linear-to-br from-secondary/20 via-accent/10 to-transparent'
                        : 'bg-linear-to-br from-accent/20 via-primary/10 to-transparent'
                  }`}
                />

                <div className="relative p-6 h-full flex flex-col justify-between min-h-62.5">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-slate-400 uppercase tracking-wider">
                        Proyecto
                      </span>
                      <span className="text-xs text-primary">•</span>
                      <span className="text-xs text-slate-500">{project.tags[0]}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-xs text-slate-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Tienes un Proyecto en Mente?</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Actualmente estoy aceptando nuevos proyectos y colaboraciones. Construyamos algo
              extraordinario juntos.
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-slate-200 transition-colors">
              Hola
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold tracking-tight">CREATIVE.LAB</span>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            {data.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {link.platform === 'email'
                  ? 'Correo'
                  : link.platform === 'github'
                    ? 'GitHub'
                    : 'LinkedIn'}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
