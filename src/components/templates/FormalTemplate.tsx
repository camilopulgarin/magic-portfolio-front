import { PortfolioData } from '@/types/portfolio';
import { Mail, Github, Linkedin, Download } from 'lucide-react';

interface FormalTemplateProps {
  data: PortfolioData;
}

export function FormalTemplate({ data }: FormalTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-slate-900">Portafolio Académico</span>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a href="#" className="text-blue-600 font-medium">Inicio</a>
            <a href="#about" className="hover:text-slate-900 transition-colors">Sobre Mí</a>
            <a href="#projects" className="hover:text-slate-900 transition-colors">Proyectos</a>
            <a href="#contact" className="hover:text-slate-900 transition-colors">Contacto</a>
            <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Descargar CV
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-linear-to-br from-slate-300 to-slate-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{data.fullName}</h1>
            <p className="text-xl text-blue-600 mt-1">{data.profession}</p>
            <p className="text-slate-600 mt-4 leading-relaxed max-w-2xl">{data.bio}</p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6">
        <hr className="border-slate-200" />
      </div>

      {/* Technical Expertise */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Experiencia Técnica</h2>
        <div className="flex flex-wrap gap-3">
          {data.skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6">
        <hr className="border-slate-200" />
      </div>

      {/* Selected Projects */}
      <section id="projects" className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Proyectos Destacados</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {data.projects.map((project) => (
            <div
              key={project.id}
              className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{project.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-blue-600 text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6">
        <hr className="border-slate-200" />
      </div>

      {/* Communication */}
      <section id="contact" className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Contacto</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {data.socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                {link.platform === 'email' && <Mail className="w-5 h-5 text-slate-600" />}
                {link.platform === 'github' && <Github className="w-5 h-5 text-slate-600" />}
                {link.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-slate-600" />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 capitalize">
                  {link.platform === 'email' ? 'Correo' : link.platform === 'github' ? 'GitHub' : 'LinkedIn'}
                </p>
                <p className="text-sm text-slate-500">{link.label}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; 2024 Portafolio Académico. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-700 transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
