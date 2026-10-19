
import { useEffect, useState } from "react";
import socket from "../../socket/socket";

function LandingPage({
  playerName,
  setPlayerName,
  onStart,
  onStartGame,
  onEnterRandomChat,
}) {
  const [showStory, setShowStory] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);

  const startGame = onStartGame || onStart;

  useEffect(() => {
    const handlePlayerCount = (count) => setPlayerCount(count);

    socket.on("player-count", handlePlayerCount);

    return () => {
      socket.off("player-count", handlePlayerCount);
    };
  }, []);

  useEffect(() => {
    const existingSchema = document.getElementById(
      "ooyo-structured-data",
    );

    if (existingSchema) existingSchema.remove();

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
            "Meet strangers through random video chat or play Truth or Dare with a group on Ooyo.",
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
      document.getElementById("ooyo-structured-data")?.remove();
    };
  }, []);

  const goToPage = (page) => {
    window.location.href = page;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToHowItWorks = () => {
    document
      .getElementById("how-ooyo-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEnterKey = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      startGame?.();
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-black/90 px-5 backdrop-blur-xl md:px-10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between md:h-20">
          <button
            onClick={scrollToTop}
            aria-label="Ooyo home"
            className="shrink-0"
          >
            <img
              src="/logo.png"
              alt="Ooyo"
              className="h-7 w-auto object-contain md:h-9"
            />
          </button>

          <nav className="hidden items-center gap-7 text-sm text-gray-400 md:flex">
            <button
              onClick={scrollToHowItWorks}
              className="transition hover:text-white"
            >
              How it works
            </button>
            <button
              onClick={() => setShowStory(true)}
              className="transition hover:text-white"
            >
              Our story
            </button>
            <button
              onClick={() => goToPage("/safety")}
              className="transition hover:text-white"
            >
              Safety
            </button>
          </nav>

          <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-gray-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span>{playerCount} online</span>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="px-5 py-12 sm:py-16 md:px-10 md:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/[0.07] px-3 py-2 text-xs text-purple-200">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                Less scrolling. More meeting people.
              </div>

              <h1 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-[-0.065em] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                MEET
                <br />
                STRANGERS.
                <br />
                <span className="text-purple-400">MAKE IT</span>
                <br />
                INTERESTING.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-gray-400 sm:text-lg">
                Talk to someone new, or get a group together for Truth or
                Dare. No profile to build. Just show up and see what happens.
              </p>

              {/* Name */}
              <div className="mt-8 max-w-lg">
                <label
                  htmlFor="player-name"
                  className="mb-2 block text-sm font-medium text-gray-200"
                >
                  First, what should we call you?
                </label>

                <input
                  id="player-name"
                  type="text"
                  maxLength={24}
                  autoComplete="nickname"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(event) => setPlayerName(event.target.value)}
                  onKeyDown={handleEnterKey}
                  className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-4 text-base text-white outline-none transition placeholder:text-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Choose a name to get started. No account needed.
                </p>
              </div>

              {/* Two clear choices */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onEnterRandomChat?.()}
                  disabled={!playerName?.trim()}
                  className="group flex min-h-32 flex-col items-start justify-between rounded-2xl border border-purple-400/40 bg-purple-500/[0.12] p-5 text-left transition hover:border-purple-300 hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/15 text-xl text-purple-300">
                    ↗
                  </span>
                  <span className="mt-4">
                    <span className="block font-bold text-white">
                      Random Video Chat
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-gray-400">
                      Meet one stranger at a time.
                    </span>
                    <span className="mt-3 block text-sm font-semibold text-purple-300">
                      Start chatting <span className="transition group-hover:translate-x-1">→</span>
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => startGame?.()}
                  disabled={!playerName?.trim()}
                  className="group flex min-h-32 flex-col items-start justify-between rounded-2xl border border-white/15 bg-white/[0.03] p-5 text-left transition hover:border-white/35 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] text-xl">
                    ◉
                  </span>
                  <span className="mt-4">
                    <span className="block font-bold text-white">
                      Truth or Dare Circle
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-gray-400">
                      Join three others. Spin, choose and play.
                    </span>
                    <span className="mt-3 block text-sm font-semibold text-white">
                      Play with a group →
                    </span>
                  </span>
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                <span>✓ No account</span>
                <span>✓ No followers</span>
                <span>✓ You can leave anytime</span>
              </div>
            </div>

            {/* Visual */}
            <div className="relative mx-auto w-full max-w-md md:max-w-lg">
              <div className="absolute inset-10 rounded-full bg-purple-500/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-purple-500/[0.08] p-5 sm:p-8">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>YOUR NEXT CONVERSATION</span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    LIVE POSSIBILITIES
                  </span>
                </div>

                <div className="relative flex aspect-square items-center justify-center">
                  <div className="absolute h-[82%] w-[82%] rounded-full border border-white/[0.07]" />
                  <div className="absolute h-[64%] w-[64%] rounded-full border border-purple-400/15" />
                  <div className="absolute h-[46%] w-[46%] rounded-full border border-white/[0.07]" />

                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-purple-400/20 bg-purple-400/[0.06] sm:h-52 sm:w-52">
                    <img
                      src="/bottleImg.png"
                      alt="The bottle used in Ooyo's Truth or Dare game"
                      className="h-32 w-24 rotate-[18deg] object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.15)] sm:h-40 sm:w-32"
                    />
                  </div>

                  <span className="absolute left-0 top-[28%] rounded-full border border-white/10 bg-black/70 px-3 py-2 text-xs text-gray-300">
                    Say hello
                  </span>
                  <span className="absolute right-0 top-[42%] rounded-full border border-purple-400/20 bg-black/70 px-3 py-2 text-xs text-purple-200">
                    Spin the bottle
                  </span>
                  <span className="absolute bottom-[12%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs text-gray-300">
                    You never know what's next
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <p className="text-sm font-semibold">One-on-one</p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      A new face. A new conversation.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <p className="text-sm font-semibold">Group game</p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Four people. Truth or Dare.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-ooyo-works"
          className="border-t border-white/[0.08] px-5 py-20 md:px-10 md:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-purple-300">
                SIMPLE BY DESIGN
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl md:text-6xl">
                TWO WAYS TO
                <br />
                BREAK THE ICE.
              </h2>
              <p className="mt-5 text-base leading-7 text-gray-400">
                Pick the kind of interaction you're in the mood for. Getting
                started takes just a name and a click.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-purple-400/25 bg-purple-500/[0.06] p-6 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-400/15 text-xl text-purple-300">
                  ↗
                </div>
                <h3 className="mt-6 text-2xl font-bold">
                  01. Random Video Chat
                </h3>
                <p className="mt-3 leading-7 text-gray-400">
                  Get matched with one person for a face-to-face conversation.
                  If the conversation isn't for you, move on and meet someone
                  new.
                </p>
                <p className="mt-5 text-sm text-purple-200">
                  Meet one person at a time.
                </p>
              </article>

              <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.08] text-xl">
                  ◉
                </div>
                <h3 className="mt-6 text-2xl font-bold">
                  02. Truth or Dare Circle
                </h3>
                <p className="mt-3 leading-7 text-gray-400">
                  Join a room with four players. The bottle picks someone,
                  everyone gets involved, and the round unfolds from there.
                </p>
                <p className="mt-5 text-sm text-gray-300">
                  Four players. One bottle. Your turn.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* What makes Ooyo different */}
        <section className="border-t border-white/[0.08] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <div>
              <p className="text-sm font-medium text-purple-300">
                LESS SOCIAL PRESSURE
              </p>
              <h2 className="mt-4 text-4xl font-black leading-[1.02] tracking-[-0.06em] sm:text-5xl md:text-6xl">
                NO FEED.
                <br />
                NO FOLLOWERS.
                <br />
                JUST PEOPLE.
              </h2>
            </div>

            <div className="max-w-xl md:border-l md:border-white/10 md:pl-10">
              <p className="text-lg leading-8 text-gray-300">
                You don't need to build a profile, collect likes, or think of
                the perfect opening line.
              </p>
              <p className="mt-5 leading-7 text-gray-400">
                Choose a mode, meet someone new, and enjoy the moment. You can
                leave a conversation or game whenever you want.
              </p>
              <p className="mt-6 text-xl font-bold text-white">
                Show up. Say hello. See what happens.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-white/[0.08] px-5 py-20 text-center md:px-10 md:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium text-purple-300">
              YOUR NEXT HELLO IS OUT THERE
            </p>
            <h2 className="mt-4 text-5xl font-black tracking-[-0.07em] sm:text-6xl md:text-8xl">
              BORED?
              <br />
              CHANGE THAT.
            </h2>
            <p className="mx-auto mt-5 max-w-lg leading-7 text-gray-400">
              Meet someone new or get a Truth or Dare game going. You choose
              what happens next.
            </p>
            <button
              onClick={scrollToTop}
              className="mt-8 rounded-xl bg-white px-7 py-4 font-bold text-black transition hover:bg-gray-200 active:scale-[0.98]"
            >
              Choose your experience ↑
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">ooyo</p>
            <p className="mt-1 text-xs text-gray-500">
              © {new Date().getFullYear()} Ooyo. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-400">
            <button onClick={() => goToPage("/about")} className="hover:text-white">
              About
            </button>
            <button
              onClick={() => goToPage("/how-to-play")}
              className="hover:text-white"
            >
              How to Play
            </button>
            <button onClick={() => goToPage("/rules")} className="hover:text-white">
              Rules
            </button>
            <button onClick={() => goToPage("/safety")} className="hover:text-white">
              Safety
            </button>
            <button
              onClick={() => goToPage("/community-guidelines")}
              className="hover:text-white"
            >
              Community Guidelines
            </button>
            <button onClick={() => goToPage("/privacy")} className="hover:text-white">
              Privacy
            </button>
            <button onClick={() => goToPage("/terms")} className="hover:text-white">
              Terms
            </button>
            <button onClick={() => goToPage("/contact")} className="hover:text-white">
              Contact
            </button>
            <button
              onClick={() => setShowStory(true)}
              className="hover:text-white"
            >
              Our story
            </button>
          </div>
        </div>
      </footer>

      {/* Story modal */}
      {showStory && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setShowStory(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="story-title"
            className="relative max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0b0b0b] p-6 sm:p-9"
          >
            <button
              onClick={() => setShowStory(false)}
              aria-label="Close story"
              className="absolute right-5 top-4 text-2xl text-gray-500 hover:text-white"
            >
              ×
            </button>

            <p className="text-sm font-medium text-purple-300">THE STORY</p>
            <h2
              id="story-title"
              className="mt-3 text-3xl font-black tracking-tight sm:text-4xl"
            >
              Why the hell is it called Ooyo?
            </h2>

            <div className="mt-6 space-y-4 leading-7 text-gray-400">
              <p className="text-lg font-semibold text-white">
                I wanted to meet random people. I just wasn't great at starting
                conversations.
              </p>
              <p>
                So the idea became simple: bring strangers together, give them
                something to do, and see what happens.
              </p>
              <p>
                Four strangers. A bottle. Truth or Dare. No idea what happens
                next.
              </p>
              <p>
                Then came the name. Most of the names I wanted were taken, so
                I found ooyo.in. It was available, it was weird, and I liked
                it.
              </p>
              <p className="font-semibold text-white">
                No secret meaning. No giant branding strategy. Just Ooyo.
              </p>
            </div>

            <button
              onClick={() => setShowStory(false)}
              className="mt-8 w-full rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-gray-200"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
