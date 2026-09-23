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
    const existingSchema = document.getElementById(
      "ooyo-structured-data",
    );

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
      const schema = document.getElementById(
        "ooyo-structured-data",
      );

      if (schema) {
        schema.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <header
        className="
          h-16
          md:h-20
          px-5
          md:px-10
          flex
          items-center
          justify-between
          border-b
          border-white/[0.06]
        "
      >
        {/* LOGO */}

        <button
          onClick={() => window.scrollTo({
            top: 0,
            behavior: "smooth",
          })}
          className="shrink-0"
          aria-label="Ooyo home"
        >
          <img
            src="/logo.png"
            alt="Ooyo"
            className="
              h-7
              md:h-9
              w-auto
              object-contain
            "
          />
        </button>

        {/* RIGHT SIDE */}

        <div className="flex items-center gap-3 md:gap-8">

          {/* DESKTOP NAV */}

          <nav
            className="
              hidden
              md:flex
              items-center
              gap-7
              text-[10px]
              tracking-[0.18em]
              uppercase
              text-gray-500
            "
          >
            <button
              onClick={() => {
                document
                  .getElementById("how-ooyo-works")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-white transition"
            >
              How it works
            </button>

            <button
              onClick={() => setShowStory(true)}
              className="hover:text-white transition"
            >
              Why ooyo?
            </button>
          </nav>

          {/* ONLINE */}

          <div
            className="
              flex
              items-center
              gap-2
              px-3
              py-1.5
              md:px-3.5
              md:py-2
              border
              border-white/10
              bg-white/[0.02]
              text-[9px]
              md:text-[10px]
              tracking-[0.14em]
              uppercase
              text-gray-500
            "
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />

            <span>
              {playerCount} online
            </span>
          </div>
        </div>
      </header>

      {/* ================================================== */}
      {/* HERO */}
      {/* ================================================== */}

      <main>

        <section
          className="
            min-h-[calc(100svh-4rem)]
            md:min-h-[calc(100vh-5rem)]
            flex
            items-center
            px-5
            md:px-10
            py-8
            md:py-6
          "
        >
          <div
            className="
              w-full
              max-w-7xl
              mx-auto
              grid
              grid-cols-1
              md:grid-cols-[1.05fr_0.95fr]
              gap-10
              md:gap-16
              lg:gap-24
              items-center
            "
          >

            {/* ========================================== */}
            {/* HERO LEFT */}
            {/* ========================================== */}

            <div className="text-center md:text-left">

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  border
                  border-white/10
                  px-3
                  py-1.5
                  text-[8px]
                  md:text-[9px]
                  tracking-[0.22em]
                  uppercase
                  text-gray-500
                "
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />

                Random video chat
              </div>

              <h1
                className="
                  mt-0
                  text-[3.4rem]
                  sm:text-[4.2rem]
                  md:text-[clamp(3.5rem,5.6vw,5.7rem)]
                  leading-[0.86]
                  font-black
                  tracking-[-0.075em]
                "
              >
                FOR PEOPLE
                <br />
                WHO DON'T
                <br />
                KNOW WHAT
                <br />
                TO SAY.
              </h1>

              <p
                className="
                  mt-5
                  md:mt-5
                  max-w-xl
                  mx-auto
                  md:mx-0
                  text-[15px]
                  md:text-lg
                  leading-6
                  md:leading-7
                  text-gray-400
                "
              >
                Meet strangers from around the world.
                <br className="hidden md:block" />
                Play Truth or Dare.
                <br className="hidden md:block" />
                See what happens.
              </p>

              {/* JOIN */}

              <div
                className="
                  mt-6
                  md:mt-6
                  w-full
                  max-w-md
                  mx-auto
                  md:mx-0
                "
              >
                <label
                  htmlFor="player-name"
                  className="sr-only"
                >
                  Your name
                </label>

                <div className="flex flex-col sm:flex-row gap-2">

                  <input
                    id="player-name"
                    type="text"
                    placeholder="What should we call you?"
                    value={playerName}
                    onChange={(e) =>
                      setPlayerName(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onStart();
                      }
                    }}
                    className="
                      flex-1
                      min-w-0
                      bg-white/[0.03]
                      border
                      border-white/15
                      hover:border-white/30
                      focus:border-white/50
                      text-white
                      placeholder:text-gray-600
                      px-4
                      py-3.5
                      outline-none
                      text-sm
                      transition
                    "
                  />

                  <button
                    onClick={onStart}
                    className="
                      shrink-0
                      bg-white
                      text-black
                      px-6
                      py-3.5
                      text-sm
                      font-bold
                      tracking-[0.12em]
                      uppercase
                      hover:bg-gray-200
                      active:scale-[0.98]
                      transition-all
                    "
                  >
                    Enter ooyo →
                  </button>

                </div>

                <p
                  className="
                    mt-3
                    text-[9px]
                    tracking-[0.08em]
                    text-gray-700
                  "
                >
                  No account · No profile · Just show up.
                </p>
              </div>
            </div>

            {/* ========================================== */}
            {/* HERO RIGHT — BOTTLE */}
            {/* ========================================== */}

            <div
              className="
                flex
                items-center
                justify-center
                md:justify-end
              "
            >
              <div
                className="
                  relative
                  w-full
                  max-w-[360px]
                  md:max-w-[430px]
                  aspect-square
                  border
                  border-white/10
                  bg-white/[0.015]
                  overflow-hidden
                "
              >

                {/* subtle rings */}

                <div
                  className="
                    absolute
                    inset-[12%]
                    rounded-full
                    border
                    border-white/[0.05]
                  "
                />

                <div
                  className="
                    absolute
                    inset-[24%]
                    rounded-full
                    border
                    border-purple-500/10
                  "
                />

                {/* corner labels */}

                <span
                  className="
                    absolute
                    top-4
                    left-4
                    text-[8px]
                    tracking-[0.2em]
                    uppercase
                    text-gray-600
                  "
                >
                  04 strangers
                </span>

                <span
                  className="
                    absolute
                    top-4
                    right-4
                    text-[8px]
                    tracking-[0.2em]
                    uppercase
                    text-gray-600
                  "
                >
                  01 room
                </span>

                <span
                  className="
                    absolute
                    bottom-4
                    left-4
                    text-[8px]
                    tracking-[0.2em]
                    uppercase
                    text-gray-600
                  "
                >
                  truth
                </span>

                <span
                  className="
                    absolute
                    bottom-4
                    right-4
                    text-[8px]
                    tracking-[0.2em]
                    uppercase
                    text-gray-600
                  "
                >
                  dare
                </span>

                {/* bottle */}

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                  "
                >
                  <div
                    className="
                      w-28
                      h-28
                      md:w-36
                      md:h-36
                      rounded-full
                      border
                      border-purple-500/10
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <img
                      src="/bottleImg.png"
                      alt="Ooyo game bottle"
                      className="
                        w-20
                        h-28
                        md:w-24
                        md:h-32
                        object-contain
                        rotate-[18deg]
                        opacity-90
                      "
                    />
                  </div>
                </div>

                {/* center label */}

                <div
                  className="
                    absolute
                    bottom-14
                    left-1/2
                    -translate-x-1/2
                    whitespace-nowrap
                    text-[8px]
                    md:text-[9px]
                    tracking-[0.25em]
                    uppercase
                    text-gray-600
                  "
                >
                  let the bottle decide
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* HOW OOYO WORKS */}
        {/* ================================================== */}

        <section
          id="how-ooyo-works"
          className="
            border-t
            border-white/[0.07]
            px-5
            md:px-10
            py-20
            md:py-28
          "
        >
          <div className="max-w-7xl mx-auto">

            {/* section heading */}

            <div
              className="
                flex
                flex-col
                md:flex-row
                md:items-end
                md:justify-between
                gap-5
                mb-12
                md:mb-16
              "
            >
              <div>
                <p
                  className="
                    text-[8px]
                    md:text-[9px]
                    tracking-[0.25em]
                    uppercase
                    text-gray-600
                  "
                >
                  The game
                </p>

                <h2
                  className="
                    mt-3
                    text-4xl
                    md:text-6xl
                    font-black
                    tracking-[-0.06em]
                    leading-none
                  "
                >
                  HOW OOYO WORKS.
                </h2>
              </div>

              <p
                className="
                  max-w-sm
                  text-sm
                  md:text-base
                  leading-6
                  text-gray-500
                  md:text-right
                "
              >
                Four strangers.
                <br />
                One bottle.
                <br />
                Nobody knows what happens next.
              </p>
            </div>

            {/* steps */}

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-3
                border
                border-white/10
              "
            >

              {/* STEP 1 */}

              <div
                className="
                  p-6
                  md:p-8
                  min-h-[240px]
                  md:min-h-[300px]
                  border-b
                  md:border-b-0
                  md:border-r
                  border-white/10
                  flex
                  flex-col
                  justify-between
                "
              >
                <div className="flex items-center justify-between">
                  <span
                    className="
                      text-[10px]
                      tracking-[0.2em]
                      uppercase
                      text-gray-600
                    "
                  >
                    01
                  </span>

                  <span className="text-purple-400 text-sm">
                    ●
                  </span>
                </div>

                <div>
                  <h3
                    className="
                      text-3xl
                      md:text-4xl
                      font-black
                      tracking-[-0.04em]
                    "
                  >
                    MEET.
                  </h3>

                  <p className="mt-3 text-sm text-gray-500 leading-6">
                    Four strangers enter the same room.
                    No profiles. No followers. Just people.
                  </p>
                </div>
              </div>

              {/* STEP 2 */}

              <div
                className="
                  p-6
                  md:p-8
                  min-h-[240px]
                  md:min-h-[300px]
                  border-b
                  md:border-b-0
                  md:border-r
                  border-white/10
                  flex
                  flex-col
                  justify-between
                "
              >
                <div className="flex items-center justify-between">
                  <span
                    className="
                      text-[10px]
                      tracking-[0.2em]
                      uppercase
                      text-gray-600
                    "
                  >
                    02
                  </span>

                  <span className="text-purple-400 text-sm">
                    ↻
                  </span>
                </div>

                <div>
                  <h3
                    className="
                      text-3xl
                      md:text-4xl
                      font-black
                      tracking-[-0.04em]
                    "
                  >
                    SPIN.
                  </h3>

                  <p className="mt-3 text-sm text-gray-500 leading-6">
                    The bottle picks someone randomly.
                    No choosing. No awkward introductions.
                  </p>
                </div>
              </div>

              {/* STEP 3 */}

              <div
                className="
                  p-6
                  md:p-8
                  min-h-[240px]
                  md:min-h-[300px]
                  flex
                  flex-col
                  justify-between
                "
              >
                <div className="flex items-center justify-between">
                  <span
                    className="
                      text-[10px]
                      tracking-[0.2em]
                      uppercase
                      text-gray-600
                    "
                  >
                    03
                  </span>

                  <span className="text-purple-400 text-sm">
                    !
                  </span>
                </div>

                <div>
                  <h3
                    className="
                      text-3xl
                      md:text-4xl
                      font-black
                      tracking-[-0.04em]
                    "
                  >
                    PLAY.
                  </h3>

                  <p className="mt-3 text-sm text-gray-500 leading-6">
                    Truth or Dare.
                    <br />
                    Then find out what happens.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* ATTITUDE SECTION */}
        {/* ================================================== */}

        <section
          className="
            border-t
            border-white/[0.07]
            px-5
            md:px-10
            py-24
            md:py-32
          "
        >
          <div
            className="
              max-w-7xl
              mx-auto
              grid
              grid-cols-1
              md:grid-cols-2
              gap-12
              md:gap-20
              items-center
            "
          >

            {/* LEFT */}

            <div>
              <p
                className="
                  text-[8px]
                  md:text-[9px]
                  tracking-[0.25em]
                  uppercase
                  text-gray-600
                "
              >
                Not another social app
              </p>

              <h2
                className="
                  mt-4
                  text-5xl
                  md:text-7xl
                  font-black
                  tracking-[-0.07em]
                  leading-[0.86]
                "
              >
                NO FEED.
                <br />
                NO FOLLOWERS.
                <br />
                NO PROFILE.
              </h2>
            </div>

            {/* RIGHT */}

            <div
              className="
                md:border-l
                md:border-white/10
                md:pl-12
              "
            >
              <p
                className="
                  text-base
                  md:text-lg
                  text-gray-400
                  leading-7
                "
              >
                You don't need to build a personal brand here.
              </p>

              <p
                className="
                  mt-5
                  text-base
                  md:text-lg
                  text-gray-400
                  leading-7
                "
              >
                Nobody cares how many followers you have.
                There isn't a feed waiting to consume your
                evening.
              </p>

              <p
                className="
                  mt-5
                  text-base
                  md:text-lg
                  text-white
                  leading-7
                  font-medium
                "
              >
                Just show up.
                <br />
                Meet someone.
                <br />
                Say something stupid.
              </p>

              <div className="mt-8">
                <p
                  className="
                    text-[10px]
                    tracking-[0.2em]
                    uppercase
                    text-gray-600
                  "
                >
                  The only rule
                </p>

                <p
                  className="
                    mt-2
                    text-4xl
                    md:text-5xl
                    font-black
                    tracking-[-0.05em]
                  "
                >
                  FUCK IT.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ================================================== */}
        {/* FINAL CTA */}
        {/* ================================================== */}

        <section
          className="
            border-t
            border-white/[0.07]
            px-5
            md:px-10
            py-24
            md:py-32
          "
        >
          <div className="max-w-4xl mx-auto text-center">

            <p
              className="
                text-[8px]
                md:text-[9px]
                tracking-[0.28em]
                uppercase
                text-gray-600
              "
            >
              Still bored?
            </p>

            <h2
              className="
                mt-4
                text-6xl
                sm:text-7xl
                md:text-9xl
                font-black
                tracking-[-0.09em]
                leading-none
              "
            >
              FUCK IT.
            </h2>

            <p
              className="
                mt-5
                text-sm
                md:text-base
                text-gray-500
              "
            >
              Meet someone you've never met.
            </p>

            <button
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="
                mt-8
                inline-flex
                items-center
                justify-center
                bg-white
                text-black
                px-8
                py-4
                text-sm
                font-bold
                tracking-[0.14em]
                uppercase
                hover:bg-gray-200
                active:scale-[0.98]
                transition-all
              "
            >
              Enter ooyo →
            </button>
          </div>
        </section>

      </main>

      {/* ================================================== */}
      {/* FOOTER */}
      {/* ================================================== */}

      <footer
        className="
          border-t
          border-white/[0.07]
          px-5
          md:px-10
          py-6
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-5
          "
        >

          <p
            className="
              text-[9px]
              tracking-[0.15em]
              uppercase
              text-gray-600
            "
          >
            © 2026 ooyo. All rights reserved.
          </p>

          <button
            onClick={() => setShowStory(true)}
            className="
              text-[9px]
              tracking-[0.16em]
              uppercase
              text-gray-500
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
              text-[9px]
              tracking-[0.12em]
              uppercase
              text-gray-600
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

        </div>
      </footer>

      {/* ================================================== */}
      {/* STORY MODAL */}
      {/* ================================================== */}

      {showStory && (
        <div
          className="
            fixed
            inset-0
            z-[200]
            bg-black/90
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
        >
          <div
            className="
              relative
              w-full
              max-w-2xl
              max-h-[85vh]
              bg-black
              border
              border-white/15
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
                px-6
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

              <h2
                className="
                  mt-2
                  text-2xl
                  md:text-3xl
                  font-bold
                "
              >
                Why the hell is it called ooyo?
              </h2>
            </div>

            <div
              className="
                overflow-y-auto
                px-6
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

                <p className="text-white text-xl font-bold">
                  I WAS BORED.
                </p>

                <p className="mt-5">
                  Not the "nothing to watch on Netflix" kind of bored.
                </p>

                <p className="mt-4">
                  More like...
                </p>

                <p className="mt-2 text-white">
                  same job. same routine. same shit.
                </p>

                <p className="mt-5">
                  I wanted to do something different.
                </p>

                <p className="mt-5">
                  I wanted to meet random people from different countries.
                </p>

                <p className="mt-5">
                  People I'd probably never meet in real life.
                </p>

                <p className="mt-5">
                  Then I realized something.
                </p>

                <p className="mt-2 text-white text-lg font-semibold">
                  I suck at starting conversations with strangers.
                </p>

                <p className="mt-6">
                  So instead of fixing my conversation skills...
                </p>

                <p className="mt-2 text-white text-xl font-bold">
                  I removed the conversation.
                </p>

                <p className="mt-6">
                  Four strangers.
                </p>

                <p>A bottle.</p>
                <p>Truth.</p>
                <p>Dare.</p>

                <p>
                  And absolutely no idea what happens next.
                </p>

                <p className="mt-6">
                  So I built it.
                </p>

                <p className="mt-5">
                  And somehow...
                </p>

                <p className="mt-2 text-white text-2xl font-bold">
                  this became ooyo.
                </p>

                <div className="my-9 border-t border-white/10 pt-8">

                  <p className="text-white text-xl font-bold">
                    Okay. But why "ooyo"?
                  </p>

                  <p className="mt-5">
                    Honestly?
                  </p>

                  <p className="mt-2 text-white font-semibold">
                    There is no deep meaning.
                  </p>

                  <p className="mt-5">
                    I needed a name.
                  </p>

                  <p className="mt-5">
                    Almost every decent name was already taken.
                  </p>

                  <p className="mt-5">
                    The domains that weren't taken were either expensive as
                    hell or just terrible.
                  </p>

                  <p className="mt-5">
                    Then I found{" "}
                    <span className="text-white">
                      ooyo.in
                    </span>
                    .
                  </p>

                  <p className="mt-5">
                    Available.
                  </p>

                  <p>
                    Cheap.
                  </p>

                  <p>
                    Weird.
                  </p>

                  <p className="mt-2">
                    I kinda liked it.
                  </p>

                  <p className="mt-5">
                    So I took it.
                  </p>

                  <p className="mt-5">
                    No 47-slide branding strategy.
                  </p>

                  <p>
                    No secret meaning.
                  </p>

                  <p>
                    No ancient language.
                  </p>

                  <p className="mt-5 text-white text-lg font-semibold">
                    Just ooyo.
                  </p>

                </div>

                <div className="border-t border-white/10 pt-8 pb-8">

                  <p>
                    And now we're here.
                  </p>

                  <p className="mt-6 text-white text-2xl font-black">
                    fuck off.
                  </p>

                </div>

                <div className="border-t border-white/10 pt-8 pb-8">

                  <p className="text-white font-bold">
                    No followers.
                  </p>

                  <p className="text-white font-bold">
                    No likes.
                  </p>

                  <p className="text-white font-bold">
                    No pretending to be interesting.
                  </p>

                  <p className="mt-6">
                    Just show up.
                  </p>

                  <p>
                    Meet someone.
                  </p>

                  <p>
                    Say something stupid.
                  </p>

                  <p>
                    Tell the truth.
                  </p>

                  <p>
                    Do the dare.
                  </p>

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