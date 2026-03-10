"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ConversionFile, OutputSettings } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Video, Image as ImageIcon, Zap } from "lucide-react";

interface SettingsDialogProps {
  item: ConversionFile | null;
  onClose: () => void;
  onSave: (id: string, settings: OutputSettings) => void;
}

export function SettingsDialog({ item, onClose, onSave }: SettingsDialogProps) {
  if (!item) return null;

  const isVideo = item.type === 'video';

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const settings: OutputSettings = {
      ...item.outputSettings,
      quality: formData.get('quality') as any,
      resolution: formData.get('resolution') as any,
      codec: formData.get('codec') as any,
      useAiCompression: formData.get('useAiCompression') === 'on',
      preserveTransparency: formData.get('preserveTransparency') === 'on',
    };
    onSave(item.id, settings);
    onClose();
  };

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="glass border-white/10 sm:max-w-[425px] text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {isVideo ? <Video className="text-primary w-5 h-5" /> : <ImageIcon className="text-primary w-5 h-5" />}
            Advanced Settings
          </DialogTitle>
          <p className="text-xs text-muted-foreground truncate">Configuring: {item.file.name}</p>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-6 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="quality" className="text-sm">Output Quality</Label>
              <Select name="quality" defaultValue={item.outputSettings.quality}>
                <SelectTrigger className="bg-background/50 border-white/10">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent className="glass border-white/10">
                  <SelectItem value="low">Low (Fastest)</SelectItem>
                  <SelectItem value="medium">Medium (Standard)</SelectItem>
                  <SelectItem value="high">High (Retain Detail)</SelectItem>
                  <SelectItem value="maximum">Maximum (Ultra)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isVideo && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="resolution" className="text-sm">Resolution</Label>
                  <Select name="resolution" defaultValue={item.outputSettings.resolution}>
                    <SelectTrigger className="bg-background/50 border-white/10">
                      <SelectValue placeholder="Target resolution" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      <SelectItem value="original">Original</SelectItem>
                      <SelectItem value="4k">4K Ultra HD</SelectItem>
                      <SelectItem value="1080p">1080p Full HD</SelectItem>
                      <SelectItem value="720p">720p HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codec" className="text-sm">Video Codec</Label>
                  <Select name="codec" defaultValue={item.outputSettings.codec}>
                    <SelectTrigger className="bg-background/50 border-white/10">
                      <SelectValue placeholder="Select codec" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      <SelectItem value="h264">H.264 (MP4 Universal)</SelectItem>
                      <SelectItem value="h265">H.265 (HEVC High Efficiency)</SelectItem>
                      <SelectItem value="prores">Apple ProRes (Production)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {!isVideo && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="space-y-0.5">
                  <Label htmlFor="useAiCompression" className="flex items-center gap-1.5 text-sm font-semibold">
                    <Sparkles className="w-4 h-4 text-accent" />
                    AI Smart Compression
                  </Label>
                  <p className="text-[10px] text-muted-foreground">Utilize Gemini to optimize file size without quality loss.</p>
                </div>
                <Switch id="useAiCompression" name="useAiCompression" defaultChecked={item.outputSettings.useAiCompression} />
              </div>
            )}

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="preserveTransparency" className="text-sm">Preserve Transparency</Label>
                <p className="text-[10px] text-muted-foreground">Keep alpha channel if available.</p>
              </div>
              <Switch id="preserveTransparency" name="preserveTransparency" defaultChecked={item.outputSettings.preserveTransparency} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} className="border-white/5">Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/80 text-white neon-glow">
              Apply Settings
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}