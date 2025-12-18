'use client'

import { PRESETS, PresetType } from '@/lib/constants'

interface PresetSelectorProps {
  selectedPreset: PresetType
  onPresetChange: (preset: PresetType) => void
}

export default function PresetSelector({ selectedPreset, onPresetChange }: PresetSelectorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
      <div className="mb-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-purple mb-2">
          How Do You Want to Play?
        </h2>
        <p className="text-lg text-navy">
          Choose a spending style, or customize everything yourself
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Go Large */}
        <button
          onClick={() => onPresetChange('go-large')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            selectedPreset === 'go-large'
              ? 'border-primary-purple bg-primary-purple/10 shadow-lg'
              : 'border-dusty-rose hover:border-primary-purple hover:shadow-md'
          }`}
        >
          <div className="text-4xl mb-3">🔥</div>
          <h3 className="text-xl font-bold text-navy mb-2">{PRESETS['go-large'].name}</h3>
          <p className="text-navy/70 text-sm">{PRESETS['go-large'].description}</p>
          <p className="text-xs text-mauve-pink mt-3 italic">
            Dream homes, luxury cars, and legendary generosity
          </p>
        </button>

        {/* Keep It Chill */}
        <button
          onClick={() => onPresetChange('chill')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            selectedPreset === 'chill'
              ? 'border-primary-purple bg-primary-purple/10 shadow-lg'
              : 'border-dusty-rose hover:border-primary-purple hover:shadow-md'
          }`}
        >
          <div className="text-4xl mb-3">🧘</div>
          <h3 className="text-xl font-bold text-navy mb-2">{PRESETS['chill'].name}</h3>
          <p className="text-navy/70 text-sm">{PRESETS['chill'].description}</p>
          <p className="text-xs text-mauve-pink mt-3 italic">
            Financial freedom without the flashiness
          </p>
        </button>

        {/* Custom */}
        <button
          onClick={() => onPresetChange('custom')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            selectedPreset === 'custom'
              ? 'border-primary-purple bg-primary-purple/10 shadow-lg'
              : 'border-dusty-rose hover:border-primary-purple hover:shadow-md'
          }`}
        >
          <div className="text-4xl mb-3">✨</div>
          <h3 className="text-xl font-bold text-navy mb-2">Custom</h3>
          <p className="text-navy/70 text-sm">Build your own dream</p>
          <p className="text-xs text-mauve-pink mt-3 italic">
            Start from scratch and make it yours
          </p>
        </button>
      </div>

      {selectedPreset !== 'custom' && (
        <p className="text-center text-sm text-navy/60 mt-6">
          You can customize any values in the following steps
        </p>
      )}
    </div>
  )
}
