function LegalPage() {
  return (
    <div className="min-h-[calc(100vh-152px)] px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">

        <p className="text-[9px] tracking-[0.35em] uppercase text-gray-600">
          Legal
        </p>

        <h1 className="mt-5 text-5xl md:text-7xl font-black tracking-[-0.06em] leading-[0.9]">
          THE BORING
          <br />
          STUFF.
        </h1>

        <p className="mt-8 max-w-2xl text-gray-400 text-base md:text-lg leading-8">
          Nobody comes to ooyo because they want to read legal documents.
          But they're here anyway.
        </p>

        <div className="my-16 border-t border-white/10" />

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl">

          <a
            href="/#/privacy"
            className="
              border border-white/10
              p-7
              hover:border-white/30
              transition
              group
            "
          >
            <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
              01
            </p>

            <h2 className="mt-4 text-2xl font-bold group-hover:text-gray-300">
              Privacy Policy
            </h2>

            <p className="mt-3 text-sm text-gray-500 leading-6">
              How information is collected, used and protected.
            </p>
          </a>

          <a
            href="/#/terms"
            className="
              border border-white/10
              p-7
              hover:border-white/30
              transition
              group
            "
          >
            <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
              02
            </p>

            <h2 className="mt-4 text-2xl font-bold group-hover:text-gray-300">
              Terms of Service
            </h2>

            <p className="mt-3 text-sm text-gray-500 leading-6">
              The rules for using ooyo and participating in the service.
            </p>
          </a>

          <a
            href="/#/safety"
            className="
              border border-white/10
              p-7
              hover:border-white/30
              transition
              group
            "
          >
            <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
              03
            </p>

            <h2 className="mt-4 text-2xl font-bold group-hover:text-gray-300">
              Safety
            </h2>

            <p className="mt-3 text-sm text-gray-500 leading-6">
              Practical advice for staying safe while meeting strangers.
            </p>
          </a>

          <a
            href="/#/community-guidelines"
            className="
              border border-white/10
              p-7
              hover:border-white/30
              transition
              group
            "
          >
            <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
              04
            </p>

            <h2 className="mt-4 text-2xl font-bold group-hover:text-gray-300">
              Community Guidelines
            </h2>

            <p className="mt-3 text-sm text-gray-500 leading-6">
              What behaviour is welcome and what isn't.
            </p>
          </a>

        </div>

        <section className="mt-20 pb-10">
          <div className="border-t border-white/10 pt-12">

            <p className="text-gray-500 leading-7">
              These documents will evolve as ooyo evolves.
            </p>

            <p className="mt-5 text-white font-semibold">
              Last updated: September 2026
            </p>

          </div>
        </section>

      </div>
    </div>
  );
}

export default LegalPage;