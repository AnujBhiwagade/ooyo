function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-152px)] px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">

        <p className="text-[9px] tracking-[0.35em] uppercase text-gray-600">
          Privacy policy
        </p>

        <h1 className="mt-5 text-5xl md:text-7xl font-black tracking-[-0.06em] leading-[0.9]">
          YOUR DATA
          <br />
          IS YOURS.
        </h1>

        <p className="mt-8 text-gray-500 text-sm">
          Last updated: September 2026
        </p>

        <div className="my-16 border-t border-white/10" />

        <div className="max-w-2xl space-y-12 text-gray-400 leading-8">

          <section>
            <h2 className="text-2xl text-white font-bold">
              1. What we collect
            </h2>

            <p className="mt-4">
              ooyo may process information necessary to operate the
              service, such as your chosen display name, room information,
              connection information and technical information required
              to maintain the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-bold">
              2. Camera and microphone
            </h2>

            <p className="mt-4">
              Video and audio features require browser permission.
              Your browser controls access to your camera and microphone.
              ooyo uses WebRTC for real-time communication between players.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-bold">
              3. How information is used
            </h2>

            <p className="mt-4">
              Information may be used to provide multiplayer rooms,
              maintain connections, moderate abuse, prevent misuse,
              troubleshoot problems and improve the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-bold">
              4. Chat and moderation
            </h2>

            <p className="mt-4">
              Messages and moderation-related information may be processed
              to operate the game, investigate reports and enforce our
              rules.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-bold">
              5. Third parties
            </h2>

            <p className="mt-4">
              ooyo may rely on infrastructure and service providers needed
              to host, operate and secure the application. Those providers
              may process information as necessary to provide their services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-bold">
              6. Data retention
            </h2>

            <p className="mt-4">
              Information may be retained for as long as reasonably
              necessary to operate the service, maintain security,
              investigate abuse or satisfy legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-bold">
              7. Your choices
            </h2>

            <p className="mt-4">
              You can choose what information you provide while using
              ooyo and can stop using the service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-white font-bold">
              8. Contact
            </h2>

            <p className="mt-4">
              For privacy questions or requests, contact the ooyo team
              through the contact information provided on this website.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}

export default PrivacyPage;