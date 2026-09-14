function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-152px)] px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">

        <p className="text-[9px] tracking-[0.35em] uppercase text-gray-600">
          Contact
        </p>

        <h1 className="mt-5 text-5xl md:text-7xl font-black tracking-[-0.06em] leading-[0.9]">
          SAY
          <br />
          HELLO.
        </h1>

        <p className="mt-8 max-w-xl text-gray-400 text-base md:text-lg leading-8">
          Something broken? Something awesome?
          Something that absolutely should not be happening?
        </p>

        <div className="my-16 border-t border-white/10" />

        <div className="max-w-2xl">

          <div className="border border-white/10 p-7 md:p-10">

            <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
              Email
            </p>

            <h2 className="mt-4 text-2xl md:text-3xl font-bold">
              hello@ooyo.in
            </h2>

            <p className="mt-5 text-gray-500 leading-7">
              For general questions, feedback, bugs and suggestions.
            </p>

          </div>

          <div className="mt-5 border border-white/10 p-7 md:p-10">

            <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
              Safety & moderation
            </p>

            <h2 className="mt-4 text-2xl md:text-3xl font-bold">
              safety@ooyo.in
            </h2>

            <p className="mt-5 text-gray-500 leading-7">
              Use this channel for serious safety concerns,
              abuse reports or moderation issues.
            </p>

          </div>

        </div>

        <section className="mt-20 pb-10">
          <div className="border-t border-white/10 pt-12">

            <p className="text-gray-500">
              No fancy contact form.
            </p>

            <p className="mt-3 text-white text-xl font-bold">
              Just send the email.
            </p>

          </div>
        </section>

      </div>
    </div>
  );
}

export default ContactPage;