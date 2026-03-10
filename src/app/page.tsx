import { Uploader } from "@/components/conversion/Uploader";
import { Toaster } from "@/components/ui/toaster";
import { Zap, Shield, Cpu, Activity } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-start py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] opacity-20" />
      </div>

      {/* Header */}
      <header className="w-full max-w-5xl px-4 flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center neon-glow group-hover:rotate-12 transition-transform">
            <Zap className="text-white fill-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white">
              OMNICONVERT <span className="text-primary italic">PRO</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
              Universal Media Engine
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors">
              <Shield className="w-3.5 h-3.5 text-primary" /> 100% Secure
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors">
              <Cpu className="w-3.5 h-3.5 text-primary" /> AI Powered
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors">
              <Activity className="w-3.5 h-3.5 text-primary" /> High Performance
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <Uploader />

      {/* Footer Info */}
      <footer className="w-full max-w-5xl px-4 mt-12 py-8 border-t border-white/5 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} OmniConvert Pro Suite. High-fidelity cloud processing for modern creators.
        </p>
      </footer>
      
      <Toaster />
    </main>
  );
}