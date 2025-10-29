import { useId, useRef, useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Wand2, Move } from 'lucide-react';

export default function ScriptAndStoryboard({ script, setScript, scenes, setScenes, totalDuration, mediaLibrary }) {
  const textareaId = useId();
  const listRef = useRef(null);
  const [draggedId, setDraggedId] = useState(null);

  const addScene = () => {
    const newId = 's' + (Math.random().toString(36).slice(2, 7));
    setScenes(prev => [...prev, { id: newId, title: `Scene ${prev.length + 1}`, description: '', transition: 'fade', duration: 5, media: [], audioId: null }]);
  };

  const removeScene = (id) => {
    setScenes(prev => prev.filter(s => s.id !== id));
  };

  const moveScene = (index, direction) => {
    setScenes(prev => {
      const arr = [...prev];
      const newIndex = direction === 'up' ? Math.max(index - 1, 0) : Math.min(index + 1, arr.length - 1);
      const [item] = arr.splice(index, 1);
      arr.splice(newIndex, 0, item);
      return arr;
    });
  };

  const onDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e, targetId) => {
    e.preventDefault();
    const sourceId = draggedId || e.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetId) return;
    const fromIndex = scenes.findIndex(s => s.id === sourceId);
    const toIndex = scenes.findIndex(s => s.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;
    setScenes(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return arr;
    });
    setDraggedId(null);
  };

  const handleKeyReorder = (e, index) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveScene(index, 'up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveScene(index, 'down');
    }
  };

  const aiAssist = () => {
    const improved = script + '\n\nAI Suggestion:\n- Add an engaging opener.\n- Include a compelling CTA.\n- Balance scene durations to keep pacing.\n- Use visuals to reinforce key points.';
    setScript(improved);
  };

  const updateScene = (id, patch) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  return (
    <section id="editor" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <header className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Script & Storyboard</h2>
        <div className="text-sm text-slate-500" aria-live="polite">Total: {totalDuration}s</div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        <div className="p-4">
          <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700 mb-2">Script</label>
          <textarea
            id={textareaId}
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={16}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            aria-describedby="script-help"
          />
          <div id="script-help" className="mt-2 flex items-center justify-between">
            <p className="text-xs text-slate-500">Write or paste your script. Use AI assist to improve clarity and pacing.</p>
            <button
              onClick={aiAssist}
              className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-3 py-1.5 text-xs font-medium shadow hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
              aria-label="AI assist for script"
              title="AI will suggest enhancements to your script"
            >
              <Wand2 className="w-4 h-4" /> AI Assist
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-700">Storyboard</h3>
            <button onClick={addScene} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400" aria-label="Add scene">
              <Plus className="w-4 h-4" /> Add Scene
            </button>
          </div>

          <ul
            ref={listRef}
            className="space-y-2"
            role="listbox"
            aria-label="Scenes"
          >
            {scenes.map((scene, index) => (
              <li
                key={scene.id}
                role="option"
                aria-selected="false"
                tabIndex={0}
                onKeyDown={(e) => handleKeyReorder(e, index)}
                draggable
                onDragStart={(e) => onDragStart(e, scene.id)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, scene.id)}
                className="group rounded-lg border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                title="Drag to reorder. Use Arrow Up/Down keys for keyboard reordering."
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Move className="w-4 h-4 text-slate-400" aria-hidden />
                    <input
                      value={scene.title}
                      onChange={(e) => updateScene(scene.id, { title: e.target.value })}
                      className="w-48 sm:w-64 rounded-md border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                      aria-label="Scene title"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveScene(index, 'up')} className="p-1 rounded hover:bg-slate-100" aria-label="Move up" title="Move up"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => moveScene(index, 'down')} className="p-1 rounded hover:bg-slate-100" aria-label="Move down" title="Move down"><ChevronDown className="w-4 h-4" /></button>
                    <button onClick={() => removeScene(scene.id)} className="p-1 rounded hover:bg-red-50 text-red-600" aria-label="Delete scene" title="Delete scene"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                    <textarea
                      value={scene.description}
                      onChange={(e) => updateScene(scene.id, { description: e.target.value })}
                      rows={2}
                      className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                      aria-label="Scene description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Transition</label>
                      <select
                        value={scene.transition}
                        onChange={(e) => updateScene(scene.id, { transition: e.target.value })}
                        className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                        aria-label="Scene transition"
                        title="Choose a transition between scenes"
                      >
                        <option value="fade">Fade</option>
                        <option value="slide">Slide</option>
                        <option value="wipe">Wipe</option>
                        <option value="cross-zoom">Cross Zoom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Duration (s)</label>
                      <input
                        type="number"
                        min={1}
                        value={scene.duration}
                        onChange={(e) => updateScene(scene.id, { duration: Number(e.target.value) })}
                        className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                        aria-label="Scene duration in seconds"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Attach Audio</label>
                      <select
                        value={scene.audioId || ''}
                        onChange={(e) => updateScene(scene.id, { audioId: e.target.value || null })}
                        className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                        aria-label="Attach audio to scene"
                      >
                        <option value="">None</option>
                        {mediaLibrary.audios.map(a => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">Media</label>
                      <div className="flex flex-wrap gap-2" aria-live="polite">
                        {scene.media.length === 0 && (
                          <p className="text-xs text-slate-500">No media attached. Use Media panel to assign.</p>
                        )}
                        {scene.media.map((m, i) => (
                          <span key={m.id + i} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-2 py-1 text-xs bg-slate-50">
                            {m.type} · {m.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
