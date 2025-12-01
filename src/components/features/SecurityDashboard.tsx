import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface SecurityIssue {
  level: "error" | "warn" | "info";
  title: string;
  description: string;
  remediation?: string;
}

export const SecurityDashboard = () => {
  const issues: SecurityIssue[] = [
    {
      level: "error",
      title: "Edge Function Sin Autenticación",
      description: "fraud-detection acepta requests sin JWT",
      remediation: "Habilitar verify_jwt en config.toml",
    },
    {
      level: "warn",
      title: "Datos Públicos Sensibles",
      description: "Tabla artists expone wallet addresses públicamente",
      remediation: "Restringir a usuarios autenticados",
    },
    {
      level: "warn",
      title: "Validación de Entrada Débil",
      description: "Formularios sin esquemas zod",
      remediation: "Implementar validación con zod schemas",
    },
  ];

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "warn":
        return <Info className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "destructive";
      case "warn":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="glass-morph neon-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Security Dashboard - Anubis Sentinel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {issues.map((issue, idx) => (
          <Alert key={idx} className="glass-morph">
            <div className="flex items-start gap-3">
              {getLevelIcon(issue.level)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{issue.title}</h4>
                  <Badge variant={getLevelColor(issue.level) as any}>
                    {issue.level.toUpperCase()}
                  </Badge>
                </div>
                <AlertDescription className="text-sm">
                  {issue.description}
                </AlertDescription>
                {issue.remediation && (
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 {issue.remediation}
                  </p>
                )}
              </div>
            </div>
          </Alert>
        ))}

        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-center">
            🔒 <strong>BookPI Audit System</strong> registra todas las acciones · 
            Trust Envelope garantiza integridad
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
