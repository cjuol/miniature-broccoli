type Props = {
  isOpen: boolean
  onClose: () => void
  onSelectStrength: () => void
  onSelectCardio: () => void
  onSelectMetabolic: () => void
}

export const AddBlockSheet = ({
  isOpen,
  onClose,
  onSelectStrength,
  onSelectCardio,
  onSelectMetabolic,
}: Props) => {
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
          <h2 className="mb-4 text-lg font-bold text-white">¿Qué tipo de bloque?</h2>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => { onClose(); onSelectStrength() }}
              className="flex items-center gap-4 rounded-xl bg-gray-800 px-4 py-4 text-left active:bg-gray-700"
            >
              <span className="text-2xl">💪</span>
              <div>
                <p className="font-semibold text-white">Fuerza</p>
                <p className="text-xs text-gray-500">Ejercicio con series y repeticiones</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { onClose(); onSelectCardio() }}
              className="flex items-center gap-4 rounded-xl bg-gray-800 px-4 py-4 text-left active:bg-gray-700"
            >
              <span className="text-2xl">🏃</span>
              <div>
                <p className="font-semibold text-white">Cardio</p>
                <p className="text-xs text-gray-500">Carrera, remo, ski erg, bici…</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { onClose(); onSelectMetabolic() }}
              className="flex items-center gap-4 rounded-xl bg-gray-800 px-4 py-4 text-left active:bg-gray-700"
            >
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-semibold text-white">Metabólico</p>
                <p className="text-xs text-gray-500">AMRAP, circuito, bloque de tiempo</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
