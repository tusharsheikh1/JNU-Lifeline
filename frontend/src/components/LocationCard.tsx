export default function LocationCard({ l }: { l: any }) {
  return (
    <article className="rounded-2xl border p-4 bg-white">
      <h3 className="font-medium text-lg">{l.name}</h3>
      <p className="text-sm text-gray-600">{l.city} • {l.address}</p>
      {l.phone && <p className="text-sm">📞 {l.phone}</p>}
    </article>
  )
}