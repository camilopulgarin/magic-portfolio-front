'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, ExternalLink } from 'lucide-react';

interface Portfolio {
  id: number;
  name: string;
  profession: string;
  image: string;
  tags: string[];
}

const portfolios: Portfolio[] = [
  {
    id: 1,
    name: "María García",
    profession: "Diseñadora UX/UI",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    tags: ["Diseño", "Minimalista"]
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    profession: "Desarrollador Full Stack",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    tags: ["Desarrollo", "Tech"]
  },
  {
    id: 3,
    name: "Ana Rodríguez",
    profession: "Fotógrafa Profesional",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
    tags: ["Fotografía", "Creativo"]
  },
  {
    id: 4,
    name: "Javier López",
    profession: "Product Designer",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
    tags: ["Producto", "Moderno"]
  },
  {
    id: 5,
    name: "Sofia Chen",
    profession: "Ilustradora Digital",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    tags: ["Arte", "Colorido"]
  },
  {
    id: 6,
    name: "Miguel Torres",
    profession: "Arquitecto",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
    tags: ["Arquitectura", "Elegante"]
  }
];

export function Showcase() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="explorar" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Portafolios destacados
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Inspírate con estos portafolios creados por nuestra comunidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {portfolios.map((portfolio) => (
            <Card 
              key={portfolio.id}
              className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredId(portfolio.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={portfolio.image} 
                  alt={portfolio.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                <div className={`absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent transition-opacity duration-300 ${hoveredId === portfolio.id ? 'opacity-100' : 'opacity-0'}`} />
                
                <div className={`absolute inset-0 flex items-center justify-center gap-4 transition-all duration-300 ${hoveredId === portfolio.id ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                  <button className="p-3 rounded-full bg-primary/90 hover:bg-primary text-white transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex flex-wrap gap-2">
                    {portfolio.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-white/10 backdrop-blur-sm border-0 text-white">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {portfolio.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {portfolio.profession}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-6 py-3 rounded-xl bg-card border border-white/10 hover:bg-card/80 transition-colors text-foreground">
            Ver todos los portafolios
          </button>
        </div>
      </div>
    </section>
  );
}
