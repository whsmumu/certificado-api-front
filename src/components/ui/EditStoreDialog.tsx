import { useState } from "react";
import { Button } from "@/components/ui-lojas/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui-lojas/dialog";
import { Input } from "@/components/ui-lojas/input";
import { Label } from "@/components/ui-lojas/label";
import { Switch } from "@/components/ui-lojas/switch";
import type { Store } from "@/pages/Dashboard";

interface EditStoreDialogProps {
  store: Store;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (storeData: Partial<Store>) => void;
}

export function EditStoreDialog({ store, open, onOpenChange, onSave }: EditStoreDialogProps) {
  const [formData, setFormData] = useState({
    name: store.name,
    prazoExpiracao: store.prazoExpiracao,
    notificacaoLojaEnviada: store.notificacaoLojaEnviada,
    certificadoRecebido: store.certificadoRecebido,
    enviadoParaFiscal: store.enviadoParaFiscal,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Loja</DialogTitle>
          <DialogDescription>
            Atualize as informações da loja "{store.name}".
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Loja</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}