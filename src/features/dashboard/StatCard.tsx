type Props = {
  value: number | string
  label: string
}

export const StatCard = ({ value, label }: Props) => (
  <div className="flex flex-1 flex-col items-center rounded-xl bg-gray-900 py-4">
    <span className="text-3xl font-bold text-white">{value}</span>
    <span className="mt-1 text-xs text-gray-500">{label}</span>
  </div>
)
