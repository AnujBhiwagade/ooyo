function WebsiteLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ============================ */}
      {/* HEADER */}
      {/* ============================ */}

      <header className="h-20 px-6 md:px-10 flex items-center justify-between border-b border-white/10 shrink-0">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="ooyo"
            className="h-9 w-auto object-contain"
          />
        </a>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[10px] tracking-[0.18em] uppercase text-gray-500">
          <a
            href="/#/about"
            className="hover:text-white transition"
          >
            The Idea
          </a>

          <a
            href="/#/how-to-play"
            className="hover:text-white transition"
          >
            The Game
          </a>

          <a
            href="/#/rules"
            className="hover:text-white transition"
          >
            Rules
          </a>

          <a
            href="/"
            className="text-white hover:text-gray-300 transition"
          >
            Play →
          </a>
        </nav>
      </header>

      {/* ============================ */}
      {/* PAGE CONTENT */}
      {/* ============================ */}

      <main className="flex-1">
        {children}
      </main>

      {/* ============================ */}
      {/* FOOTER */}
      {/* ============================ */}

      <footer className="border-t border-white/10 px-6 md:px-10 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <p className="text-[10px] tracking-[0.15em] uppercase text-gray-500">
            © ooyo
          </p>

          {/* Center */}
          <a
            href="/#/about"
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
          </a>

          {/* Right */}
          <div className="flex items-center gap-4 text-[10px] tracking-[0.12em] uppercase text-gray-500">
            <a
              href="/#/about"
              className="hover:text-white transition"
            >
              About
            </a>

            <span className="text-gray-800">•</span>

            <a
              href="/#/how-to-play"
              className="hover:text-white transition"
            >
              How to Play
            </a>

            <span className="text-gray-800">•</span>

            <a
              href="/#/rules"
              className="hover:text-white transition"
            >
              Rules
            </a>

            <span className="text-gray-800">•</span>

            <a
              href="/#/legal"
              className="hover:text-white transition"
            >
              Legal
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default WebsiteLayout;