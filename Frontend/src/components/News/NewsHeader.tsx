import { Newspaper } from "lucide-react"

export const NewsHeader = () => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-16 w-16 rounded-full bg-primary-400/10 p-3 mb-6">
        <Newspaper className="h-10 w-10 text-primary-400" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">Novosti i Ažuriranja</h1>
      <p className="mx-auto max-w-2xl text-lg text-gray-300">
        Pratite najnovije informacije o razvoju aplikacije, novim značajkama i poboljšanjima
      </p>
    </div>
  )
}

