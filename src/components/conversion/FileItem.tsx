"use client";

import { useState } from "react";
import { ConversionFile, FORMAT_MAP, MediaType } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Settings2, Trash2, CheckCircle2, AlertCircle, Info, FileVideo, FileImage } from "lucide-react";
import Image from "next/image";

interface FileItemProps {
  item: ConversionFile;
  onRemove: (id: string) => void;
  onUpdateFormat: (id: string, format: string) => void;
  onOpenSettings: (id: string) => void;
}

export function FileItem({ item, onRemove, onUpdateFormat, onOpenSettings }: FileItemProps) {
  const isVideo = item.type === 'video';
  const availableFormats = FORMAT_MAP[item.type];

  return (
    <Card className="glass overflow-hidden border-white/5 group transition-all duration-300 hover:border-primary/30">
      <div className="p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Preview / Icon */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-background/50 flex items-center justify-center shrink-0">
          {item.type === 'image' ? (
            <Image 
              src={item.previewUrl} 
              alt={item.file.name} 
              fill 
              className="object-cover" 
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-primary/60">
              <FileVideo className="w-8 h-8" />
              <span className="text-[10px] font-mono">VIDEO</span>
            </div>
          )}
          {item.status === 'completed' && (
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
              <CheckCircle2 className="text-primary w-8 h-8 neon-glow rounded-full bg-background" />
            </div>
          )}
        </div>

        {/* Info & Settings */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <h3 className="text-sm font-medium truncate max-w-[200px]">{item.file.name}</h3>
              <p className="text-xs text-muted-foreground">
                {(item.file.size / (1024 * 1024)).toFixed(2)} MB • {item.file.type.split('/')[1].toUpperCase()}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">TO</span>
                <Select
                  value={item.outputFormat}
                  onValueChange={(val) => onUpdateFormat(item.id, val)}
                  disabled={item.status !== 'idle'}
                >
                  <SelectTrigger className="w-[100px] h-8 text-xs bg-background/30 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/10">
                    {availableFormats.map(f => (
                      <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-primary/20 text-muted-foreground hover:text-primary"
                        onClick={() => onOpenSettings(item.id)}
                        disabled={item.status !== 'idle'}
                      >
                        <Settings2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="glass border-white/10 text-xs">
                      Advanced conversion settings
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => onRemove(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress / Status */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
              <span className={item.status === 'processing' ? 'text-primary' : 'text-muted-foreground'}>
                {item.status === 'idle' && 'Ready to convert'}
                {item.status === 'processing' && 'Processing...'}
                {item.status === 'completed' && 'Conversion complete'}
                {item.status === 'error' && 'Failed'}
              </span>
              <span className="text-muted-foreground">{Math.round(item.progress)}%</span>
            </div>
            <Progress value={item.progress} className="h-1 bg-white/5" />
          </div>
        </div>
      </div>
    </Card>
  );
}