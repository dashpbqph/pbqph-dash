type DetailsMetaItemProps = {
  label: string
  value: React.ReactNode
}

export default function DetailsMetaItem({ label, value }: DetailsMetaItemProps) {
  return (
    <div className="flex h-12 items-center gap-2 rounded-md bg-primary px-3 text-sm text-background hover:bg-primary/95">
      <span className="font-light">{label}:</span>
      {value}
    </div>
  )
}
