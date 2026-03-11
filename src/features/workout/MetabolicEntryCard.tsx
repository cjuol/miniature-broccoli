import type { MetabolicEntry } from './types'

type Props = {
  entry: MetabolicEntry
}

export const MetabolicEntryCard = ({ entry }: Props) => {
  const isPending = entry.id.startsWith('pending_')

  const timeLabel = entry.timeSeconds
    ? (() => {
        const m = Math.floor(entry.timeSeconds / 60)
        const s = entry.timeSeconds % 60
        return `${m}:${String(s).padStart(2, '0')}`
      })()
    : null

  return (
    <div className="rounded-xl bg-gray-900 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span className="font-semibold text-white">Metabólico</span>
        </div>
        {isPending && (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-700 border-t-indigo-400" />
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-400">
        {entry.roundsCompleted !== null && <span>{entry.roundsCompleted} rondas</span>}
        {timeLabel && <span>· {timeLabel}</span>}
        {entry.result && <span>· {entry.result}</span>}
      </div>

      {entry.notes && (
        <p className="mt-1.5 text-xs text-gray-600">{entry.notes}</p>
      )}
    </div>
  )
}
