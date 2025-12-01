import { Badge } from "@/components/ui/badge";

interface TamvChannelsInCommonProps {
  channels?: string[];
}

export const TamvChannelsInCommon = ({ channels = [] }: TamvChannelsInCommonProps) => {
  if (channels.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">Canales en común</h3>
      <div className="flex flex-wrap gap-2">
        {channels.map((channel, i) => (
          <Badge key={i} variant="outline">{channel}</Badge>
        ))}
      </div>
    </div>
  );
};
