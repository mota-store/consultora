import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { IMAGE_TALIA } from "@/lib/imageConstants";

interface Message {
  id: string;
  text: string;
  sender: "user" | "talia";
  timestamp: Date;
  options?: { label: string; value: string }[];
}

interface ChatData {
  nome: string;
  idade: string;
  temPlano: string;
  intencao: string;
  duvidas: string;
}

const QUESTIONS = [
  { key: "nome", prompt: "Como posso te chamar?" },
  { key: "idade", prompt: "Qual é sua IDADE?" },
  { key: "temPlano", prompt: "Você já tem um plano de saúde?", options: [{ label: "Sim", value: "sim" }, { label: "Não", value: "não" }] },
  { key: "intencao", prompt: "", options: [] }, // Dinâmico baseado em temPlano
  { key: "duvidas", prompt: "Tem alguma DÚVIDA que gostaria de esclarecer?" },
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = async () => {
    const greeting: Message = {
      id: "1",
      text: "Oi! 👋 Eu sou a Tália, assistente da Talita Motta! 💙 Vou ajudar você a encontrar o melhor plano de saúde.",
      sender: "talia",
      timestamp: new Date(),
    };
    setMessages([greeting]);
    
    // Mostrar primeira pergunta
    setTimeout(() => {
      showNextQuestion(0, {});
    }, 500);
  };

  const showNextQuestion = (step: number, currentData: Partial<ChatData>) => {
    if (step >= QUESTIONS.length) {
      // Finalizar conversa
      finishChat(currentData);
      return;
    }

    const question = QUESTIONS[step];
    let prompt = question.prompt;
    let options = question.options || [];

    // Pergunta dinâmica baseada em temPlano
    if (step === 3) { // intencao
      if (currentData.temPlano?.toLowerCase() === "não") {
        prompt = "Você quer COMPRAR um novo plano?";
        options = [{ label: "Sim, comprar", value: "comprar" }];
      } else {
        prompt = "Você quer COMPRAR um novo plano ou TROCAR o atual?";
        options = [
          { label: "Comprar", value: "comprar" },
          { label: "Trocar", value: "trocar" },
        ];
      }
    }

    const dynamicResponses = [
      "Entendi! 🤖",
      "Opa, anotei! 📝",
      "Beleza! 🙏",
      "Perfeito! 🌟",
      "Certo! 💙",
    ];
    const randomResponse = dynamicResponses[Math.floor(Math.random() * dynamicResponses.length)];

    const responseMsg: Message = {
      id: Date.now().toString() + "_response",
      text: randomResponse,
      sender: "talia",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, responseMsg]);

    const msg: Message = {
      id: Date.now().toString(),
      text: prompt,
      sender: "talia",
      timestamp: new Date(),
      options: options.length > 0 ? options : undefined,
    };

    setMessages((prev) => [...prev, msg]);
  };

  const handleOptionClick = async (option: string) => {
    const currentQuestion = QUESTIONS[currentStep];
    const updatedData = {
      ...chatData,
      [currentQuestion.key]: option,
    };
    setChatData(updatedData);

    // Adicionar resposta do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text: option,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Criar lead na primeira mensagem
    if (currentStep === 0 && !leadId) {
      const result = await createLeadMutation.mutateAsync({
        nome: option,
        telefone: "",
        email: "",
      });
      const newLeadId = (result as any)?.insertId || Math.random();
      setLeadId(newLeadId);
    }

    // Salvar mensagem
    if (leadId) {
      await addMessageMutation.mutateAsync({
        leadId,
        mensagem: option,
        remetente: "usuario",
      });
    }

    // Próximo passo
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    
    setTimeout(() => {
      showNextQuestion(nextStep, updatedData);
    }, 500);
  };

  const isValidName = (text: string): boolean => {
    const invalidPatterns = [
      /^(oi|opa|olá|oi tudo|oi tudo bem|tudo bem|e aí|e ai|como vai|como você vai|boa|boa noite|bom dia|boa tarde|boa madrugada|oi talita|oi talia|oi tália|opa boa noite|opa boa|opa bom|opa tudo|me chamo)$/i,
      /^(sim|não|nao|yes|no|ok|okay|tá|ta|certo|claro|beleza|blz)$/i,
      /^\d+\s*(anos?|ano)?$/i,
    ];
    return !invalidPatterns.some(pattern => pattern.test(text.trim()));
  };

  const extractAge = (text: string): string => {
    const match = text.match(/(\d+)/);
    return match ? match[1] : text;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentQuestion = QUESTIONS[currentStep];

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Validar nome na primeira pergunta
    if (currentStep === 0) {
      if (!isValidName(input)) {
        setTimeout(() => {
          const retryMessage: Message = {
            id: Date.now().toString() + "_retry",
            text: "Oi! 🥰 Mas qual é o seu nome mesmo? 😉 Gostaria de saber como te chamar! 💙",
            sender: "talia",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, retryMessage]);
        }, 500);
        return;
      }

      // Nome válido - criar lead
      if (!leadId) {
        const extractedName = input.split(' ')[0].trim() || input.trim();
        const result = await createLeadMutation.mutateAsync({
          nome: extractedName,
          telefone: "",
          email: "",
        });
        const newLeadId = (result as any)?.insertId || Math.random();
        setLeadId(newLeadId);
      }
    }

    let processedInput = input;
    // Extract age if it's the age question
    if (currentStep === 1) {
      processedInput = extractAge(input);
    }

    const updatedData = {
      ...chatData,
      [currentQuestion.key]: processedInput,
    };
    setChatData(updatedData);

    // Salvar mensagem
    if (leadId) {
      await addMessageMutation.mutateAsync({
        leadId,
        mensagem: input,
        remetente: "usuario",
      });
    }

    // Próximo passo
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    
    setTimeout(() => {
      showNextQuestion(nextStep, updatedData);
    }, 500);
  };

  const finishChat = async (finalData: Partial<ChatData>) => {
    if (leadId) {
      await updateLeadMutation.mutateAsync({
        id: leadId,
        data: finalData as any,
      });
    }

    // Montar mensagem final com todos os dados
    const whatsappMessage = `Olá Talita! Sou ${finalData.nome}. Gostaria de mais informações sobre planos de saúde. Meus dados:
- Idade: ${finalData.idade}
- Tem plano: ${finalData.temPlano}
- Intenção: ${finalData.intencao}
- Dúvidas: ${finalData.duvidas}`;

    const whatsappUrl = `https://wa.me/5591983070 32?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank");

    const closingMessage: Message = {
      id: Date.now().toString() + "closing",
      text: "Perfeito! 🎉 Confirmei tudo! Abrindo WhatsApp da Talita agora... 💙",
      sender: "talia",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, closingMessage]);

    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const currentQuestion = QUESTIONS[currentStep];
  const hasOptions = currentQuestion?.options && currentQuestion.options.length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full h-full max-w-2xl max-h-screen flex flex-col bg-background border-2 border-primary shadow-2xl dark:bg-slate-900">
        {/* Header */}
        <div className="bg-primary text-white p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
              <img src={IMAGE_TALIA} alt="Tália" className="w-full h-full object-cover" />
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background dark:bg-slate-800">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs ${msg.sender === "user" ? "bg-primary text-white rounded-br-none" : "bg-primary/10 text-foreground dark:bg-slate-700 dark:text-slate-100 rounded-bl-none border border-primary/20"} px-4 py-2 rounded-lg`}>
                <p className="text-sm">{msg.text}</p>
                {msg.options && msg.options.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.options.map((opt) => (
                      <Button
                        key={opt.value}
                        onClick={() => handleOptionClick(opt.value)}
                        disabled={isLoading}
                        size="sm"
                        className={`w-full ${msg.sender === "user" ? "bg-white/20 hover:bg-white/30" : "bg-primary/20 hover:bg-primary/30 text-foreground"}`}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                )}
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
        {!hasOptions && (
          <form onSubmit={handleSendMessage} className="border-t border-border p-4 flex gap-2 bg-background dark:bg-slate-800 rounded-b-lg">
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
        )}
      </Card>
    </div>
  );
}
