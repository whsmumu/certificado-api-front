import { useState } from "react";
import { Button } from "@/components/ui-lojas/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui-lojas/dialog";
import { Badge } from "@/components/ui-lojas/badge";
import { Checkbox } from "@/components/ui-lojas/checkbox";
import { Input } from "@/components/ui-lojas/input";
import { Label } from "@/components/ui-lojas/label";
import { Separator } from "@/components/ui-lojas/separator";
import { ScrollArea } from "@/components/ui-lojas/scroll-area";
import { CheckCircle, ArrowRight, ArrowLeft, User, Calendar, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Store } from "@/pages/Dashboard";

interface CertificateInstallationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stores: Store[];
  onInstallationComplete: (storeIds: string[]) => void;
}

interface System {
  id: string;
  name: string;
  completed: boolean;
}

const mockSystems: System[] = [
  { id: "1", name: "Sistema de Vendas", completed: false },
  { id: "2", name: "Sistema Fiscal", completed: false },
  { id: "3", name: "Sistema de Estoque", completed: false },
  { id: "4", name: "Sistema de CRM", completed: false },
  { id: "5", name: "Sistema de Relatórios", completed: false },
];

type Step = "selection" | "technician" | "installation";

export function CertificateInstallationModal({ open, onOpenChange, stores, onInstallationComplete }: CertificateInstallationModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("selection");
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [systemStatus, setSystemStatus] = useState<Record<string, System[]>>({});
  const [technician, setTechnician] = useState("");
  const [companions, setCompanions] = useState<string[]>([""]);
  const { toast } = useToast();

  // Filtrar apenas lojas que estão aguardando instalação
  const availableStores = stores.filter(store => 
    store.notificacaoLojaEnviada && 
    store.certificadoRecebido && 
    store.enviadoParaFiscal && 
    !store.instalacaoConcluida
  );

  const handleStoreSelection = (storeId: string, checked: boolean) => {
    if (checked) {
      setSelectedStores([...selectedStores, storeId]);
    } else {
      setSelectedStores(selectedStores.filter(id => id !== storeId));
    }
  };

  const handleNext = () => {
    if (currentStep === "selection") {
      if (selectedStores.length === 0) return;
      setCurrentStep("technician");
      return;
    }

    if (currentStep === "technician") {
      if (!technician.trim()) {
        toast({
          title: "Erro",
          description: "Por favor, informe o nome do técnico responsável.",
          variant: "destructive",
        });
        return;
      }

      // Initialize systems for cada loja selecionada
      const initialSystems: Record<string, System[]> = {};
      selectedStores.forEach((storeId) => {
        initialSystems[storeId] = mockSystems.map((system) => ({ ...system }));
      });
      setSystemStatus(initialSystems);
      setCurrentStep("installation");
    }
  };

  const handleSystemToggle = (storeId: string, systemId: string, completed: boolean) => {
    setSystemStatus(prev => ({
      ...prev,
      [storeId]: prev[storeId].map(system => 
        system.id === systemId ? { ...system, completed } : system
      )
    }));
  };

  const handleFinish = () => {
    if (!technician.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o nome do técnico responsável.",
        variant: "destructive",
      });
      return;
    }

    // Identificar lojas com todas as instalações concluídas
    const completedStores = selectedStores.filter(storeId => {
      const systems = systemStatus[storeId];
      return systems.every(system => system.completed);
    });

    const processData = {
      technician,
      companions: companions.filter((c) => c.trim().length > 0),
      date: new Date().toISOString(),
      stores: selectedStores.map(storeId => {
        const store = stores.find(s => s.id === storeId);
        const systems = systemStatus[storeId];
        const completedSystems = systems.filter(s => s.completed).length;
        return {
          storeId,
          storeName: store?.name,
          systems,
          completedSystems,
          totalSystems: systems.length,
          completed: completedSystems === systems.length
        };
      })
    };

    console.log("Processo de instalação finalizado:", processData);
    
    // Marcar lojas como instalação concluída
    if (completedStores.length > 0) {
      onInstallationComplete(completedStores);
    }
    
    toast({
      title: "Instalação Finalizada!",
      description: `Processo concluído por ${technician}. ${completedStores.length} loja(s) com instalação completa.`,
    });

    // Reset modal
    setCurrentStep("selection");
    setSelectedStores([]);
    setSystemStatus({});
    setTechnician("");
    setCompanions([""]);
    onOpenChange(false);
  };

  const handleBack = () => {
    if (currentStep === "technician") {
      setCurrentStep("selection");
    } else if (currentStep === "installation") {
      setCurrentStep("technician");
    }
  };

  const renderSelectionStep = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">Selecione as Lojas</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Escolha quais lojas receberão a instalação do certificado. Apenas lojas aguardando instalação estão disponíveis.
        </p>
      </div>

      {availableStores.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma loja disponível para instalação.</p>
          <p className="text-sm text-muted-foreground mt-2">
            As lojas precisam ter: notificação enviada, certificado recebido e enviado para fiscal.
          </p>
        </div>
      ) : (
        <>
          <ScrollArea className="h-[300px] w-full border rounded-md p-4">
            <div className="space-y-3">
              {availableStores.map((store) => (
                <div key={store.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={`store-${store.id}`}
                    checked={selectedStores.includes(store.id)}
                    onCheckedChange={(checked) => handleStoreSelection(store.id, !!checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={`store-${store.id}`} className="text-sm font-medium cursor-pointer">
                      {store.name} ({store.code})
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Expira em: {new Date(store.prazoExpiracao).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="warning" className="text-xs">
                      Aguardando Instalação
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator className="my-4" />

          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-muted-foreground">
              {selectedStores.length} de {availableStores.length} lojas selecionadas
            </p>
            <Button 
              onClick={handleNext} 
              disabled={selectedStores.length === 0}
              className="flex items-center gap-2"
            >
              Próximo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderTechnicianStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Equipe Técnica</h3>
          <p className="text-sm text-muted-foreground">
            Informe o técnico responsável e os acompanhantes.
          </p>
        </div>
        <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="technician" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Técnico Responsável *
          </Label>
          <Input
            id="technician"
            placeholder="Digite o nome do técnico"
            value={technician}
            onChange={(e) => setTechnician(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Acompanhamento(s) (Opcional)
          </Label>
          {companions.map((name, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                placeholder={`Nome do acompanhante ${idx + 1}`}
                value={name}
                onChange={(e) => {
                  const next = [...companions];
                  next[idx] = e.target.value;
                  setCompanions(next);
                }}
              />
              {idx === 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCompanions([...companions, ""])}
                  aria-label="Adicionar acompanhante"
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleNext} className="flex items-center gap-2">
          Próximo
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderInstallationStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Progresso da Instalação</h3>
          <p className="text-sm text-muted-foreground">
            Marque os sistemas conforme completar a instalação.
          </p>
        </div>
        <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <ScrollArea className="h-[400px] w-full">
        <div className="space-y-6">
          {selectedStores.map((storeId) => {
            const store = stores.find(s => s.id === storeId);
            const storeSystems = systemStatus[storeId] || [];
            const completedCount = storeSystems.filter(s => s.completed).length;
            const progress = (completedCount / storeSystems.length) * 100;

            return (
              <div key={storeId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">{store?.name}</h4>
                  <Badge 
                    variant={progress === 100 ? "success" : progress > 0 ? "warning" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {progress === 100 && <CheckCircle className="h-3 w-3" />}
                    {completedCount}/{storeSystems.length} Sistemas
                  </Badge>
                </div>

                <div className="space-y-2">
                  {storeSystems.map((system) => (
                    <div key={system.id} className="flex items-center space-x-3 p-2 border rounded">
                      <Checkbox
                        id={`${storeId}-${system.id}`}
                        checked={system.completed}
                        onCheckedChange={(checked) => 
                          handleSystemToggle(storeId, system.id, !!checked)
                        }
                      />
                      <Label 
                        htmlFor={`${storeId}-${system.id}`}
                        className={`flex-1 text-sm cursor-pointer ${
                          system.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {system.name}
                      </Label>
                      {system.completed && (
                        <CheckCircle className="h-4 w-4 text-success" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>


      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleFinish}
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Finalizar Instalação
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Instalação de Certificado
          </DialogTitle>
          <DialogDescription>
            {currentStep === "selection" && "Selecione as lojas para instalar o certificado"}
            {currentStep === "technician" && "Informe o técnico responsável e acompanhantes"}
            {currentStep === "installation" && "Acompanhe o progresso da instalação"}
          </DialogDescription>
        </DialogHeader>

        {currentStep === "selection" && renderSelectionStep()}
        {currentStep === "technician" && renderTechnicianStep()}
        {currentStep === "installation" && renderInstallationStep()}
      </DialogContent>
    </Dialog>
  );
}
