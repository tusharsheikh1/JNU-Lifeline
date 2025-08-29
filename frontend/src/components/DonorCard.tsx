export default function DonorCard({ d }: { d: any }) {
  return (
    <article className="rounded-2xl border p-4 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-lg">{d.name}</h3>
          <p className="text-sm text-gray-600">{d.group} • {d.area}</p>
          <p className="text-sm">📞 {d.phone}</p>
        </div>
        <span className="inline-flex items-center justify-center rounded-full border w-10 h-10 text-sm font-semibold">{d.group}</span>
      </div>
    </article>
  )
}