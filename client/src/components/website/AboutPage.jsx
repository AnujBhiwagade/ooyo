function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-152px)] px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">

        {/* Eyebrow */}
        <p className="text-[9px] tracking-[0.35em] uppercase text-gray-600">
          The idea
        </p>

        {/* Hero */}
        <h1 className="mt-5 text-5xl md:text-7xl font-black tracking-[-0.06em] leading-[0.9]">
          I WAS
          <br />
          BORED.
        </h1>

        {/* Intro */}
        <div className="mt-10 max-w-2xl text-gray-400 text-base md:text-lg leading-8">
          <p className="text-white">
            ooyo started because I wanted to meet random people.
          </p>

          <p className="mt-6">
            People from different countries. Different cities.
            People I would probably never meet in real life.
          </p>

          <p className="mt-6">
            There was just one problem.
          </p>

          <p className="mt-2 text-white text-xl font-semibold">
            I had absolutely no idea what to talk about.
          </p>
        </div>

        {/* Divider */}
        <div className="my-16 border-t border-white/10" />

        {/* Problem */}
        <section className="max-w-2xl">
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
            The problem
          </p>

          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Starting conversations is weird.
          </h2>

          <div className="mt-6 text-gray-400 leading-8">
            <p>
              You join a random chat.
            </p>

            <p>
              Someone says "hey."
            </p>

            <p>
              You say "hey."
            </p>

            <p>
              Then both of you stare at the screen wondering what
              the hell happens next.
            </p>

            <p className="mt-6 text-white">
              So I thought...
            </p>

            <p className="mt-2 text-white text-xl font-semibold">
              What if we just removed that part?
            </p>
          </div>
        </section>

        {/* Game idea */}
        <section className="mt-20 max-w-2xl">
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
            The solution
          </p>

          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Four strangers.
          </h2>

          <div className="mt-8 space-y-2 text-xl md:text-2xl text-white font-semibold">
            <p>A bottle.</p>
            <p>Truth.</p>
            <p>Dare.</p>
          </div>

          <p className="mt-8 text-gray-400 leading-8">
            No profile building.
            <br />
            No follower counts.
            <br />
            No pretending you're interesting.
          </p>

          <p className="mt-8 text-white text-xl font-bold">
            Just show up and see what happens.
          </p>
        </section>

        {/* Philosophy */}
        <section className="mt-20 max-w-2xl">
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
            The point
          </p>

          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            You don't need a reason.
          </h2>

          <div className="mt-6 text-gray-400 leading-8">
            <p>
              Maybe you're bored.
            </p>

            <p>
              Maybe you want to meet someone new.
            </p>

            <p>
              Maybe you're avoiding work.
            </p>

            <p>
              Maybe you just want to do something stupid for ten minutes.
            </p>

            <p className="mt-6 text-white">
              Whatever.
            </p>

            <p className="mt-2 text-white text-xl font-semibold">
              That's enough.
            </p>
          </div>
        </section>

        {/* Name */}
        <section className="mt-20 max-w-2xl">
          <div className="border-t border-white/10 pt-12">

            <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
              And the name?
            </p>

            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
              ooyo.
            </h2>

            <div className="mt-6 text-gray-400 leading-8">
              <p>
                Honestly?
              </p>

              <p className="mt-2 text-white font-semibold">
                There is no deep meaning.
              </p>

              <p className="mt-6">
                Most decent names were already taken.
              </p>

              <p className="mt-4">
                The domains that weren't taken were either ridiculously
                expensive or sounded terrible.
              </p>

              <p className="mt-4">
                Then I found <span className="text-white">ooyo.in</span>.
              </p>

              <p className="mt-4">
                Available.
                <br />
                Cheap.
                <br />
                Weird.
              </p>

              <p className="mt-4 text-white">
                I kinda liked it.
              </p>

              <p className="mt-4">
                So I took it.
              </p>
            </div>
          </div>
        </section>

        {/* Final */}
        <section className="mt-20 pb-10">
          <div className="border-t border-white/10 pt-12">

            <p className="text-gray-500 text-sm">
              No 47-slide branding strategy.
            </p>

            <p className="mt-2 text-gray-500 text-sm">
              No secret meaning.
            </p>

            <p className="mt-2 text-gray-500 text-sm">
              No ancient language.
            </p>

            <h2 className="mt-8 text-4xl md:text-6xl font-black tracking-[-0.05em]">
              JUST OOYO.
            </h2>

            <p className="mt-6 text-gray-500">
              Meet someone.
              <br />
              Say something stupid.
              <br />
              Tell the truth.
              <br />
              Do the dare.
            </p>

            <p className="mt-8 text-white text-xl font-bold">
              See what happens.
            </p>

          </div>
        </section>

      </div>
    </div>
  );
}

export default AboutPage;