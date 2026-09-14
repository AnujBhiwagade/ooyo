function RulesPage() {
  return (
    <div className="min-h-[calc(100vh-152px)] px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">

        <p className="text-[9px] tracking-[0.35em] uppercase text-gray-600">
          The rules
        </p>

        <h1 className="mt-5 text-5xl md:text-7xl font-black tracking-[-0.06em] leading-[0.9]">
          PLAY FAIR.
          <br />
          DON'T BE A DICK.
        </h1>

        <p className="mt-8 max-w-2xl text-gray-400 text-base md:text-lg leading-8">
          ooyo is supposed to be fun, unpredictable and a little
          ridiculous. That doesn't mean anything goes.
        </p>

        <div className="my-16 border-t border-white/10" />

        <div className="max-w-2xl space-y-14">

          <section>
            <h2 className="text-2xl font-bold">
              Respect the people in the room.
            </h2>

            <p className="mt-4 text-gray-400 leading-8">
              Everyone playing is a real person. Don't harass,
              threaten, humiliate or deliberately target another player.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">
              Don't force anyone.
            </h2>

            <p className="mt-4 text-gray-400 leading-8">
              A Truth or Dare is never more important than someone's
              comfort or safety. Players can refuse a task that crosses
              a reasonable boundary.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">
              Keep it legal.
            </h2>

            <p className="mt-4 text-gray-400 leading-8">
              Don't submit tasks that require illegal activity,
              dangerous behaviour, property damage or serious risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">
              Don't expose personal information.
            </h2>

            <p className="mt-4 text-gray-400 leading-8">
              Don't ask people for passwords, financial information,
              private addresses, identity documents or other sensitive
              personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">
              Don't abuse the platform.
            </h2>

            <p className="mt-4 text-gray-400 leading-8">
              Spam, scams, impersonation, malicious behaviour and
              attempts to disrupt the service aren't allowed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">
              Report serious problems.
            </h2>

            <p className="mt-4 text-gray-400 leading-8">
              If another player repeatedly violates the rules,
              use the reporting tools available in the game.
            </p>
          </section>

        </div>

        <section className="mt-20 pb-10">
          <div className="border-t border-white/10 pt-12">

            <p className="text-gray-500">
              The golden rule?
            </p>

            <h2 className="mt-4 text-4xl md:text-5xl font-black tracking-[-0.04em]">
              HAVE FUN.
              <br />
              DON'T RUIN IT FOR EVERYONE.
            </h2>

          </div>
        </section>

      </div>
    </div>
  );
}

export default RulesPage;