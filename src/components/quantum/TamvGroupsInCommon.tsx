import { Badge } from "@/components/ui/badge";

interface TamvGroupsInCommonProps {
  groups?: string[];
}

export const TamvGroupsInCommon = ({ groups = [] }: TamvGroupsInCommonProps) => {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Grupos en común</h3>
      <div className="flex flex-wrap gap-2">
        {groups.map((group, i) => (
          <Badge key={i} variant="secondary">{group}</Badge>
        ))}
      </div>
    </div>
  );
};
