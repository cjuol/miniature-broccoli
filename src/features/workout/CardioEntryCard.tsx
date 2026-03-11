import { formatDuration } from '../../utils/time'
import type { CardioEntry, CardioType } from './types'

const CARDIO_EMOJI: Record<CardioType, string> = {
  run: '🏃',
  row: '🚣',
  ski: '⛷️',
  bike: '🚴',
  walk: '🚶',
  rope: '🪢',
}

const CARDIO_LABEL: Record<CardioType, string> = {
  run: 'Carrera',
  row: 'Remo',
  ski: 'Ski Erg',
  bike: 'Bici',
  walk: 'Caminata',
  rope: 'Cuerda',
}

type Props = {
  entry: CardioEntry
}

export const CardioEntryCard = ({ entry }: Props) => {
  const isPending = entry.id.startsWith('pending_')

  const durationLabel = (() => {
    const m = Math.floor(entry.durationSeconds / 60)
    const s = entry.durationSeconds % 60
    return s > 0 ? formatDuration(entry.durationSeconds) : `${m} min`
  })()

  const distanceLabel = entry.distanceMeters
    ? `${(entry.distanceMeters / 1000).toFixed(1)} km`
    : null

  const paceLabel = entry.paceMinPerKm
    ? (() => {
        const m = Math.floor(entry.paceMinPerKm)
        const s = Math.round((entry.paceMinPerKm - m) * 60)
        return `${m}:${String(s).padStart(2, '0')} /km`
      })()
    : null

  return (
    <div className="rounded-xl bg-gray-900 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{CARDIO_EMOJI[entry.cardioType]}</span>
          <span className="font-semibold text-white">{CARDIO_LABEL[entry.cardioType]}</span>
        </div>
        {isPending && (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-700 border-t-indigo-400" />
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-400">
        <span>{durationLabel}</span>
        {distanceLabel && <span>· {distanceLabel}</span>}
        {paceLabel && <span>· {paceLabel}</span>}
      </div>

      {entry.notes && (
        <p className="mt-1.5 text-xs text-gray-600">{entry.notes}</p>
      )}
    </div>
  )
}
