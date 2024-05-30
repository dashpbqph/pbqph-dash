export function Legend() {
  return (
    <tr className="absolute right-[22px] top-2 flex items-center justify-end gap-3">
      <td className="flex items-center justify-end gap-1">
        <div className="h-2.5 w-2.5 rounded-full border-[1.2px] border-secondary bg-primary" />
        <span className="text-xs text-secondary">melhor</span>
      </td>
      <td className="flex items-center justify-end gap-1">
        <div className="h-2.5 w-2.5 rounded-full border-[1.2px] border-secondary bg-accent" />
        <span className="text-xs text-secondary">pior valor</span>
      </td>
    </tr>
  )
}
