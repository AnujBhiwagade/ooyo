function HowToPlayPage() {
  return (
    <div className="min-h-[calc(100vh-152px)] px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">

        <p className="text-[9px] tracking-[0.35em] uppercase text-gray-600">
          The game
        </p>

        <h1 className="mt-5 text-5xl md:text-7xl font-black tracking-[-0.06em] leading-[0.9]">
          FOUR PEOPLE.
          <br />
          ONE BOTTLE.
        </h1>

        <p className="mt-8 max-w-2xl text-gray-400 text-base md:text-lg leading-8">
          Four strangers enter a room. The bottle decides who is
          in the spotlight. Then you choose your fate.
        </p>

        <div className="my-16 border-t border-white/10" />

        {/* Step 1 */}
        <section className="max-w-2xl">
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
            01
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Show up.
          </h2>

          <p className="mt-5 text-gray-400 leading-8">
            Enter a name and join the room.
            No account. No profile. No complicated setup.
          </p>
        </section>

        {/* Step 2 */}
        <section className="mt-16 max-w-2xl">
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
            02
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Wait for the room.
          </h2>

          <p className="mt-5 text-gray-400 leading-8">
            ooyo works with four players in a room.
            Once everyone is ready, the round begins.
          </p>
        </section>

        {/* Step 3 */}
        <section className="mt-16 max-w-2xl">
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
            03
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Let the bottle decide.
          </h2>

          <p className="mt-5 text-gray-400 leading-8">
            The bottle spins around the room and lands on one player.
            That player becomes the focus of the round.
          </p>
        </section>

        {/* Step 4 */}
        <section className="mt-16 max-w-2xl">
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
            04
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Truth or dare?
          </h2>

          <p className="mt-5 text-gray-400 leading-8">
            The selected player chooses whether they want a Truth
            or a Dare.
          </p>
        </section>

        {/* Step 5 */}
        <section className="mt-16 max-w-2xl">
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
            05
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Everyone else gets creative.
          </h2>

          <p className="mt-5 text-gray-400 leading-8">
            The other players submit a Truth question or a Dare.
            The selected player doesn't know who submitted what.
          </p>
        </section>

        {/* Step 6 */}
        <section className="mt-16 max-w-2xl">
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
            06
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Pick one.
          </h2>

          <p className="mt-5 text-gray-400 leading-8">
            The selected player chooses one of the submitted tasks
            and completes it before the timer runs out.
          </p>
        </section>

        {/* Step 7 */}
        <section className="mt-16 max-w-2xl">
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
            07
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            The room decides.
          </h2>

          <p className="mt-5 text-gray-400 leading-8">
            The other players vote on whether the task was successfully
            completed.
          </p>
        </section>

        {/* Final */}
        <section className="mt-20 pb-10">
          <div className="border-t border-white/10 pt-12">

            <p className="text-gray-500">
              That's basically it.
            </p>

            <h2 className="mt-5 text-4xl md:text-6xl font-black tracking-[-0.05em]">
              NO SMALL TALK.
            </h2>

            <p className="mt-6 text-gray-500 leading-7">
              Just four strangers,
              <br />
              a little chaos,
              <br />
              and whatever happens next.
            </p>

          </div>
        </section>

      </div>
    </div>
  );
}

export default HowToPlayPage;