export default function Home() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        <h1 className="text-5xl font-bold tracking-tight">CompanyFlash</h1>
        <p className="mt-4 text-xl text-gray-600">
          Lightning‑fast data solutions for busy teams.
        </p>
        <a
          href="mailto:matt@companyflash.com"
          className="mt-8 rounded bg-black px-6 py-3 text-white hover:opacity-80"
        >
          Get in touch
        </a>
      </main>
    );
  }
  