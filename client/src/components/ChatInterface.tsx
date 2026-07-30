import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Message {
  id: string;
  text: string;
  sender: "user" | "talia";
  timestamp: Date;
}

interface ChatData {
  nome?: string;
  telefone?: string;
  intencaoTroca?: string;
  beneficiario?: string;
  idades?: string;
  motivoBusca?: string;
  preferenciasOperadora?: string;
  condicoesPre?: string;
  abrangencia?: string;
  redeAmpla?: string;
  criterioPreco?: string;
}

const TALIA_RESPONSES: Record<string, string> = {
  greeting: "Olá! 👋 Eu sou a Tália, assistente virtual da Talita Motta! 💙 Vou ajudar você a encontrar o melhor plano de saúde. Qual é o seu nome? 😊",
  askPhone: "Muito prazer! 🤝 Qual é seu número de telefone? (com WhatsApp, por favor)",
  askIntention: "Obrigada! 📱 Você já tem um plano de saúde e quer trocar? (sim/não)",
  askBeneficiary: "Entendi! 🤔 O plano é para você mesmo ou para outra pessoa/família/empresa?",
  askAges: "Legal! 👨‍👩‍👧‍👦 Qual é a idade de quem vai usar o plano? (Se for mais de uma pessoa, separe por vírgula)",
  askMotive: "Perfeito! 🎯 Você está procurando um plano para um tratamento específico ou por segurança geral?",
  askOperator: "Entendi! 🏥 Você tem alguma preferência de operadora (Hapvida, Bradesco, etc) ou quer ajuda para escolher?",
  askPreExisting: "Ótimo! 💪 Você faz ou precisa de tratamento para alguma condição pré-existente? (diabetes, hipertensão, etc)",
  askScope: "Certo! 🌍 Você prefere um plano nacional ou regional?",
  askNetwork: "Entendido! 🏢 Você prefere uma rede ampla de hospitais e clínicas?",
  askPrice: "Perfeito! 💰 O preço mais barato é um fator decisivo para você?",
  closing: "Excelente! 🎉 Coletei todas as suas informações. Vou abrir o WhatsApp agora para você falar com a Talita e receber uma proposta personalizada! 💙✨",
};

export default function ChatInterface({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [chatData, setChatData] = useState<ChatData>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const createLeadMutation = trpc.leads.create.useMutation();
  const updateLeadMutation = trpc.leads.update.useMutation();

  const steps = [
    "greeting",
    "askPhone",
    "askIntention",
    "askBeneficiary",
    "askAges",
    "askMotive",
    "askOperator",
    "askPreExisting",
    "askScope",
    "askNetwork",
    "askPrice",
    "closing",
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Iniciar conversa
    const initialMessage: Message = {
      id: "1",
      text: TALIA_RESPONSES.greeting,
      sender: "talia",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Processar resposta baseada no step
      const step = steps[currentStep];
      let updatedData = { ...chatData };

      switch (step) {
        case "askPhone":
          updatedData.nome = input;
          break;
        case "askIntention":
          updatedData.telefone = input;
          break;
        case "askBeneficiary":
          updatedData.intencaoTroca = input;
          break;
        case "askAges":
          updatedData.beneficiario = input;
          break;
        case "askMotive":
          updatedData.idades = input;
          break;
        case "askOperator":
          updatedData.motivoBusca = input;
          break;
        case "askPreExisting":
          updatedData.preferenciasOperadora = input;
          break;
        case "askScope":
          updatedData.condicoesPre = input;
          break;
        case "askNetwork":
          updatedData.abrangencia = input;
          break;
        case "askPrice":
          updatedData.redeAmpla = input;
          break;
        case "closing":
          updatedData.criterioPreco = input;
          break;
      }

      setChatData(updatedData);

      // Criar lead se é a primeira mensagem
      if (currentStep === 1 && updatedData.nome) {
        try {
          await createLeadMutation.mutateAsync({
            nome: updatedData.nome,
            telefone: updatedData.telefone || "",
            email: "",
          });
          sessionStorage.setItem("currentLeadId", "temp-" + Date.now());
        } catch (err) {
          console.error("Erro ao criar lead:", err);
        }
      }

      // Próximo step
      const nextStep = currentStep + 1;
      if (nextStep < steps.length) {
        setCurrentStep(nextStep);
        const nextStepKey = steps[nextStep];
        const taliaResponse: Message = {
          id: Date.now().toString() + "talia",
          text: TALIA_RESPONSES[nextStepKey as keyof typeof TALIA_RESPONSES],
          sender: "talia",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, taliaResponse]);
      } else {
        // Finalizar conversa e redirecionar para WhatsApp
        const leadId = sessionStorage.getItem("currentLeadId");
        if (leadId) {
          try {
            const dataToUpdate: Record<string, string> = {};
            Object.entries(updatedData).forEach(([key, value]) => {
              if (value) {
                dataToUpdate[key] = String(value);
              }
            });
            await updateLeadMutation.mutateAsync({
              id: parseInt(leadId.replace("temp-", "")) || 1,
              data: dataToUpdate,
            });
          } catch (err) {
            console.error("Erro ao atualizar lead:", err);
          }
        }

        // Redirecionar para WhatsApp
        const whatsappMessage = `Olá! Sou ${updatedData.nome}. Gostaria de mais informações sobre planos de saúde. Meu telefone é ${updatedData.telefone}.`;
        const whatsappUrl = `https://wa.me/5591987654321?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, "_blank");
        
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      console.error("Erro:", error);
      const errorMessage: Message = {
        id: Date.now().toString() + "error",
        text: "Desculpe, houve um erro. Tente novamente! 😅",
        sender: "talia",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-end p-4 z-50">
      <Card className="w-full max-w-md h-[600px] flex flex-col bg-white border-2 border-primary shadow-2xl">
        {/* Header */}
        <div className="bg-primary text-white p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <p className="font-semibold">Tália</p>
              <p className="text-xs text-white/80">Online • Assistente de Saúde</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-primary/10 text-foreground rounded-bl-none border border-primary/20"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-primary/10 text-foreground px-4 py-2 rounded-lg border border-primary/20">
                <p className="text-sm">Tália está digitando...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="border-t border-border p-4 flex gap-2 bg-white rounded-b-lg"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua resposta..."
            disabled={isLoading}
            className="flex-1 border-primary/30 focus:border-primary"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
