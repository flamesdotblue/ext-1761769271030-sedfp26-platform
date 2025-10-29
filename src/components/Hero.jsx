import Spline from '@splinetool/react-spline';
import { Rocket } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full h-[420px] overflow-hidden bg-gradient-to-b from-white to-slate-50">
      <div className="absolute inset-0" aria-hidden>
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white pointer-events-none" aria-hidden></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900">Design and export script videos with AI assistance</h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">Drag-and-drop scenes, manage media and voiceovers, and preview/export in multiple formats. Clean, modern, and accessible UI for desktop and tablet.</p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="#editor"
              className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-4 py-2 text-sm font-medium shadow hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              <Rocket className="w-4 h-4" /> Start Building
            </a>
            <a
              href="#preview"
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 text-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Preview
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
