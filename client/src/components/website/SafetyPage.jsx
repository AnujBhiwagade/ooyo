function SafetyPage() {
  return (
    <div className="min-h-[calc(100vh-152px)] px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">

        <p className="text-[9px] tracking-[0.35em] uppercase text-gray-600">
          Safety
        </p>

        <h1 className="mt-5 text-5xl md:text-7xl font-black tracking-[-0.06em] leading-[0.9]">
          STRANGERS
          <br />
          ARE STILL PEOPLE.
        </h1>

        <p className="mt-8 max-w-2xl text-gray-400 text-base md:text-lg leading-8">
          Meeting random people can be fun. It can also be unpredictable.
          A few basic rules make a big difference.
        </p>

        <div className="my-16 border-t border-white/10" />

        <div className="max-w-2xl space-y-14">

          <section>
            <h2 className="text-2xl font-bold">
              Protect your personal information.
            </h2>

            <p className="mt-4 text-gray-400 leading-8">
              Don't share your home address, phone number, passwords,
              financial details, government IDs or other sensitive
              information with strangers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">
              Stay in control.
            </h2>

            <p className="mt-4 text-gray-400 leading-8">
              You never owe another player an answer or action.
              If something makes you uncomfortable, don't do it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">
              Don't meet strangers because of a chat.
            </h2>

            <p className="mt-4 text-gray-400 leading-8">
              If you decide to continue a friendship outside ooyo,
              use good judgement. Don't arrange unsafe meetings or
              put yourself in situations where you cannot easily leave.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">
              Watch for manipulation.
            </h2>

            <p className="mt-4 text-gray-400 leading-8">
              Be cautious if someone asks you for money, credentials,
              intimate material, access to an account or urgent favors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">
              Report abuse.
            </h2>

            <p className="mt-4 text-gray-400 leading-8">
              If someone behaves abusively or repeatedly breaks the rules,
              report them through the available reporting tools.
            </p>
          </section>

        </div>

        <section className="mt-20 pb-10">
          <div className="border-t border-white/10 pt-12">

            <p className="text-white text-xl font-bold">
              If something feels wrong, leave.
            </p>

            <p className="mt-4 text-gray-500 leading-7">
              No game is worth putting yourself at risk.
            </p>

          </div>
        </section>

      </div>
    </div>
  );
}

export default SafetyPage;