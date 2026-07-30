import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Shield, Users, CheckCircle2 } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return <ChatInterface onClose={() => setShowChat(false)} />;
  }

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">Talita Motta</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#operadoras" className="text-sm hover:text-primary transition">
              Operadoras
            </a>
            <a href="#depoimentos" className="text-sm hover:text-primary transition">
              Depoimentos
            </a>
            <Button
              onClick={() => setShowChat(true)}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Falar com Tália 💙
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-primary mb-6">
              Encontre o Melhor Plano de Saúde para Você
            </h1>
            <p className="text-xl text-foreground/70 mb-8">
              Consultoria especializada em planos de saúde. Deixe que a Tália, nossa assistente IA, 
              ajude você a encontrar a melhor opção para sua família ou empresa.
            </p>
            <Button
              onClick={() => setShowChat(true)}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6"
            >
              Comece Agora com a Tália 🤖
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Por que escolher a Talita Motta?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section id="operadoras" className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Operadoras Parceiras
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Hapvida", description: "Cobertura nacional com excelente rede" },
              { name: "Bradesco", description: "Planos empresariais e individuais" },
              { name: "Hospital Amazônia", description: "Referência em Belém" },
              { name: "Hospital Adventista", description: "Qualidade e confiabilidade" },
            ].map((op) => (
              <Card
                key={op.name}
                className="p-6 border-2 border-primary/10 hover:border-primary/30 transition text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{op.name[0]}</span>
                </div>
                <h3 className="font-semibold text-primary mb-2">{op.name}</h3>
                <p className="text-sm text-foreground/70">{op.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            O que nossos clientes dizem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Silva",
                role: "Empresária",
                text: "Talita me ajudou a encontrar o melhor plano para minha empresa. Muito profissional!",
                rating: 5,
              },
              {
                name: "João Santos",
                role: "Autônomo",
                text: "Excelente consultoria. A Tália respondeu todas as minhas dúvidas rapidinho.",
                rating: 5,
              },
              {
                name: "Ana Costa",
                role: "Mãe de família",
                text: "Consegui um plano ótimo com preço justo. Recomendo muito!",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-6 border-2 border-primary/10">
                <div className="flex gap-1 mb-4">
                  {Array(testimonial.rating)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ⭐
                      </span>
                    ))}
                </div>
                <p className="text-foreground/70 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-primary">{testimonial.name}</p>
                  <p className="text-sm text-foreground/60">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para encontrar seu plano?</h2>
          <p className="text-lg mb-8 text-white/90">
            Converse com a Tália agora e descubra as melhores opções para você! 💙
          </p>
          <Button
            onClick={() => setShowChat(true)}
            size="lg"
            className="bg-white hover:bg-white/90 text-primary text-lg px-8 py-6"
          >
            Falar com Tália Agora 🤖
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/10 border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-foreground/70">
          <p>© 2026 Talita Motta Consultoria de Planos de Saúde. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Disponível 24/7 para ajudar você! 💙</p>
        </div>
      </footer>
    </div>
  );
}
