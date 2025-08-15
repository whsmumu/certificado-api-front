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
        "w-full max-w-md glass-card login-fade-in",
        "border-border/50"
      )}>
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold text-foreground">
            Acesse sua conta
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Entre com suas credenciais LDAP
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
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
                    "pl-10 bg-input-bg border-input-border",
                    "focus:border-input-focus focus:ring-input-focus/20",
                    "transition-all duration-200"
                  )}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
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
                    "pl-10 bg-input-bg border-input-border",
                    "focus:border-input-focus focus:ring-input-focus/20",
                    "transition-all duration-200"
                  )}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}
            
            <Button
              type="submit"
              className={cn(
                "w-full bg-primary hover:bg-primary-hover",
                "text-primary-foreground font-medium",
                "transition-all duration-200 transform",
                "hover:scale-[1.02] active:scale-[0.98]",
                "shadow-lg hover:shadow-xl"
              )}
              disabled={isLoading || !username || !password}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Entrar
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};