import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  onSubmit?: (username: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

export const LoginForm = ({ onSubmit, isLoading = false, error }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className={cn(
        "w-full max-w-lg glass-card login-fade-in rounded-3xl", // Largura ajustada e bordas mais redondas
        "border-border/50" // Opacidade da borda corrigida
      )}>
        <CardHeader className="space-y-2 text-center p-10 pb-4"> {/* Aumentado espaço e padding */}
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Certificado Digital Novo 
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Entre com suas credenciais do Active Directory
          </CardDescription>
        </CardHeader>

        <CardContent className="px-12 py-10 pt-4"> {/* Padding retangular para harmonia */}
          <form onSubmit={handleSubmit} className="space-y-6"> {/* Espaço entre campos aumentado */}
            <div className="space-y-2 text-left"> {/* Alinhamento da Label */}
              <Label htmlFor="username" className="text-sm font-medium text-foreground">
                Usuário
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={cn(
                    "pl-10 bg-input-bg border-input-border rounded-md", // Borda consistente
                    
                    "transition-all duration-200 h-11" // Altura explícita para consistência
                  )}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2 text-left"> {/* Alinhamento da Label */}
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "pl-10 bg-input-bg border-input-border rounded-md", // Borda consistente
                    "focus:border-input-focus focus:ring-input-focus/20",
                    "transition-all duration-200 h-11" // Altura explícita para consistência
                  )}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-left">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className={cn(
                "w-full bg-primary hover:bg-primary-hover rounded-md h-11", // Borda e altura consistentes
                "text-primary-foreground font-medium text-base",
                "transition-all duration-200 transform",
                "hover:scale-[1.02] active:scale-[0.98]",
                "shadow-lg hover:shadow-xl"
              )}
              disabled={isLoading || !username || !password}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Entrando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  <span>Entrar</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};