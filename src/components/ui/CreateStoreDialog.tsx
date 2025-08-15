
import { useState } from "react";
import { Button } from "@/components/ui-lojas/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui-lojas/dialog";
import { Input } from "@/components/ui-lojas/input";
import { Label } from "@/components/ui-lojas/label";
import { Switch } from "@/components/ui-lojas/switch";
import type { Store } from "@/pages/Dashboard";

interface CreateStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateStore: (storeData: Omit<Store, "id" | "createdAt">) => void;
}

export function CreateStoreDialog({ open, onOpenChange, onCreateStore }: CreateStoreDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    prazoExpiracao: "",
    notificacaoLojaEnviada: false,
    certificadoRecebido: false,
    enviadoParaFiscal: false,
    instalacaoConcluida: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateStore(formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      name: "",
      code: "",
      prazoExpiracao: "",
      notificacaoLojaEnviada: false,
      certificadoRecebido: false,
      enviadoParaFiscal: false,
      instalacaoConcluida: false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Loja</DialogTitle>
          <DialogDescription>
            Adicione uma nova loja ao sistema.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Loja</Label>
            <Input
              id="name"
              placeholder="Digite o nome da loja"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeCode">Código da Loja</Label>
            <Input
              id="storeCode"
              placeholder="000-0"
              inputMode="numeric"
              maxLength={5}
              pattern="^[0-9]{3}-[0-9]$"
              title="Formato: 3 números, hífen e 1 dígito (ex: 123-4)"
              value={formData.code}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                const left = digits.slice(0, 3);
                const right = digits.slice(3, 4);
                const formatted = right ? `${left}-${right}` : left;
                setFormData({ ...formData, code: formatted });
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prazoExpiracao">Prazo de Expiração</Label>
            <Input
              id="prazoExpiracao"
              type="date"
              value={formData.prazoExpiracao}
              onChange={(e) => setFormData({ ...formData, prazoExpiracao: e.target.value })}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notificacao">Notificação da Loja Enviada</Label>
              <Switch
                id="notificacao"
                checked={formData.notificacaoLojaEnviada}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, notificacaoLojaEnviada: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="certificado">Certificado Recebido</Label>
              <Switch
                id="certificado"
                checked={formData.certificadoRecebido}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, certificadoRecebido: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="fiscal">Enviado para Fiscal</Label>
              <Switch
                id="fiscal"
                checked={formData.enviadoParaFiscal}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, enviadoParaFiscal: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="instalacao">Instalação Concluída</Label>
              <Switch
                id="instalacao"
                checked={formData.instalacaoConcluida}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, instalacaoConcluida: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Loja
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
