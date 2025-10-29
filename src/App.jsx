import { useState, useMemo } from 'react';
import Hero from './components/Hero';
import ScriptAndStoryboard from './components/ScriptAndStoryboard';
import MediaVoicePanel from './components/MediaVoicePanel';
import PreviewExport from './components/PreviewExport';

export default function App() {
  const [script, setScript] = useState(`Title: My AI Script Video\n\nScene 1: Introduce the topic and hook the audience with a question.\nScene 2: Provide key points with supporting visuals.\nScene 3: Summarize and add a call to action.`);

  const [scenes, setScenes] = useState([
    { id: 's1', title: 'Scene 1', description: 'Hook the audience', transition: 'fade', duration: 5, media: [], audioId: null },
    { id: 's2', title: 'Scene 2', description: 'Key points with visuals', transition: 'slide', duration: 7, media: [], audioId: null },
    { id: 's3', title: 'Scene 3', description: 'Summary & CTA', transition: 'cross-zoom', duration: 6, media: [], audioId: null },
  ]);

  const [mediaLibrary, setMediaLibrary] = useState({
    images: [],
    videos: [],
    audios: [],
    logos: [],
  });

  const totalDuration = useMemo(() => scenes.reduce((acc, s) => acc + Number(s.duration || 0), 0), [scenes]);

  const handleAssignMediaToScene = (sceneId, item) => {
    setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, media: [...s.media, item] } : s));
  };

  const handleAssignAudioToScene = (sceneId, audioId) => {
    setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, audioId } : s));
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ScriptAndStoryboard
            script={script}
            setScript={setScript}
            scenes={scenes}
            setScenes={setScenes}
            totalDuration={totalDuration}
            mediaLibrary={mediaLibrary}
          />
          <MediaVoicePanel
            mediaLibrary={mediaLibrary}
            setMediaLibrary={setMediaLibrary}
            scenes={scenes}
            onAssignMedia={handleAssignMediaToScene}
            onAssignAudio={handleAssignAudioToScene}
          />
        </div>

        <PreviewExport
          scenes={scenes}
          mediaLibrary={mediaLibrary}
          totalDuration={totalDuration}
        />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between">
          <p aria-live="polite">Total duration: {totalDuration}s • Scenes: {scenes.length}</p>
          <p className="mt-2 sm:mt-0">Accessible, keyboard-friendly interface with ARIA support</p>
        </div>
      </footer>
    </div>
  );
}
