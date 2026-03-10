export type MediaType = 'video' | 'image';

export type FileStatus = 'idle' | 'processing' | 'completed' | 'error';

export interface ConversionFile {
  id: string;
  file: File;
  previewUrl: string;
  type: MediaType;
  status: FileStatus;
  progress: number;
  outputFormat: string;
  outputSettings: OutputSettings;
  resultUrl?: string;
  error?: string;
}

export interface OutputSettings {
  quality: 'low' | 'medium' | 'high' | 'maximum';
  resolution?: '4k' | '1080p' | '720p' | 'original';
  codec?: 'h264' | 'h265' | 'prores';
  bitrate?: string;
  frameRate?: number;
  preserveTransparency: boolean;
  useAiCompression: boolean;
}

export const VALID_IMAGE_FORMATS = ['JPG', 'PNG', 'WebP', 'SVG', 'GIF', 'HEIC'];
export const VALID_VIDEO_FORMATS = ['MP4', 'MKV', 'AVI', 'MOV', 'WebM', 'GIF'];

export const FORMAT_MAP: Record<MediaType, string[]> = {
  image: VALID_IMAGE_FORMATS,
  video: VALID_VIDEO_FORMATS,
};