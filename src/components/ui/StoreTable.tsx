
import { useState } from "react";
import { Edit, Trash2, Calendar, CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui-lojas/button";
import { Badge } from "@/components/ui-lojas/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui-lojas/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EditStoreDialog } from "@/components/ui/EditStoreDialog";
import type { Store } from "@/pages/Dashboard";

interface StoreTableProps {
  stores: Store[];
  onEdit: (id: string, storeData: Partial<Store>) => void;
  onDelete: (id: string) => void;
}

export function StoreTable({ stores, onEdit, onDelete }: StoreTableProps) {
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getExpirationStatus = (prazoExpiracao: string) => {
    const today = new Date();
    const expiration = new Date(prazoExpiracao);
    const diffDays = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: "expired", label: "Expirado", variant: "destructive" as const };
    } else if (diffDays <= 30) {
      return { status: "warning", label: `${diffDays} dias`, variant: "warning" as const };
    } else {
      return { status: "valid", label: `${diffDays} dias`, variant: "secondary" as const };
    }
  };

  const getOverallStatus = (store: Store) => {
    const { notificacaoLojaEnviada, certificadoRecebido, enviadoParaFiscal, instalacaoConcluida } = store;
    
    // Se todos os processos estão concluídos
    if (notificacaoLojaEnviada && certificadoRecebido && enviadoParaFiscal && instalacaoConcluida) {
      return { 
        status: "concluido", 
        label: "Concluído", 
        variant: "success" as const,
        icon: CheckCircle
      };
    }
    
    // Se todos os processos automáticos estão concluídos, mas aguarda instalação manual
    if (notificacaoLojaEnviada && certificadoRecebido && enviadoParaFiscal && !instalacaoConcluida) {
      return { 
        status: "aguardando", 
        label: "Aguardando Instalação", 
        variant: "warning" as const,
        icon: Clock
      };
    }
    
    // Se algum processo anterior ainda não foi concluído
    return { 
      status: "pendente", 
      label: "Pendente", 
      variant: "secondary" as const,
      icon: XCircle
    };
  };

  const StatusBadge = ({ value, trueLabel, falseLabel }: { value: boolean; trueLabel: string; falseLabel: string }) => (
    <Badge variant={value ? "success" : "secondary"} className="flex items-center gap-1">
      {value ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {value ? trueLabel : falseLabel}
    </Badge>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loja</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Prazo Expiração</TableHead>
              <TableHead>Notificação Enviada</TableHead>
              <TableHead>Certificado Recebido</TableHead>
              <TableHead>Enviado para Fiscal</TableHead>
              <TableHead>Instalação Concluída</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => {
              const expiration = getExpirationStatus(store.prazoExpiracao);
              const overallStatus = getOverallStatus(store);
              const StatusIcon = overallStatus.icon;
              
              return (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell>{store.code}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(store.prazoExpiracao)}
                      </div>
                      <Badge variant={expiration.variant} className="w-fit text-xs">
                        {expiration.status === "expired" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {expiration.label}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge 
                      value={store.notificacaoLojaEnviada}
                      trueLabel="Enviada"
                      falseLabel="Pendente"
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge 
                      value={store.certificadoRecebido}
                      trueLabel="Recebido"
                      falseLabel="Aguardando"
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge 
                      value={store.enviadoParaFiscal}
                      trueLabel="Enviado"
                      falseLabel="Pendente"
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge 
                      value={store.instalacaoConcluida}
                      trueLabel="Concluída"
                      falseLabel="Pendente"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingStore(store)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a loja "{store.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => onDelete(store.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {editingStore && (
        <EditStoreDialog
          store={editingStore}
          open={!!editingStore}
          onOpenChange={(open) => !open && setEditingStore(null)}
          onSave={(storeData) => {
            onEdit(editingStore.id, storeData);
            setEditingStore(null);
          }}
        />
      )}
    </div>
  );
}
