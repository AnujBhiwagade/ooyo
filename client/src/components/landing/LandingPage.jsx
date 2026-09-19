import { useEffect, useState } from "react";
import socket from "../../socket/socket";

function LandingPage({ playerName, setPlayerName, onStart }) {
  const [showStory, setShowStory] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    const handlePlayerCount = (count) => {
      setPlayerCount(count);
    };

    socket.on("player-count", handlePlayerCount);

    return () => {
      socket.off("player-count", handlePlayerCount);
    };
  }, []);

  const goToPage = (page) => {
  window.location.href = page;
};

  useEffect(() => {
    const existingSchema = document.getElementById("ooyo-structured-data");

    if (existingSchema) {
      existingSchema.remove();
    }

    const script = document.createElement("script");
    script.id = "ooyo-structured-data";
    script.type = "application/ld+json";

    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://ooyo.in/#website",
          url: "https://ooyo.in/",
          name: "Ooyo",
          description:
            "Ooyo is a random video chat where people meet strangers, play Truth or Dare, and see what happens.",
          inLanguage: "en",
        },
        {
          "@type": "Organization",
          "@id": "https://ooyo.in/#organization",
          name: "Ooyo",
          url: "https://ooyo.in/",
          logo: "https://ooyo.in/logo.png",
        },
      ],
    });

    document.head.appendChild(script);

    return () => {
      const schema = document.getElementById("ooyo-structured-data");

      if (schema) {
        schema.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ============================ */}
      {/* HEADER */}
      {/* ============================ */}

      <nav
        className="
          h-16
          px-6
          md:px-10
          flex
          items-center
          justify-between
          shrink-0
        "
        aria-label="Main navigation"
      >
        <div>
          <img
            src="/logo.png"
            alt="Ooyo"
            className="h-8 md:h-9 w-auto object-contain"
          />
        </div>

        <div
          className="
            flex
            items-center
            gap-2.5
            px-4
            py-2
            border
            border-white/10
            bg-black/70
            backdrop-blur-md
            text-[11px]
            md:text-xs
            tracking-[0.12em]
            uppercase
            text-gray-400
          "
          aria-label={`${playerCount} players online`}
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />

          <span>{playerCount} online</span>
        </div>
      </nav>

      {/* ============================ */}
      {/* MAIN CONTENT */}
      {/* ============================ */}

      <main className="w-full">
        {/* ============================ */}
        {/* SECTION 1 — HERO */}
        {/* ============================ */}

        <section
          className="
    w-full
    px-6
    -translate-y-2 
    pb-16
    md:pt-0
    md:pb-20
  "
          aria-labelledby="ooyo-heading"
        >
          <div className="w-full max-w-4xl mx-auto text-center -translate-y-2">
            {" "}
            <p
              className="
    text-[9px]
    md:text-[10px]
    tracking-[0.35em]
    uppercase
    text-gray-600
  "
            >
              There was no master plan.
            </p>
            <h1
              id="ooyo-heading"
              className="
                mt-4
                text-[clamp(3.5rem,6vw,6rem)]
                leading-[0.82]
                font-black
                tracking-[-0.07em]
              "
            >
              I WAS
              <br />
              BORED.
            </h1>
            {/* STORY */}
            <div className="mt-4 max-w-xl mx-auto">
              <p className="text-base md:text-lg text-white leading-7">
                I wanted to meet random people
                <br className="hidden md:block" />
                from around the world.
              </p>

              <div
                className="
                  mt-3
                  text-sm
                  md:text-base
                  text-gray-500
                  leading-7
                "
              >
                <p>People I'd never meet.</p>
                <p>People I'd probably never talk to.</p>
                <p>People with completely different lives.</p>
              </div>

              <p
                className="
                  mt-4
                  text-sm
                  md:text-base
                  text-gray-500
                "
              >
                But there's a problem.
              </p>

              <p
                className="
                  mt-2
                  text-white
                  text-lg
                  md:text-xl
                  font-semibold
                "
              >
                I suck at starting conversations.
              </p>
            </div>
            {/* FUCK IT */}
            <div className="mt-5">
              <p className="text-sm md:text-base text-gray-500">
                So I removed the awkward part.
              </p>

              <h2
                className="
                  mt-1
                  text-4xl
                  md:text-5xl
                  font-black
                  tracking-tight
                "
              >
                FUCK IT.
              </h2>

              <p className="mt-1 text-sm text-gray-500">Truth. Dare. Go.</p>
            </div>
            {/* JOIN */}
            <div className="mt-3 w-full max-w-sm mx-auto">
              <label htmlFor="player-name" className="sr-only">
                Your name
              </label>

              <input
                id="player-name"
                type="text"
                placeholder="What should we call you?"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onStart();
                  }
                }}
                className="
                  w-full
                  bg-transparent
                  border
                  border-white/20
                  hover:border-white/40
                  focus:border-white
                  text-white
                  placeholder:text-gray-600
                  px-5
                  py-3
                  rounded-none
                  outline-none
                  text-sm
                  text-center
                  transition
                "
              />

              <button
                onClick={onStart}
                className="
                  w-full
                  mt-2
                  bg-white
                  text-black
                  py-3
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

              <p className="mt-2 text-[9px] text-gray-700">
                No account. No profile. Just show up.
              </p>
            </div>
          </div>
        </section>

        {/* ============================ */}
        {/* SECTION 2 — WHAT IS OOYO */}
        {/* ============================ */}

        <section
          className="
            w-full
            min-h-[80vh]
            border-t
            border-white/10
            flex
            items-center
            justify-center
            px-6
            py-20
            md:py-24
          "
          aria-labelledby="what-is-ooyo"
        >
          <div className="w-full max-w-3xl mx-auto text-center">
            <p
              className="
                text-[9px]
                tracking-[0.35em]
                uppercase
                text-gray-600
              "
            >
              So what is this?
            </p>

            <h2
              id="what-is-ooyo"
              className="
                mt-4
                text-4xl
                md:text-6xl
                font-black
                tracking-[-0.04em]
                leading-[0.95]
              "
            >
              Random video chat.
              <br />
              No account.
              <br />
              <span className="text-gray-500">No bullshit.</span>
            </h2>

            <div
              className="
                mt-8
                mx-auto
                max-w-xl
                text-sm
                md:text-base
                text-gray-400
                leading-7
              "
            >
              <p>
                Ooyo is a simple place to meet strangers online through random
                video chat.
              </p>

              <p className="mt-5">
                No profile to build.
                <br />
                No followers to collect.
                <br />
                No feed to scroll.
              </p>

              <p className="mt-5">
                Just join, meet someone you've never met before, and see where
                the conversation goes.
              </p>

              <p className="mt-5">
                If you're looking for an{" "}
                <span className="text-white">Omegle alternative</span>, Ooyo
                gives you a different way to meet people — four strangers, Truth
                or Dare, and no profile to maintain.
              </p>

              <button
            onClick={() => goToPage("/omegle-alternative")}
                 className="
    mt-6
    text-sm
    text-white
    font-semibold
    hover:text-gray-400
    transition
  "
                  >
                   See how Ooyo is different →
               </button>
            </div>
          </div>
        </section>

        {/* ============================ */}
        {/* SECTION 3 — THE EXPERIENCE */}
        {/* ============================ */}

        <section
          className="
            w-full
            min-h-[85vh]
            border-t
            border-white/10
            flex
            items-center
            justify-center
            px-6
            py-20
            md:py-24
          "
          aria-labelledby="ooyo-experience"
        >
          <div className="w-full max-w-3xl mx-auto text-center">
            <p
              className="
                text-[9px]
                tracking-[0.35em]
                uppercase
                text-gray-600
              "
            >
              The experience
            </p>

            <h2
              id="ooyo-experience"
              className="
                mt-4
                text-4xl
                md:text-6xl
                font-black
                tracking-[-0.04em]
                leading-[0.95]
              "
            >
              Four strangers.
              <br />
              One bottle.
            </h2>

            <div
              className="
                mt-8
                mx-auto
                max-w-xl
                text-sm
                md:text-base
                text-gray-400
                leading-7
              "
            >
              <p>You don't know who's going to show up.</p>

              <p className="mt-4">You don't know what they're going to say.</p>

              <p className="mt-4">You don't know what happens next.</p>

              <p className="mt-7 text-white text-lg font-semibold">
                Someone gets picked.
              </p>

              <p className="mt-2 text-white text-xl font-bold">
                Truth or Dare.
              </p>

              <p className="mt-5">Then you find out.</p>

              <div className="mt-9 border-t border-white/10 pt-7">
                <p className="text-white font-bold">No followers.</p>

                <p className="text-white font-bold">No likes.</p>

                <p className="text-white font-bold">
                  No pretending to be interesting.
                </p>

                <p className="mt-5">Just show up.</p>

                <p>Meet someone.</p>
                <p>Say something stupid.</p>
                <p>Tell the truth.</p>
                <p>Do the dare.</p>

                <p
                  className="
                    mt-6
                    text-white
                    text-2xl
                    font-black
                  "
                >
                  See what happens.
                </p>
              </div>
            </div>

            {/* FINAL CTA */}

            <div className="mt-12 border-t border-white/10 pt-9">
              <p
                className="
                  text-[9px]
                  tracking-[0.3em]
                  uppercase
                  text-gray-600
                "
              >
                Still bored?
              </p>

              <button
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="
                  mt-3
                  text-3xl
                  md:text-4xl
                  font-black
                  tracking-tight
                  hover:text-gray-300
                  transition
                "
              >
                Enter ooyo →
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ============================ */}
      {/* FOOTER */}
      {/* ============================ */}

      <footer
        className="
          min-h-14
          px-6
          md:px-10
          py-4
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-4
          shrink-0
          border-t
          border-white/10
        "
      >
        <p
          className="
            text-[10px]
            tracking-[0.15em]
            uppercase
            text-gray-500
          "
        >
          © 2026 ooyo. All rights reserved.
        </p>

        <button
          onClick={() => setShowStory(true)}
          className="
            text-[10px]
            tracking-[0.18em]
            uppercase
            text-gray-400
            font-medium
            hover:text-white
            transition
          "
        >
          Why the hell is it called ooyo?
        </button>

        <div
          className="
            flex
            items-center
            gap-3
            md:gap-5
            text-[10px]
            tracking-[0.12em]
            uppercase
            text-gray-500
          "
        >
          <button
            onClick={() => goToPage("/about")}
            className="hover:text-white transition"
          >
            About
          </button>

          <span className="text-gray-800">•</span>

          <button
            onClick={() => goToPage("/how-to-play")}
            className="hover:text-white transition"
          >
            How to Play
          </button>

          <span className="text-gray-800">•</span>

          <button
            onClick={() => goToPage("/rules")}
            className="hover:text-white transition"
          >
            Rules
          </button>

          <span className="text-gray-800">•</span>

          <button
            onClick={() => goToPage("/legal")}
            className="hover:text-white transition"
          >
            Legal
          </button>
        </div>
      </footer>

      {/* ============================ */}
      {/* STORY DIALOG */}
      {/* ============================ */}

      {showStory && (
        <div
          className="
            fixed
            inset-0
            z-[200]
            bg-black/85
            backdrop-blur-sm
            flex
            items-center
            justify-center
            px-5
          "
        >
          <div
            className="
              relative
              w-full
              max-w-2xl
              max-h-[78vh]
              bg-black
              border
              border-white/20
              flex
              flex-col
            "
          >
            <button
              onClick={() => setShowStory(false)}
              className="
                absolute
                top-4
                right-5
                text-gray-500
                hover:text-white
                text-xl
                transition
                z-10
              "
              aria-label="Close story"
            >
              ×
            </button>

            <div
              className="
                px-7
                md:px-10
                pt-7
                pb-5
                border-b
                border-white/10
                shrink-0
              "
            >
              <p
                className="
                  text-[9px]
                  tracking-[0.3em]
                  uppercase
                  text-gray-600
                "
              >
                The completely unnecessary story
              </p>

              <h2 className="mt-2 text-2xl md:text-3xl font-bold">
                Why the hell is it called ooyo?
              </h2>
            </div>

            <div
              className="
                overflow-y-auto
                px-7
                md:px-10
                py-7
                scrollbar-hide
              "
            >
              <div
                className="
                  max-w-xl
                  mx-auto
                  text-sm
                  md:text-base
                  text-gray-400
                  leading-7
                "
              >
                <p className="text-white text-xl font-bold">I WAS BORED.</p>

                <p className="mt-5">
                  Not the "nothing to watch on Netflix" kind of bored.
                </p>

                <p className="mt-4">More like...</p>

                <p className="mt-2 text-white">
                  same job. same routine. same shit.
                </p>

                <p className="mt-5">I wanted to do something different.</p>

                <p className="mt-5">
                  I wanted to meet random people from different countries.
                </p>

                <p className="mt-5">
                  People I'd probably never meet in real life.
                </p>

                <p className="mt-5">Then I realized something.</p>

                <p className="mt-2 text-white text-lg font-semibold">
                  I suck at starting conversations with strangers.
                </p>

                <p className="mt-6">
                  So instead of fixing my conversation skills...
                </p>

                <p className="mt-2 text-white text-xl font-bold">
                  I removed the conversation.
                </p>

                <p className="mt-6">Four strangers.</p>

                <p>A bottle.</p>
                <p>Truth.</p>
                <p>Dare.</p>

                <p>And absolutely no idea what happens next.</p>

                <p className="mt-6">So I built it.</p>

                <p className="mt-5">And somehow...</p>

                <p className="mt-2 text-white text-2xl font-bold">
                  this became ooyo.
                </p>

                <div className="my-9 border-t border-white/10 pt-8">
                  <p className="text-white text-xl font-bold">
                    Okay. But why "ooyo"?
                  </p>

                  <p className="mt-5">Honestly?</p>

                  <p className="mt-2 text-white font-semibold">
                    There is no deep meaning.
                  </p>

                  <p className="mt-5">I needed a name.</p>

                  <p className="mt-5">
                    Almost every decent name was already taken.
                  </p>

                  <p className="mt-5">
                    The domains that weren't taken were either expensive as hell
                    or just terrible.
                  </p>

                  <p className="mt-5">
                    Then I found <span className="text-white">ooyo.in</span>.
                  </p>

                  <p className="mt-5">Available.</p>

                  <p>Cheap.</p>

                  <p>Weird.</p>

                  <p className="mt-2">I kinda liked it.</p>

                  <p className="mt-5">So I took it.</p>

                  <p className="mt-5">No 47-slide branding strategy.</p>

                  <p>No secret meaning.</p>

                  <p>No ancient language.</p>

                  <p className="mt-5 text-white text-lg font-semibold">
                    Just ooyo.
                  </p>
                </div>

                <div className="border-t border-white/10 pt-8 pb-8">
                  <p>And now we're here.</p>

                  <p className="mt-6 text-white text-2xl font-black">
                    fuck off.
                  </p>
                </div>

                <div className="border-t border-white/10 pt-8 pb-8">
                  <p className="text-white font-bold">No followers.</p>

                  <p className="text-white font-bold">No likes.</p>

                  <p className="text-white font-bold">
                    No pretending to be interesting.
                  </p>

                  <p className="mt-6">Just show up.</p>

                  <p>Meet someone.</p>

                  <p>Say something stupid.</p>

                  <p>Tell the truth.</p>

                  <p>Do the dare.</p>

                  <p className="mt-6 text-white text-xl font-bold">
                    See what happens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
