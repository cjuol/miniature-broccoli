import { useState } from 'react'
import { type LogMetabolicInput, useLogMetabolicMutation } from './useLogMetabolicMutation'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const LogMetabolicSheet = ({ isOpen, onClose }: Props) => {
  const [rounds, setRounds] = useState('')
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  const [result, setResult] = useState('')
  const [notes, setNotes] = useState('')

  const { mutate: logMetabolic } = useLogMetabolicMutation()

  const reset = () => {
    setRounds('')
    setMinutes('')
    setSeconds('')
    setResult('')
    setNotes('')
  }

  const handleSubmit = () => {
    const timeSeconds =
      minutes !== '' || seconds !== ''
        ? parseInt(minutes || '0', 10) * 60 + parseInt(seconds || '0', 10)
        : undefined

    const input: LogMetabolicInput = {
      ...(rounds !== '' ? { rounds: parseInt(rounds, 10) } : {}),
      ...(timeSeconds !== undefined ? { timeSeconds } : {}),
      ...(result !== '' ? { result } : {}),
      ...(notes !== '' ? { notes } : {}),
    }
    logMetabolic(input)
    reset()
    onClose()
  }

  // Al menos un campo debe tener valor para guardar
  const isValid = rounds !== '' || minutes !== '' || seconds !== '' || result !== ''

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
          <h2 className="text-lg font-bold text-white">Bloque metabólico</h2>
          <p className="mt-0.5 text-xs text-gray-500">Todos los campos son opcionales</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {/* Rondas */}
            <div>
              <label className="mb-1 block text-xs text-gray-400">Rondas</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="6"
                value={rounds}
                onChange={(e) => setRounds(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-3 text-center text-lg font-semibold text-white outline-none focus:border-indigo-500"
              />
            </div>

            {/* Tiempo */}
            <div>
              <label className="mb-1 block text-xs text-gray-400">Tiempo</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="15"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-2 py-3 text-center text-lg font-semibold text-white outline-none focus:border-indigo-500"
                />
                <span className="text-gray-600">:</span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="00"
                  min={0}
                  max={59}
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-gray-800 px-2 py-3 text-center text-lg font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Resultado */}
          <div className="mt-4">
            <label className="mb-1 block text-xs text-gray-400">Resultado</label>
            <input
              type="text"
              placeholder="6 rounds + 20 reps"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-3 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          {/* Notas */}
          <div className="mt-3">
            <label className="mb-1 block text-xs text-gray-400">Notas</label>
            <input
              type="text"
              placeholder="Ritmo, sensaciones…"
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
