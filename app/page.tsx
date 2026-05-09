export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6">
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-12 shadow-sm">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              AI Personal CRM
            </h1>

            <p className="mt-4 text-lg text-gray-600">
              Simple relationship management powered by AI
            </p>

            <div className="mt-10 flex justify-center gap-3">
              <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                Next.js
              </div>

              <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                Prisma
              </div>

              <div className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
                SQLite
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
