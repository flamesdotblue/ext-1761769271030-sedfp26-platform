import { useEffect, useMemo, useState } from 'react';
import { Play, Pause, Download, Settings } from 'lucide-react';
import Modal from './Modal';

export default function PreviewExport({ scenes, mediaLibrary, totalDuration }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [options, setOptions] = useState({
    resolution: '1080p',
    format: 'mp4',
    watermarkText: '',
    logoId: '',
    includeBranding: true,
  });

  const logo = useMemo(() => mediaLibrary.logos.find(l => l.id === options.logoId), [mediaLibrary.logos, options.logoId]);

  useEffect(() => {
    let raf;
    if (isPlaying) {
      const start = performance.now();
      const durationMs = Math.max(totalDuration, 1) * 1000;
      const tick = (t) => {
        const elapsed = (t - start);
        const pct = Math.min(elapsed / durationMs, 1);
        setProgress(pct);
        const index = Math.min(Math.floor(pct * scenes.length), scenes.length - 1);
        setCurrent(index);
        if (pct < 1) raf = requestAnimationFrame(tick); else setIsPlaying(false);
      };
      raf = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, scenes.length, totalDuration]);

  const startExport = () => {
    setShowConfirm(false);
    setExporting(true);
    setProgress(0);
    const total = 3000;
    const t0 = Date.now();
    const int = setInterval(() => {
      const pct = Math.min((Date.now() - t0) / total, 1);
      setProgress(pct);
      if (pct >= 1) {
        clearInterval(int);
        setExporting(false);
        alert(`Export complete: ${options.format.toUpperCase()} ${options.resolution}`);
      }
    }, 50);
  };

  return (
    <section id="preview" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <header className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Preview & Export</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsPlaying(p => !p)} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50" aria-label={isPlaying ? 'Pause preview' : 'Play preview'}>
            {isPlaying ? (<><Pause className="w-4 h-4" /> Pause</>) : (<><Play className="w-4 h-4" /> Play</>)}
          </button>
          <button onClick={() => setShowConfirm(true)} className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-800" title="Export video with selected options">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="p-4 lg:col-span-2">
          <div className="aspect-video w-full rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
            <div className="h-full w-full p-4">
              <div className="h-full w-full rounded-md bg-white border border-slate-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm text-slate-500">Previewing</div>
                  <div className="mt-1 text-lg font-semibold">{scenes[current]?.title || 'No scenes'}</div>
                  <div className="mt-2 text-xs text-slate-500">Transition: {scenes[current]?.transition} • Duration: {scenes[current]?.duration}s</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4" aria-live="polite">
            <div className="w-full h-2 bg-slate-200 rounded" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} title="Preview progress">
              <div className="h-full bg-slate-900 rounded" style={{ width: `${progress * 100}%` }} />
            </div>
            <div className="mt-1 text-xs text-slate-500">{Math.round(progress * 100)}%</div>
          </div>
        </div>

        <div className="p-4 border-t lg:border-t-0 lg:border-l border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-medium text-slate-700">Export Settings</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Resolution</label>
              <select
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                value={options.resolution}
                onChange={(e) => setOptions(o => ({ ...o, resolution: e.target.value }))}
                title="Output resolution"
              >
                <option value="720p">1280×720 (HD)</option>
                <option value="1080p">1920×1080 (Full HD)</option>
                <option value="4k">3840×2160 (4K)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Format</label>
              <select
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                value={options.format}
                onChange={(e) => setOptions(o => ({ ...o, format: e.target.value }))}
                title="File format"
              >
                <option value="mp4">MP4</option>
                <option value="mov">MOV</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Watermark Text</label>
              <input
                type="text"
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                value={options.watermarkText}
                onChange={(e) => setOptions(o => ({ ...o, watermarkText: e.target.value }))}
                placeholder="e.g., © My Brand"
                title="Optional watermark text"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Logo Watermark</label>
              <select
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                value={options.logoId}
                onChange={(e) => setOptions(o => ({ ...o, logoId: e.target.value }))}
                title="Select a branding logo uploaded in Media"
              >
                <option value="">None</option>
                {mediaLibrary.logos.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              {logo && (
                <div className="mt-2 text-xs text-slate-500">Selected: {logo.name}</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input id="include-branding" type="checkbox" checked={options.includeBranding} onChange={(e) => setOptions(o => ({ ...o, includeBranding: e.target.checked }))} className="rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
              <label htmlFor="include-branding" className="text-sm text-slate-700">Include branding in export</label>
            </div>

            <button onClick={() => setShowConfirm(true)} className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 text-white px-3 py-2 text-sm hover:bg-slate-800">
              <Download className="w-4 h-4" /> Export Video
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Export"
        actions={
          <>
            <button onClick={() => setShowConfirm(false)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">Cancel</button>
            <button onClick={startExport} className="rounded-md bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-800">Export</button>
          </>
        }
      >
        <p className="text-sm text-slate-700">Export your video with the following options:</p>
        <ul className="mt-2 text-sm text-slate-600 list-disc pl-5 space-y-1">
          <li>Resolution: {options.resolution.toUpperCase ? options.resolution.toUpperCase() : options.resolution}</li>
          <li>Format: {options.format.toUpperCase()}</li>
          <li>Watermark: {options.watermarkText ? options.watermarkText : 'None'}</li>
          <li>Logo: {logo ? logo.name : 'None'}</li>
        </ul>
      </Modal>

      {exporting && (
        <div className="px-4 pb-4">
          <div className="mt-2 w-full h-2 bg-slate-200 rounded" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} title="Export progress">
            <div className="h-full bg-slate-900 rounded" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="mt-1 text-xs text-slate-500">Exporting... {Math.round(progress * 100)}%</div>
        </div>
      )}
    </section>
  );
}
