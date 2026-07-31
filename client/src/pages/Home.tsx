import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Shield, Users, CheckCircle2, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import ChatInterface from "@/components/ChatInterface";
import { IMAGE_LOGO, IMAGE_TALIA, IMAGE_MARIA, IMAGE_JOAO, IMAGE_ANA, IMAGE_HAPVIDA, IMAGE_BRADESCO, IMAGE_AMAZONIA, IMAGE_ADVENTISTA } from "@/lib/imageConstants";

const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const { theme, toggleTheme, switchable } = useTheme();
  const featuresRef = useScrollAnimation();
  const operadorasRef = useScrollAnimation();
  const testimonialsRef = useScrollAnimation();

  if (showChat) {
    return <ChatInterface onClose={() => setShowChat(false)} />;
  }

  const whatsappLink = "https://wa.me/5591983070 32?text=Ol%C3%A1%20Talita%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20planos%20de%20sa%C3%BAde";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <img src={IMAGE_LOGO} alt="Protect Life" className="w-8 h-8 flex-shrink-0" />
            <div className="min-w-0">
              <span className="text-lg md:text-xl font-bold text-primary block truncate">Protect Life</span>
              <p className="text-xs text-foreground/80 dark:text-foreground/90">por Talita Motta</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-end">
            <a href="#operadoras" className="text-xs md:text-sm hover:text-primary transition hidden sm:inline">
              Operadoras
            </a>
            <a href="#depoimentos" className="text-xs md:text-sm hover:text-primary transition hidden sm:inline">
              Depoimentos
            </a>
            {switchable && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
              </button>
            )}
            <Button
              onClick={() => setShowChat(true)}
              className="bg-primary hover:bg-primary/90 text-white text-xs md:text-sm px-3 md:px-4 py-2"
            >
              Falar com Tália 💙
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-slate-900 dark:to-slate-800 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 md:mb-6">
                Encontre o Melhor Plano de Saúde para Você
              </h1>
              {/* Operadoras Logos - Small and Quick Scroll Animation */}
              <div className="mb-8 md:mb-12">
                <div className="flex items-center justify-center gap-3 md:gap-4 overflow-x-auto pb-4 animate-pulse">
                  <img src={IMAGE_HAPVIDA} alt="Hapvida" className="h-12 md:h-16 object-contain flex-shrink-0" />
                  <img src={IMAGE_BRADESCO} alt="Bradesco" className="h-12 md:h-16 object-contain flex-shrink-0" />
                  <img src={IMAGE_AMAZONIA} alt="Hospital Amazônia" className="h-12 md:h-16 object-contain flex-shrink-0" />
                  <img src={IMAGE_ADVENTISTA} alt="Hospital Adventista" className="h-12 md:h-16 object-contain flex-shrink-0" />
                </div>
              </div>
              <Button
                onClick={() => setShowChat(true)}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white w-full md:w-auto"
              >
                Comece Agora com a Tália
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef.ref} className={`py-12 md:py-16 bg-white dark:bg-slate-950 transition-all duration-700 ${featuresRef.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8 md:mb-12">
            Por que escolher a Talita Motta?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="p-6 border-2 border-primary/10 hover:border-primary/30 transition">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">Segurança</h3>
              <p className="text-foreground/70">
                Consultoria confiável com profissional experiente no mercado de saúde.
              </p>
            </Card>
            <Card className="p-6 border-2 border-primary/10 hover:border-primary/30 transition">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">Atendimento Humano</h3>
              <p className="text-foreground/70">
                Suporte personalizado via WhatsApp. A Tália ajuda, mas você sempre fala com a Talita.
              </p>
            </Card>
            <Card className="p-6 border-2 border-primary/10 hover:border-primary/30 transition">
              <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">Melhor Opção</h3>
              <p className="text-foreground/70">
                Análise completa para encontrar o plano que melhor se adequa às suas necessidades.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Operadoras Section */}
      <section ref={operadorasRef.ref} id="operadoras" className={`py-12 md:py-16 bg-primary/5 dark:bg-slate-900 transition-all duration-700 ${operadorasRef.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8 md:mb-12">
            Operadoras Parceiras
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "Hapvida", description: "Cobertura nacional com excelente rede", logo: IMAGE_HAPVIDA },
              { name: "Bradesco", description: "Planos empresariais e individuais", logo: IMAGE_BRADESCO },
              { name: "Hospital Amazônia", description: "Referência em Belém", logo: IMAGE_AMAZONIA },
              { name: "Hospital Adventista", description: "Qualidade e confiabilidade", logo: IMAGE_ADVENTISTA },
            ].map((op) => (
              <Card
                key={op.name}
                className="p-6 border-2 border-primary/10 hover:border-primary/30 transition text-center"
              >
                <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-lg mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  <img src={op.logo} alt={op.name} className="max-h-full max-w-full object-contain" />
                </div>
                <h3 className="font-semibold text-primary mb-2">{op.name}</h3>
                <p className="text-sm text-foreground/70">{op.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef.ref} id="depoimentos" className={`py-12 md:py-16 bg-white dark:bg-slate-950 transition-all duration-700 ${testimonialsRef.isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8 md:mb-12">
            O que nossos clientes dizem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Maria Silva",
                role: "Empresária",
                text: "Talita me ajudou a encontrar o melhor plano para minha empresa. Muito profissional!",
                rating: 5,
                photo: IMAGE_MARIA,
              },
              {
                name: "João Santos",
                role: "Autônomo",
                text: "Excelente consultoria. A Tália respondeu todas as minhas dúvidas rapidinho.",
                rating: 5,
                photo: IMAGE_JOAO,
              },
              {
                name: "Ana Costa",
                role: "Mãe de família",
                text: "Consegui um plano ótimo com preço justo. Recomendo muito!",
                rating: 5,
                photo: IMAGE_ANA,
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-6 border-2 border-primary/10">
                <div className="flex items-center gap-4 mb-4">
                  <img src={testimonial.photo} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" onError={(e) => (e.target as HTMLImageElement).style.display='none'} />
                  <div className="min-w-0">
                    <p className="font-semibold text-primary text-sm truncate">{testimonial.name}</p>
                    <p className="text-xs text-foreground/60">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {Array(testimonial.rating)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ⭐
                      </span>
                    ))}
                </div>
                <p className="text-foreground/70 italic text-sm">"{testimonial.text}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary dark:bg-primary/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Pronto para encontrar seu plano?</h2>
          <p className="text-base md:text-lg mb-6 md:mb-8 text-white/90">
            Converse com a Tália agora e descubra as melhores opções para você! 💙
          </p>
            <Button
            onClick={() => setShowChat(true)}
            size="lg"
            className="bg-white hover:bg-slate-50 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 text-primary font-semibold w-full md:w-auto shadow-lg hover:shadow-xl transition-all"
          >
            Falar com Tália Agora 🤖
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/10 dark:bg-slate-900 border-t border-border py-6 md:py-8">
        <div className="container mx-auto px-4 text-center text-foreground/70 dark:text-foreground/80">
          <p className="text-sm md:text-base">© 2026 Protect Life - Consultoria de Planos de Saúde. Todos os direitos reservados.</p>
          <p className="text-xs md:text-sm mt-2">Especialista: Talita Motta | Disponível 24/7 para ajudar você! 💙</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs md:text-sm mt-3 inline-block">
            Fale conosco via WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
}
