import { useState } from 'react'
import type { CardioType } from './types'
import { type LogCardioInput, useLogCardioMutation } from './useLogCardioMutation'

const CARDIO_OPTIONS: { type: CardioType; label: string; emoji: string }[] = [
  { type: 'run', label: 'Carrera', emoji: '🏃' },
  { type: 'row', label: 'Remo', emoji: '🚣' },
  { type: 'ski', label: 'Ski Erg', emoji: '⛷️' },
  { type: 'bike', label: 'Bici', emoji: '🚴' },
  { type: 'walk', label: 'Caminata', emoji: '🚶' },
  { type: 'rope', label: 'Cuerda', emoji: '🪢' },
]

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const LogCardioSheet = ({ isOpen, onClose }: Props) => {
  const [selectedType, setSelectedType] = useState<CardioType | null>(null)
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  const [distanceKm, setDistanceKm] = useState('')
  const [notes, setNotes] = useState('')

  const { mutate: logCardio } = useLogCardioMutation()

  const reset = () => {
    setSelectedType(null)
    setMinutes('')
    setSeconds('')
    setDistanceKm('')
    setNotes('')
  }

  const handleSubmit = () => {
    if (!selectedType) return
    const durationSeconds = (parseInt(minutes || '0', 10) * 60) + parseInt(seconds || '0', 10)

    const input: LogCardioInput = {
      type: selectedType,
      durationSeconds,
      ...(distanceKm !== '' ? { distanceMeters: parseFloat(distanceKm) * 1000 } : {}),
      ...(notes !== '' ? { notes } : {}),
    }
    logCardio(input)
    reset()
    onClose()
  }

  const isValid = selectedType !== null && (parseInt(minutes || '0', 10) > 0 || parseInt(seconds || '0', 10) > 0)

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-gray-900 transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-gray-700" />
        </div>

        <div className="p-5 pb-10">
          <h2 className="text-lg font-bold text-white">Bloque de cardio</h2>

          {/* Selector de tipo */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {CARDIO_OPTIONS.map(({ type, label, emoji }) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`rounded-xl py-3 text-center text-sm transition-colors ${
                  selectedType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 active:bg-gray-700'
                }`}
              >
                <span className="block text-lg">{emoji}</span>
                <span className="mt-0.5 block text-xs">{label}</span>
              </button>
            ))}
          </div>

          {/* Duración */}
          <div className="mt-5">
            <label className="mb-1 block text-xs text-gray-400">Duración</label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="30"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-3 text-center text-lg font-semibold text-white outline-none focus:border-indigo-500"
                />
                <p className="mt-1 text-center text-xs text-gray-600">min</p>
              </div>
              <span className="pb-5 text-xl text-gray-600">:</span>
              <div className="flex-1">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="00"
                  min={0}
                  max={59}
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-3 text-center text-lg font-semibold text-white outline-none focus:border-indigo-500"
                />
                <p className="mt-1 text-center text-xs text-gray-600">seg</p>
              </div>
            </div>
          </div>

          {/* Distancia (opcional) */}
          <div className="mt-4">
            <label className="mb-1 block text-xs text-gray-400">Distancia (km) — opcional</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="5.0"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-3 text-center text-lg font-semibold text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Notas (opcional) */}
          <div className="mt-4">
            <label className="mb-1 block text-xs text-gray-400">Notas — opcional</label>
            <input
              type="text"
              placeholder="Sensaciones, ritmo…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-3 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="button"
            disabled={!isValid}
            onClick={handleSubmit}
            className="mt-6 w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            Guardar bloque
          </button>
        </div>
      </div>
    </>
  )
}
