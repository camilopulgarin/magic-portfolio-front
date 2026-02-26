import { 
  Palette, 
  Zap, 
  Globe, 
  Shield,
  LayoutTemplate,
  TrendingUp
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: LayoutTemplate,
    title: "Templates Modernos",
    description: "Elige entre dozens de diseños profesionales creados por expertos en diseño UI/UX."
  },
  {
    icon: Zap,
    title: "Edición Instantánea",
    description: "Editor visual intuitivo con vista previa en tiempo real. Sin código, sin complicaciones."
  },
  {
    icon: Globe,
    title: "Dominio Personalizado",
    description: "Conecta tu propio dominio (.com, .es) con SSL automático incluido."
  },
  {
    icon: Palette,
    title: "Personalización Total",
    description: "Colores, tipografías, spacing y más. Adapta cada detalle a tu marca personal."
  },
  {
    icon: Shield,
    title: "SSL Seguro",
    description: "Tu portafolio siempre protegido con certificado SSL gratuito y hosting seguro."
  },
  {
    icon: TrendingUp,
    title: "SEO Optimizado",
    description: "Aparece en Google con meta tags automáticos, sitemap y optimización para buscadores."
  }
];

export function Features() {
  return (
    <section id="caracteristicas" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Todo lo que necesitas para destacar
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Herramientas poderosas para crear un portafolio profesional que impressione a recruiters y clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group relative bg-card/50 backdrop-blur-sm border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
