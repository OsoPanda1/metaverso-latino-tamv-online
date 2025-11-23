import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface AIGuardianStatusProps {
  status?: string;
}

export const AIGuardianStatus = ({ status = 'active' }: AIGuardianStatusProps) => {
  const statusConfig = {
    active: { icon: CheckCircle, color: 'text-green-500', label: 'Guardián Activo' },
    verifying: { icon: Shield, color: 'text-yellow-500', label: 'Verificando' },
    blocked: { icon: AlertTriangle, color: 'text-red-500', label: 'Bloqueado' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 text-sm ${config.color}`}>
      <Icon className="w-4 h-4" />
      <span>{config.label}</span>
    </div>
  );
};
