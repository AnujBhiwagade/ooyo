function OmegleAlternativePage() {
  const enterOoyo = () => {
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );

    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ============================ */}
      {/* HERO */}
      {/* ============================ */}

      <section className="min-h-[75vh] flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-4xl mx-auto text-center">
          <p className="text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-gray-600">
            Looking for an
          </p>

          <h1
            className="
              mt-4
              text-[clamp(3rem,8vw,6.5rem)]
              leading-[0.85]
              font-black
              tracking-[-0.07em]
            "
          >
            OMEGLE
            <br />
            ALTERNATIVE?
          </h1>

          <p className="mt-8 text-xl md:text-2xl text-white">
            Meet ooyo.
          </p>

          <p className="mt-4 text-sm md:text-base text-gray-500 leading-7">
            Random video chat with strangers.
            <br />
            No account. No profile.
          </p>

          <button
            onClick={enterOoyo}
            className="
              mt-8
              px-8
              py-3
              bg-white
              text-black
              text-sm
              font-bold
              tracking-[0.16em]
              uppercase
              hover:bg-gray-200
              active:scale-[0.98]
              transition-all
            "
          >
            Enter ooyo →
          </button>

          <p className="mt-3 text-[9px] text-gray-700">
            Four strangers. One bottle. Truth or Dare.
          </p>
        </div>
      </section>

      {/* ============================ */}
      {/* DIFFERENCE */}
      {/* ============================ */}

      <section className="border-t border-white/10 px-6 py-24 md:py-32">
        <div className="w-full max-w-3xl mx-auto text-center">
          <p className="text-[9px] tracking-[0.35em] uppercase text-gray-600">
            Why ooyo?
          </p>

          <h2
            className="
              mt-4
              text-4xl
              md:text-6xl
              font-black
              tracking-[-0.05em]
              leading-[0.9]
            "
          >
            NOT JUST ANOTHER
            <br />
            RANDOM CHAT.
          </h2>

          <div className="mt-10 text-sm md:text-base text-gray-400 leading-7 max-w-xl mx-auto">
            <p>
              Meet strangers.
              <br />
              Skip the awkward introduction.
              <br />
              Let the bottle decide who goes next.
            </p>

            <p className="mt-8 text-white text-xl font-bold">
              Truth.
              <br />
              Dare.
              <br />
              See what happens.
            </p>
          </div>
        </div>
      </section>

      {/* ============================ */}
      {/* FINAL CTA */}
      {/* ============================ */}

      <section className="border-t border-white/10 min-h-[55vh] flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-3xl mx-auto text-center">
          <p className="text-[9px] tracking-[0.35em] uppercase text-gray-600">
            Still bored?
          </p>

          <h2
            className="
              mt-4
              text-5xl
              md:text-7xl
              font-black
              tracking-[-0.06em]
            "
          >
            FUCK IT.
          </h2>

          <button
            onClick={enterOoyo}
            className="
              mt-8
              text-2xl
              md:text-3xl
              font-black
              tracking-tight
              hover:text-gray-400
              transition
            "
          >
            Enter ooyo →
          </button>

          <p className="mt-5 text-sm text-gray-600">
            Random video chat.
            <br />
            Four strangers.
            <br />
            No account.
          </p>
        </div>
      </section>
    </div>
  );
}

export default OmegleAlternativePage;