import { useEffect, useRef, useState } from 'react';
import { Upload, Image, Video, Music, Mic, Trash2, Plus } from 'lucide-react';

export default function MediaVoicePanel({ mediaLibrary, setMediaLibrary, scenes, onAssignMedia, onAssignAudio }) {
  const [tab, setTab] = useState('images');
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [currentStream, setCurrentStream] = useState(null);

  useEffect(() => {
    return () => {
      if (currentStream) currentStream.getTracks().forEach(t => t.stop());
    };
  }, [currentStream]);

  const handleFiles = (files, type) => {
    const list = Array.from(files).map((file) => ({ id: crypto.randomUUID(), name: file.name, url: URL.createObjectURL(file), file, type: type.slice(0, -1) }));
    setMediaLibrary(prev => ({ ...prev, [type]: [...prev[type], ...list] }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks = [];
      rec.ondataavailable = e => chunks.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], `voiceover-${Date.now()}.webm`, { type: 'audio/webm' });
        const item = { id: crypto.randomUUID(), name: file.name, url: URL.createObjectURL(file), file, type: 'audio' };
        setMediaLibrary(prev => ({ ...prev, audios: [...prev.audios, item] }));
        setRecording(false);
      };
      rec.start();
      setRecorder(rec);
      setCurrentStream(stream);
      setRecording(true);
    } catch (e) {
      console.error(e);
      alert('Microphone permission is required to record.');
    }
  };

  const stopRecording = () => {
    recorder?.stop();
    currentStream?.getTracks().forEach(t => t.stop());
    setRecorder(null);
    setCurrentStream(null);
  };

  const removeItem = (type, id) => {
    setMediaLibrary(prev => ({ ...prev, [type]: prev[type].filter(x => x.id !== id) }));
  };

  const types = [
    { key: 'images', label: 'Images', icon: Image },
    { key: 'videos', label: 'Video Clips', icon: Video },
    { key: 'audios', label: 'Audio', icon: Music },
    { key: 'logos', label: 'Branding', icon: Plus },
  ];

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <header className="px-4 py-3 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Media & Voiceover</h2>
      </header>

      <div className="px-4 pt-3">
        <div className="flex gap-2 mb-4">
          {types.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm border ${tab === t.key ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
              aria-pressed={tab === t.key}
              aria-controls={`panel-${t.key}`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        {tab !== 'logos' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-700">Upload {tab}</h3>
              <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm hover:bg-slate-50">
                <Upload className="w-4 h-4" /> Upload
              </button>
              <input ref={fileInputRef} type="file" multiple accept={tab === 'images' ? 'image/*' : tab === 'videos' ? 'video/*' : 'audio/*'} className="hidden" onChange={(e) => handleFiles(e.target.files, tab)} />
            </div>
            <div id={`panel-${tab}`} className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="region" aria-label={`${tab} library`}>
              {mediaLibrary[tab].length === 0 && (
                <p className="col-span-full text-sm text-slate-500">No items yet. Upload to add to your library.</p>
              )}
              {mediaLibrary[tab].map(item => (
                <div key={item.id} className="relative rounded-lg border border-slate-200 p-2 group">
                  <div className="text-xs font-medium text-slate-700 truncate" title={item.name}>{item.name}</div>
                  <div className="mt-2 text-xs text-slate-500">{item.type.toUpperCase()}</div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <select
                      className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs focus:outline-none"
                      aria-label="Assign to scene"
                      defaultValue=""
                      onChange={(e) => {
                        const sceneId = e.target.value;
                        if (sceneId) onAssignMedia(sceneId, item);
                        e.target.value = '';
                      }}
                      title="Assign media to a scene"
                    >
                      <option value="">Assign to scene</option>
                      {scenes.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                    <button onClick={() => removeItem(tab, item.id)} className="p-1 rounded hover:bg-red-50 text-red-600" aria-label="Remove item"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'logos' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-700">Branding Assets</h3>
              <button onClick={() => logoInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm hover:bg-slate-50">
                <Upload className="w-4 h-4" /> Upload Logo
              </button>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files, 'logos')} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="region" aria-label="Branding library">
              {mediaLibrary.logos.length === 0 && (
                <p className="col-span-full text-sm text-slate-500">No branding logos. Upload PNG/SVG to add a watermark logo.</p>
              )}
              {mediaLibrary.logos.map(item => (
                <div key={item.id} className="relative rounded-lg border border-slate-200 p-2 group">
                  <div className="text-xs font-medium text-slate-700 truncate" title={item.name}>{item.name}</div>
                  <div className="mt-2 text-xs text-slate-500">LOGO</div>
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <button onClick={() => removeItem('logos', item.id)} className="p-1 rounded hover:bg-red-50 text-red-600" aria-label="Remove logo"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">Voiceover</h3>
            <div className="flex items-center gap-2">
              {!recording ? (
                <button onClick={startRecording} className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-800"><Mic className="w-4 h-4" /> Record</button>
              ) : (
                <button onClick={stopRecording} className="inline-flex items-center gap-2 rounded-md bg-red-600 text-white px-3 py-1.5 text-sm hover:bg-red-500"><Mic className="w-4 h-4" /> Stop</button>
              )}
              <label className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 cursor-pointer" title="Upload voiceover audio">
                <Upload className="w-4 h-4" />
                <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleFiles(e.target.files, 'audios')} />
                Upload
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="region" aria-label="Voiceover library">
            {mediaLibrary.audios.length === 0 && (
              <p className="col-span-full text-sm text-slate-500">No voiceover tracks yet. Record or upload audio files.</p>
            )}
            {mediaLibrary.audios.map(a => (
              <div key={a.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-700 truncate" title={a.name}>{a.name}</div>
                  <button onClick={() => removeItem('audios', a.id)} className="p-1 rounded hover:bg-red-50 text-red-600" aria-label="Remove audio"><Trash2 className="w-4 h-4" /></button>
                </div>
                <audio controls className="mt-2 w-full">
                  <source src={a.url} />
                </audio>
                <div className="mt-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Attach to Scene</label>
                  <select
                    className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs focus:outline-none"
                    defaultValue=""
                    onChange={(e) => {
                      const sceneId = e.target.value;
                      if (sceneId) onAssignAudio(sceneId, a.id);
                      e.target.value = '';
                    }}
                  >
                    <option value="">Select scene</option>
                    {scenes.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
