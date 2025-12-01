interface LiveStream {
  viewer_count: number;
  total_earnings: number;
}

interface TamvLiveTickerProps {
  viewers?: number;
  earnings?: number;
  streams?: LiveStream[];
}

export const TamvLiveTicker = ({ viewers = 0, earnings = 0, streams = [] }: TamvLiveTickerProps) => {
  const totalViewers = streams.reduce((acc, s) => acc + s.viewer_count, 0) || viewers;
  const totalEarnings = streams.reduce((acc, s) => acc + s.total_earnings, 0) || earnings;
  return (
    <div className="flex gap-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="font-semibold">{totalViewers} espectadores</span>
      </div>
      <div className="text-muted-foreground">
        ${totalEarnings.toFixed(2)} ganados
      </div>
    </div>
  );
};
