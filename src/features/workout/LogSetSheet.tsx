import { useState } from 'react'
import { useLogSetMutation } from './useLogSetMutation'
import type { LogSetInput } from './types'

type Props = {
  exerciseEntryId: string
  exerciseName: string
  isOpen: boolean
  onClose: () => void
}

export const LogSetSheet = ({ exerciseEntryId, exerciseName, isOpen, onClose }: Props) => {
  const [weightKg, setWeightKg] = useState('')
  const [reps, setReps] = useState('')
  const [rir, setRir] = useState('')
  const [toFailure, setToFailure] = useState(false)

  const { mutate: logSet } = useLogSetMutation()

  const reset = () => {
    setWeightKg('')
    setReps('')
    setRir('')
    setToFailure(false)
  }

  const handleSubmit = () => {
    const input: LogSetInput = {
      weightKg: parseFloat(weightKg),
      repsCompleted: parseInt(reps, 10),
      toFailure,
      ...(toFailure ? {} : { rirActual: parseInt(rir || '0', 10) }),
    }
    logSet({ exerciseEntryId, input })
    reset()
    onClose()
  }

  const isValid = weightKg !== '' && reps !== '' && !isNaN(parseFloat(weightKg)) && !isNaN(parseInt(reps, 10))

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
          <h2 className="text-lg font-bold text-white">{exerciseName}</h2>
          <p className="mt-0.5 text-xs text-gray-500">Nueva serie</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Peso (kg)</label>
              <input
                type="number"
                inputMode="decimal"
                placeholder="100"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-3 text-center text-lg font-semibold text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Reps</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="8"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-3 text-center text-lg font-semibold text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Toggle al fallo */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-300">Al fallo</span>
            <button
              type="button"
              onClick={() => setToFailure((v) => !v)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                toFailure ? 'bg-indigo-600' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  toFailure ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Campo RIR — solo si no es al fallo */}
          {!toFailure && (
            <div className="mt-3">
              <label className="mb-1 block text-xs text-gray-400">RIR (reps en reserva)</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="0–5"
                value={rir}
                onChange={(e) => setRir(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-3 text-center text-lg font-semibold text-white outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <button
            type="button"
            disabled={!isValid}
            onClick={handleSubmit}
            className="mt-6 w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            Guardar serie
          </button>
        </div>
      </div>
    </>
  )
}
