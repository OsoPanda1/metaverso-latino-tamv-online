import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilePreviewProps {
  file: string;
  onRemove?: () => void;
}

export const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  return (
    <div className="relative inline-block">
      <img src={file} alt="Preview" className="w-20 h-20 object-cover rounded" />
      {onRemove && (
        <Button
          size="sm"
          variant="destructive"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
          onClick={onRemove}
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};
