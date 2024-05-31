export default function FormInputLabel({ label }: { label: string }) {
  return (
    <label className="absolute -top-[9px] left-[6px] rounded-sm bg-primary px-1 py-[1px] text-xs text-white">
      {label}
    </label>
  )
}
