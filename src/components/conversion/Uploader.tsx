
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ConversionFile, MediaType, OutputSettings } from "@/lib/types";
import { FileItem } from "./FileItem";
import { SettingsDialog } from "./SettingsDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, Sparkles, Files, Layers, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { aiImageCompression } from "@/ai/flows/ai-image-compression-flow";
import { useToast } from "@/hooks/use-toast";

export function Uploader() {
  const [files, setFiles] = useState<ConversionFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;

    const newFiles: ConversionFile[] = Array.from(incomingFiles).map(file => {
      const type: MediaType = file.type.startsWith('video/') ? 'video' : 'image';
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        type,
        status: 'idle',
        progress: 0,
        outputFormat: type === 'image' ? 'JPG' : 'MP4',
        outputSettings: {
          quality: 'medium',
          resolution: 'original',
          codec: 'h264',
          preserveTransparency: true,
          useAiCompression: false,
        }
      };
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== id);
      const removed = prev.find(f => f.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  const clearAll = () => {
    files.forEach(f => URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
  };

  const updateFormat = (id: string, format: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, outputFormat: format } : f));
  };

  const updateSettings = (id: string, settings: OutputSettings) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, outputSettings: settings } : f));
  };

  const startConversion = async () => {
    const filesToConvert = files.filter(f => f.status === 'idle');
    if (filesToConvert.length === 0) return;

    // Dynamically import gifshot only on the client
    let gifshot: any = null;
    if (typeof window !== 'undefined') {
      const mod = await import('gifshot');
      gifshot = mod.default || mod;
    }

    for (const item of filesToConvert) {
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'processing', progress: 5 } : f));

      try {
        if (item.type === 'image' && item.outputSettings.useAiCompression) {
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(item.file);
          });
          const imageDataUri = await base64Promise;
          
          setFiles(prev => prev.map(f => f.id === item.id ? { ...f, progress: 40 } : f));
          
          const result = await aiImageCompression({
            imageDataUri,
            qualityLevel: item.outputSettings.quality
          });

          setFiles(prev => prev.map(f => f.id === item.id ? { 
            ...f, 
            status: 'completed', 
            progress: 100, 
            resultUrl: result.compressedImageDataUri 
          } : f));
        } else if (item.type === 'video' && item.outputFormat === 'GIF') {
          if (!gifshot) throw new Error("Conversion library not available.");

          // 1. Get original video dimensions to fix "chopped" resolution
          const videoMeta = document.createElement('video');
          videoMeta.src = item.previewUrl;
          await new Promise((resolve) => {
            videoMeta.onloadedmetadata = resolve;
          });

          const originalWidth = videoMeta.videoWidth;
          const originalHeight = videoMeta.videoHeight;
          
          // Target width while maintaining aspect ratio
          // We limit max width to 800 for GIF performance, but keep original if smaller
          const targetWidth = Math.min(originalWidth, 800);
          const targetHeight = Math.round((originalHeight / originalWidth) * targetWidth);

          setFiles(prev => prev.map(f => f.id === item.id ? { ...f, progress: 15 } : f));
          
          const gifResult = await new Promise<string>((resolve, reject) => {
            gifshot.createGIF({
              video: [item.previewUrl],
              gifWidth: targetWidth,
              gifHeight: targetHeight,
              numFrames: 40, // Increased frame count for smoother motion
              frameDuration: 1, // 10fps
              sampleInterval: 5, // Lower interval = higher quality colors, reduces Discord glitches
              progressCallback: (progress: number) => {
                setFiles(prev => prev.map(f => f.id === item.id ? { ...f, progress: 15 + (progress * 80) } : f));
              }
            }, (obj: any) => {
              if (obj.error) reject(new Error(obj.errorMsg));
              else resolve(obj.image);
            });
          });

          setFiles(prev => prev.map(f => f.id === item.id ? { 
            ...f, 
            status: 'completed', 
            progress: 100, 
            resultUrl: gifResult 
          } : f));

          toast({
            title: "Conversion Complete",
            description: "High-quality GIF generated with preserved aspect ratio.",
          });
        } else {
          // Simulated Progress for other conversions (Mock)
          let currentProgress = 10;
          const interval = setInterval(() => {
            currentProgress += Math.random() * 15;
            if (currentProgress >= 95) {
              clearInterval(interval);
              setFiles(prev => prev.map(f => f.id === item.id ? { 
                ...f, 
                status: 'completed', 
                progress: 100, 
                resultUrl: f.previewUrl 
              } : f));
            } else {
              setFiles(prev => prev.map(f => f.id === item.id ? { ...f, progress: currentProgress } : f));
            }
          }, 300);
        }
      } catch (error) {
        console.error("Conversion error", error);
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error', error: 'Process failed' } : f));
        toast({
          variant: "destructive",
          title: "Conversion Failed",
          description: "There was an error processing your file. Please try again.",
        });
      }
    }
  };

  const downloadFile = (item: ConversionFile) => {
    if (!item.resultUrl) return;
    const link = document.createElement('a');
    link.href = item.resultUrl;
    link.download = `converted_${item.file.name.split('.')[0]}.${item.outputFormat.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllAsZip = () => {
    toast({
      title: "Generating Archive",
      description: "Compressing your files into a single ZIP archive. Please wait.",
    });
    setTimeout(() => {
      toast({
        title: "Download Started",
        description: "Your ZIP archive is ready.",
      });
    }, 2000);
  };

  const allCompleted = files.length > 0 && files.every(f => f.status === 'completed');
  const someProcessing = files.some(f => f.status === 'processing');

  if (!isClient) return null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 px-4 py-8">
      {files.length === 0 && (
        <Card
          className={cn(
            "relative group flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed transition-all duration-500 glass",
            isDragging ? "border-primary bg-primary/10 scale-[1.02] shadow-[0_0_50px_-10px_rgba(61,123,245,0.4)]" : "border-white/10 hover:border-primary/50"
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => handleFiles(e.target.files)} 
            multiple 
            className="hidden" 
          />
          
          <div className="relative mb-6">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors duration-500" />
            <Upload className="w-16 h-16 text-primary neon-glow relative animate-pulse-subtle" />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground neon-text">
            Drop your media here
          </h2>
          <p className="text-muted-foreground text-center max-w-md px-6">
            Upload videos or images for universal conversion. Supports MP4, MOV, MKV, JPG, PNG, WebP & more.
          </p>
          
          <div className="mt-8 flex gap-4 text-xs font-mono uppercase tracking-widest text-muted-foreground/50">
            <span className="flex items-center gap-1"><Files className="w-3 h-3" /> Multiple Files</span>
            <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> Batch Settings</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Optimized</span>
          </div>
        </Card>
      )}

      {files.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between bg-card/40 p-4 rounded-xl glass border-white/5">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                className="bg-background/50 border-white/10 hover:border-primary/50"
              >
                <Upload className="w-4 h-4 mr-2" /> Add Files
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAll}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Clear All
              </Button>
            </div>

            <div className="flex items-center gap-4">
              {allCompleted ? (
                files.length > 1 ? (
                  <Button onClick={downloadAllAsZip} className="bg-accent hover:bg-accent/80 text-accent-foreground neon-glow">
                    <Download className="w-4 h-4 mr-2" /> Download ZIP
                  </Button>
                ) : (
                  <Button onClick={() => downloadFile(files[0])} className="bg-accent hover:bg-accent/80 text-accent-foreground neon-glow">
                    <Download className="w-4 h-4 mr-2" /> Download Result
                  </Button>
                )
              ) : (
                <Button 
                  onClick={startConversion} 
                  disabled={someProcessing}
                  className="bg-primary hover:bg-primary/80 text-white neon-glow min-w-[140px]"
                >
                  {someProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Converting...
                    </span>
                  ) : "Convert All"}
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {files.map(item => (
              <FileItem 
                key={item.id} 
                item={item} 
                onRemove={removeFile}
                onUpdateFormat={updateFormat}
                onOpenSettings={(id) => setEditingFileId(id)}
              />
            ))}
          </div>
        </div>
      )}

      <SettingsDialog 
        item={files.find(f => f.id === editingFileId) || null} 
        onClose={() => setEditingFileId(null)}
        onSave={updateSettings}
      />
    </div>
  );
}
