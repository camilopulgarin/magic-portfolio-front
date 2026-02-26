import { 
  UserPlus, 
  Palette, 
  FileText, 
  Rocket
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Crea tu cuenta",
    description: "Regístrate gratis en segundos con tu email o Google. Sin tarjeta de crédito."
  },
  {
    number: "02",
    icon: Palette,
    title: "Elige un template",
    description: "Selecciona de nuestras plantillas diseñadas por profesionales según tu industria."
  },
  {
    number: "03",
    icon: FileText,
    title: "Personaliza el contenido",
    description: "Añade tu información, proyectos, experiencia y fotos. Todo con nuestro editor visual."
  },
  {
    number: "04",
    icon: Rocket,
    title: "Publica tu portafolio",
    description: "Comparte tu enlace único o conecta tu dominio personalizado. ¡Listo para destacar!"
  }
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            ¿Cómo funciona?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            En solo 4 pasos tendrás tu portafolio profesional publicado y listo para impressionar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="bg-card/50 backdrop-blur-sm border-white/5 h-full">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-5xl font-bold text-primary/20">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-card border border-white/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
