import { useState, useEffect } from "react";
import { Plus, Play, Calendar, CheckCircle, XCircle, History, User, Users, Store as StoreIcon } from "lucide-react";
import { Button } from "@/components/ui-lojas/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-lojas/card";
import { Badge } from "@/components/ui-lojas/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-lojas/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui-lojas/table";
import { StoreTable } from "@/components/ui/StoreTable";
import { CreateStoreDialog } from "@/components/ui/CreateStoreDialog";
import { CertificateInstallationModal } from "@/components/ui/CertificateInstallationModal";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

export interface Store {
  id: string;
  name: string;
  code: string;
  prazoExpiracao: string;
  notificacaoLojaEnviada: boolean;
  certificadoRecebido: boolean;
  enviadoParaFiscal: boolean;
  instalacaoConcluida: boolean;
  createdAt: string;
}

export interface InstallationHistory {
  id: string;
  date: string;
  technician: string;
  supervisor?: string;
  stores: string[];
  storeNames: string[];
  status: "completed" | "in-progress" | "cancelled";
}

const mockInstallationHistory: InstallationHistory[] = [];

const Dashboard = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [installationHistory, setInstallationHistory] = useState<InstallationHistory[]>(mockInstallationHistory);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isInstallationModalOpen, setIsInstallationModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/lojas'); // Ajuste o endpoint se necessário
        setStores(response.data);
      } catch (error) {
        console.error("Falha ao buscar lojas:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível buscar a lista de lojas do servidor.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStores();
  }, [toast]);

  const handleCreateStore = async (storeData: Omit<Store, "id" | "createdAt">) => {
    try {
      const response = await api.post('/lojas', storeData);
      const newStore = response.data;
      setStores(prevStores => [...prevStores, newStore]);
      toast({
        title: "Loja criada com sucesso!",
        description: `A loja ${newStore.name} foi adicionada ao sistema.`,
      });
    } catch (error) {
      console.error("Falha ao criar loja:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a nova loja.",
        variant: "destructive",
      });
    }
  };

  const handleEditStore = async (id: string, storeData: Partial<Store>) => {
    try {
      const response = await api.put(`/lojas/${id}`, storeData);
      const updatedStore = response.data;
      setStores(stores.map(store =>
        store.id === id ? updatedStore : store
      ));
      toast({
        title: "Loja atualizada!",
        description: "As informações da loja foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Falha ao editar loja:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as informações da loja.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStore = async (id: string) => {
    const storeName = stores.find(s => s.id === id)?.name || "a loja";
    try {
      await api.delete(`/lojas/${id}`);
      setStores(stores.filter(store => store.id !== id));
      toast({
        title: "Loja excluída!",
        description: `A loja ${storeName} foi removida do sistema.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Falha ao deletar loja:", error);
      toast({
        title: "Erro",
        description: `Não foi possível remover ${storeName}.`,
        variant: "destructive",
      });
    }
  };

  const handleInstallationComplete = (storeIds: string[]) => {
    setStores(stores.map(store =>
      storeIds.includes(store.id)
        ? { ...store, instalacaoConcluida: true }
        : store
    ));
  };

  const getStatusStats = () => {
    const total = stores.length;
    const today = new Date();
    const expired = stores.filter(s => new Date(s.prazoExpiracao) < today).length;
    const expiringSoon = stores.filter(s => {
      const expiration = new Date(s.prazoExpiracao);
      const diffDays = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30;
    }).length;
    const awaitingInstallation = stores.filter(s =>
      s.notificacaoLojaEnviada && s.certificadoRecebido && s.enviadoParaFiscal && !s.instalacaoConcluida
    ).length;
    const completed = stores.filter(s =>
      s.notificacaoLojaEnviada && s.certificadoRecebido && s.enviadoParaFiscal && s.instalacaoConcluida
    ).length;
    const pendingProcesses = stores.filter(s =>
      !s.notificacaoLojaEnviada || !s.certificadoRecebido || !s.enviadoParaFiscal
    ).length;
    return { total, expired, expiringSoon, awaitingInstallation, completed, pendingProcesses };
  };

  const stats = getStatusStats();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Carregando informações do sistema...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <StoreIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard de Lojas</h1>
              <p className="text-muted-foreground">Gerencie suas lojas e certificados</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Loja
            </Button>
            <Button variant="outline" onClick={() => setIsInstallationModalOpen(true)} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Iniciar Instalação do Certificado
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Lojas</CardTitle>
              <StoreIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.expired}</div>
              <p className="text-xs text-muted-foreground">certificados expirados</p>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas do Vencimento</CardTitle>
              <Calendar className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.expiringSoon}</div>
              <p className="text-xs text-muted-foreground">vencem em 30 dias</p>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aguardando Instalação</CardTitle>
              <Play className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.awaitingInstallation}</div>
              <p className="text-xs text-muted-foreground">prontas para instalar</p>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">totalmente finalizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="stores" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stores" className="flex items-center gap-2">
              <StoreIcon className="h-4 w-4" />
              Lojas Cadastradas
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Histórico de Instalações
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stores" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Lojas Cadastradas</CardTitle>
                <CardDescription>Visualize e gerencie todas as suas lojas</CardDescription>
              </CardHeader>
              <CardContent>
                <StoreTable stores={stores} onEdit={handleEditStore} onDelete={handleDeleteStore} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Instalações</CardTitle>
                <CardDescription>Acompanhe todas as instalações de certificados realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Técnico</TableHead>
                      <TableHead>Acompanhamento</TableHead>
                      <TableHead>Lojas</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {installationHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(record.date).toLocaleDateString("pt-BR")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {record.technician}
                          </div>
                        </TableCell>
                        <TableCell>
                          {record.supervisor ? (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {record.supervisor}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {record.storeNames.map((storeName, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {storeName}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={record.status === "completed" ? "success" : record.status === "in-progress" ? "warning" : "destructive"}>
                            {record.status === "completed" ? "Concluído" : record.status === "in-progress" ? "Em Andamento" : "Cancelado"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <CreateStoreDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateStore={handleCreateStore}
        />
        <CertificateInstallationModal
          open={isInstallationModalOpen}
          onOpenChange={setIsInstallationModalOpen}
          stores={stores}
          onInstallationComplete={handleInstallationComplete}
        />
      </div>
    </div>
  );
};

export default Dashboard;