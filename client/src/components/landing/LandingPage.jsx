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
    window.location.hash = page;
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col">
      {/* ============================ */}
      {/* HEADER */}
      {/* ============================ */}

      <nav className="h-16 md:h-20 px-6 md:px-10 flex items-center justify-between shrink-0">
        <div>
          <img
            src="/logo.png"
            alt="ooyo"
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
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />

          <span>{playerCount} online</span>
        </div>
      </nav>

      {/* ============================ */}
      {/* HERO */}
      {/* ============================ */}

      <main className="flex-1 min-h-0 flex items-center justify-center px-6 pb-8">
        <div className="w-full max-w-4xl text-center">
          <p className="text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-gray-600 mb-5">
            There was no master plan.
          </p>

          <h1
            className="
              text-[clamp(3.5rem,8.5vw,7rem)]
              leading-[0.82]
              font-black
              tracking-[-0.07em]
            "
          >
            I WAS
            <br />
            BORED.
          </h1>

          <div className="mt-6 max-w-lg mx-auto">
            <p className="text-base md:text-lg text-white">
              I wanted to meet random people from around the world.
            </p>

            <p className="mt-2 text-sm md:text-base text-gray-500">
              Then I realized I suck at starting conversations.
            </p>
          </div>

          <div className="mt-6">
            <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
              So I removed the awkward part.
            </p>

            <h2 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">
              FUCK IT.
            </h2>

            <p className="mt-1 text-sm text-gray-500">Truth. Dare. Go.</p>
          </div>

          {/* ============================ */}
          {/* JOIN */}
          {/* ============================ */}

          <div className="mt-7 w-full max-w-sm mx-auto">
            <input
              type="text"
              placeholder="What should we call you?"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onStart();
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
      </main>

      {/* ============================ */}
      {/* FOOTER */}
      {/* ============================ */}

      <footer
        className="
          h-12
          md:h-14
          px-6
          md:px-10
          flex
          items-center
          justify-between
          shrink-0
          border-t
          border-white/10
        "
      >
        <p className="text-[10px] tracking-[0.15em] uppercase text-gray-500">
          © 2026 ooyo. All rights reserved.
        </p>

        <button
          onClick={() => setShowStory(true)}
          className="
            absolute
            left-1/2
            -translate-x-1/2
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

        <div className="flex items-center gap-3 md:gap-5 text-[10px] tracking-[0.12em] uppercase text-gray-500">
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
        <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex items-center justify-center px-5">
          <div className="relative w-full max-w-2xl max-h-[78vh] bg-black border border-white/20 flex flex-col">
            <button
              onClick={() => setShowStory(false)}
              className="absolute top-4 right-5 text-gray-500 hover:text-white text-xl transition z-10"
            >
              ×
            </button>

            <div className="px-7 md:px-10 pt-7 pb-5 border-b border-white/10 shrink-0">
              <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
                The completely unnecessary story
              </p>

              <h2 className="mt-2 text-2xl md:text-3xl font-bold">
                Why the hell is it called ooyo?
              </h2>
            </div>

            <div className="overflow-y-auto px-7 md:px-10 py-7 scrollbar-hide">
              <div className="max-w-xl text-sm md:text-base text-gray-400 leading-7">
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
