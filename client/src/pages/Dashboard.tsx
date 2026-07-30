import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { MessageCircle, Phone, Eye, LogOut } from "lucide-react";

interface Lead {
  id: number;
  nome: string;
  telefone: string;
  status: "novo" | "negociacao" | "fechado" | "acompanhamento";
  dataConversa: Date;
  createdAt: Date;
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const leadsQuery = trpc.leads.list.useQuery(undefined, { enabled: isLoggedIn });
  const consultoraLoginMutation = trpc.consultora.login.useMutation();
  const updateStatusMutation = trpc.leads.updateStatus.useMutation();

  useEffect(() => {
    if (leadsQuery.data) {
      setLeads(leadsQuery.data as Lead[]);
      filterLeads(leadsQuery.data as Lead[], searchTerm, statusFilter);
    }
  }, [leadsQuery.data, searchTerm, statusFilter]);

  const filterLeads = (
    leadsToFilter: Lead[],
    search: string,
    status: string
  ) => {
    let filtered = leadsToFilter;

    if (search) {
      filtered = filtered.filter(
        (lead) =>
          lead.nome.toLowerCase().includes(search.toLowerCase()) ||
          lead.telefone.includes(search)
      );
    }

    if (status !== "todos") {
      filtered = filtered.filter((lead) => lead.status === status);
    }

    setFilteredLeads(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterLeads(leads, value, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterLeads(leads, searchTerm, status);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await consultoraLoginMutation.mutateAsync({
        email: loginEmail,
        senha: loginPassword,
      });
      setIsLoggedIn(true);
      setLoginEmail("");
      setLoginPassword("");
    } catch (error) {
      alert("Email ou senha incorretos!");
    }
  };

  const handleUpdateStatus = async (
    leadId: number,
    newStatus: "novo" | "negociacao" | "fechado" | "acompanhamento"
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: leadId,
        status: newStatus,
      });
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
      filterLeads(leads, searchTerm, statusFilter);
    } catch (error) {
      alert("Erro ao atualizar status!");
    }
  };

  const handleWhatsAppContact = (lead: Lead) => {
    const message = `Olá ${lead.nome}! Recebi sua solicitação de informações sobre planos de saúde. Como posso ajudar? 💙`;
    const whatsappUrl = `https://wa.me/${lead.telefone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "novo":
        return "bg-blue-100 text-blue-800";
      case "negociacao":
        return "bg-yellow-100 text-yellow-800";
      case "fechado":
        return "bg-green-100 text-green-800";
      case "acompanhamento":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 border-2 border-primary">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Dashboard Talita Motta
            </h1>
            <p className="text-foreground/70">
              Acesso exclusivo para a consultora
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="seu@email.com"
                className="border-primary/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Senha
              </label>
              <Input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="border-primary/30"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={consultoraLoginMutation.isPending}
            >
              {consultoraLoginMutation.isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-center text-sm text-foreground/60 mt-6">
            Primeiro acesso? Entre em contato com a Talita para criar sua conta.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-primary text-white p-6 border-b border-primary/20">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Leads</h1>
            <p className="text-white/80 mt-1">Gerencie seus contatos e propostas</p>
          </div>
          <Button
            onClick={() => {
              setIsLoggedIn(false);
              setLeads([]);
            }}
            variant="outline"
            className="text-white border-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Novos Contatos",
              value: leads.filter((l) => l.status === "novo").length,
              color: "bg-blue-100 text-blue-800",
            },
            {
              label: "Em Negociação",
              value: leads.filter((l) => l.status === "negociacao").length,
              color: "bg-yellow-100 text-yellow-800",
            },
            {
              label: "Fechados",
              value: leads.filter((l) => l.status === "fechado").length,
              color: "bg-green-100 text-green-800",
            },
            {
              label: "Acompanhamento",
              value: leads.filter((l) => l.status === "acompanhamento").length,
              color: "bg-purple-100 text-purple-800",
            },
          ].map((stat) => (
            <Card key={stat.label} className="p-4 border-2 border-primary/10">
              <p className="text-sm text-foreground/70">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 ${stat.color} inline-block px-3 py-1 rounded`}>
                {stat.value}
              </p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 border-2 border-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Buscar por nome ou telefone
              </label>
              <Input
                placeholder="Digite o nome ou telefone..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="border-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Filtrar por status
              </label>
              <div className="flex gap-2 flex-wrap">
                {["todos", "novo", "negociacao", "fechado", "acompanhamento"].map(
                  (status) => (
                    <Button
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                      variant={statusFilter === status ? "default" : "outline"}
                      size="sm"
                      className={
                        statusFilter === status
                          ? "bg-primary text-white"
                          : "border-primary/30"
                      }
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Leads Table */}
        <Card className="border-2 border-primary/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/5 border-b border-primary/20">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-foreground/60">
                      Nenhum lead encontrado
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-primary/10 hover:bg-primary/5 transition"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {lead.nome}
                      </td>
                      <td className="px-6 py-4 text-foreground/70">{lead.telefone}</td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-foreground/70 text-sm">
                        {new Date(lead.dataConversa).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleWhatsAppContact(lead)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            title="Abrir WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setSelectedLead(lead)}
                            size="sm"
                            variant="outline"
                            className="border-primary/30"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-primary">
                    Detalhes do Lead
                  </h2>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="text-foreground/60 hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-foreground/70">Nome</p>
                      <p className="font-semibold text-foreground">
                        {selectedLead.nome}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70">Telefone</p>
                      <p className="font-semibold text-foreground">
                        {selectedLead.telefone}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-foreground/70 mb-2">Status</p>
                    <div className="flex gap-2 flex-wrap">
                      {["novo", "negociacao", "fechado", "acompanhamento"].map(
                        (status) => (
                          <Button
                            key={status}
                            onClick={() =>
                              handleUpdateStatus(
                                selectedLead.id,
                                status as any
                              )
                            }
                            variant={
                              selectedLead.status === status
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className={
                              selectedLead.status === status
                                ? "bg-primary text-white"
                                : "border-primary/30"
                            }
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleWhatsAppContact(selectedLead)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Abrir WhatsApp
                    </Button>
                    <Button
                      onClick={() => setSelectedLead(null)}
                      variant="outline"
                      className="border-primary/30"
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
