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
  nome: string;
  telefone: string;
  intencaoTroca: string;
  beneficiario: string;
  idades: string;
  motivoBusca: string;
  preferenciasOperadora: string;
  condicoesPre: string;
  abrangencia: string;
  redeAmpla: string;
  criterioPreco: string;
}

const INITIAL_QUESTIONS = [
  { key: "nome", prompt: "Qual é o seu nome?" },
  { key: "telefone", prompt: "Qual é seu número de telefone? (com WhatsApp, por favor)" },
  { key: "intencaoTroca", prompt: "Você já tem um plano de saúde e quer trocar? (sim/não)" },
  { key: "beneficiario", prompt: "O plano é para você mesmo ou para outra pessoa/família/empresa?" },
  { key: "idades", prompt: "Qual é a idade de quem vai usar o plano? (Se for mais de uma pessoa, separe por vírgula)" },
  { key: "motivoBusca", prompt: "Você está procurando um plano para um tratamento específico ou por segurança geral?" },
  { key: "preferenciasOperadora", prompt: "Você tem alguma preferência de operadora (Hapvida, Bradesco, etc) ou quer ajuda para escolher?" },
  { key: "condicoesPre", prompt: "Você faz ou precisa de tratamento para alguma condição pré-existente? (diabetes, hipertensão, etc)" },
  { key: "abrangencia", prompt: "Você prefere um plano nacional ou regional?" },
  { key: "redeAmpla", prompt: "Você prefere uma rede ampla de hospitais e clínicas?" },
  { key: "criterioPreco", prompt: "O preço mais barato é um fator decisivo para você?" },
];

export default function ChatInterface({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [chatData, setChatData] = useState<Partial<ChatData>>({});
  const [leadId, setLeadId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createLeadMutation = trpc.leads.create.useMutation();
  const updateLeadMutation = trpc.leads.update.useMutation();
  const addMessageMutation = trpc.leads.addMessage.useMutation();
  const taliaChatMutation = trpc.talia.chat.useMutation();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Iniciar conversa com Tália
    initializeChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = async () => {
    const greeting = "Olá! 👋 Eu sou a Tália, assistente virtual da Talita Motta! 💙 Vou ajudar você a encontrar o melhor plano de saúde. Qual é o seu nome? 😊";
    const initialMessage: Message = {
      id: "1",
      text: greeting,
      sender: "talia",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
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
      // Atualizar dados coletados
      const currentQuestion = INITIAL_QUESTIONS[currentStep];
      const updatedData = {
        ...chatData,
        [currentQuestion.key]: input,
      };
      setChatData(updatedData);

      // Criar lead na primeira mensagem
      if (currentStep === 0 && !leadId) {
        const result = await createLeadMutation.mutateAsync({
          nome: input,
          telefone: "",
          email: "",
        });
        const newLeadId = (result as any)?.insertId || Math.random();
        setLeadId(newLeadId);
      }

      // Salvar mensagem do usuário
      if (leadId) {
        await addMessageMutation.mutateAsync({
          leadId,
          mensagem: input,
          remetente: "usuario",
        });
      }

      // Obter resposta da Tália via OpenRouter
      const allMessages = messages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }));
      allMessages.push({
        role: "user" as const,
        content: input,
      });

      const taliaResponse = await taliaChatMutation.mutateAsync({
        messages: allMessages,
        context: {
          step: currentStep,
          totalSteps: INITIAL_QUESTIONS.length,
        },
      });

      // Próximo step
      const nextStep = currentStep + 1;
      if (nextStep < INITIAL_QUESTIONS.length) {
        setCurrentStep(nextStep);
        const nextQuestion = INITIAL_QUESTIONS[nextStep];
        const taliaMessage: Message = {
          id: Date.now().toString() + "talia",
          text: taliaResponse.message || nextQuestion.prompt,
          sender: "talia",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, taliaMessage]);

        // Salvar mensagem da Tália
        if (leadId) {
          await addMessageMutation.mutateAsync({
            leadId,
            mensagem: taliaResponse.message || nextQuestion.prompt,
            remetente: "talia",
          });
        }
      } else {
        // Finalizar conversa
        if (leadId) {
          await updateLeadMutation.mutateAsync({
            id: leadId,
            data: updatedData as any,
          });
        }

        // Montar mensagem final com todos os dados
        const whatsappMessage = `Olá Talita! Sou ${updatedData.nome}. Gostaria de mais informações sobre planos de saúde. Meus dados:
- Telefone: ${updatedData.telefone}
- Intenção: ${updatedData.intencaoTroca}
- Beneficiário: ${updatedData.beneficiario}
- Idades: ${updatedData.idades}
- Motivo: ${updatedData.motivoBusca}
- Preferência: ${updatedData.preferenciasOperadora}
- Condições: ${updatedData.condicoesPre}
- Abrangência: ${updatedData.abrangencia}
- Rede ampla: ${updatedData.redeAmpla}
- Preço importante: ${updatedData.criterioPreco}`;

        const whatsappUrl = `https://wa.me/5591987654321?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, "_blank");

        const closingMessage: Message = {
          id: Date.now().toString() + "closing",
          text: "Excelente! 🎉 Coletei todas as suas informações. Vou abrir o WhatsApp agora para você falar com a Talita e receber uma proposta personalizada! 💙✨",
          sender: "talia",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, closingMessage]);

        setTimeout(() => {
          onClose();
        }, 2000);
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
