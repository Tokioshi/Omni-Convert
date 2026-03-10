
import { Uploader } from "@/components/conversion/Uploader";
import { Toaster } from "@/components/ui/toaster";
import { Zap, Shield, Cpu, Activity, Globe, Rocket } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-start py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] opacity-20" />
        <div className="absolute top-[40%] right-[20%] w-[200px] h-[200px] bg-primary/5 rounded-full blur-[80px] opacity-10 animate-pulse-subtle" />
      </div>

      {/* Header */}
      <header className="w-full max-w-5xl px-4 flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center neon-glow group-hover:rotate-12 transition-transform duration-500">
            <Zap className="text-white fill-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white">
              OMNICONVERT <span className="text-primary italic">PRO</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                Universal Media Engine v2.0
              </p>
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors cursor-help group">
              <Shield className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" /> 
              <span>Private & Secure</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors cursor-help group">
              <Cpu className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" /> 
              <span>AI Optimized</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors cursor-help group">
              <Activity className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" /> 
              <span>GPU Accelerated</span>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <Uploader />

      {/* Features Grid - Only visible when needed or as a footer element */}
      <section className="w-full max-w-5xl px-4 mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <div className="glass p-6 rounded-2xl space-y-3 hover:border-primary/20 transition-colors group">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-bold text-sm">Universal Support</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Convert between 50+ media formats including high-efficiency HEVC and Apple ProRes.
          </p>
        </div>
        <div className="glass p-6 rounded-2xl space-y-3 hover:border-primary/20 transition-colors group">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-bold text-sm">Real-time Processing</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Blazing fast client-side conversion. Your files never leave your device for standard tasks.
          </p>
        </div>
        <div className="glass p-6 rounded-2xl space-y-3 hover:border-primary/20 transition-colors group">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-bold text-sm">AI Enhancement</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Leverage Google Gemini for intelligent image compression and artifact removal.
          </p>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="w-full max-w-5xl px-4 mt-20 mb-8 py-8 border-t border-white/5 text-center">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold">
          OmniConvert Pro • Enterprise Grade Media Conversion • Powered by AI
        </p>
      </footer>
      
      <Toaster />
    </main>
  );
}
