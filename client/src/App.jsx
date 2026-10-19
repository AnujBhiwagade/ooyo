
import { useEffect, useState } from "react";

import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./components/landing/LandingPage";
import RandomChatPage from "./components/randomChat/RandomChatPage";

import WebsiteLayout from "./components/website/WebsiteLayout";
import AboutPage from "./components/website/AboutPage";
import HowToPlayPage from "./components/website/HowToPlayPage";
import RulesPage from "./components/website/RulesPage";
import SafetyPage from "./components/website/SafetyPage";
import CommunityGuidelinesPage from "./components/website/CommunityGuidelinesPage";
import PrivacyPage from "./components/website/PrivacyPage";
import TermsPage from "./components/website/TermsPage";
import ContactPage from "./components/website/ContactPage";
import LegalPage from "./components/website/LegalPage";
import OmegleAlternativePage from "./components/website/OmegleAlternativePage";

import Notification from "./components/notifications/Notification";
import socket from "./socket/socket";

function App() {
  const [playerCount, setPlayerCount] = useState(0);
  const [roomData, setRoomData] = useState(null);
  const [readyData, setReadyData] = useState(null);
  const [gameState, setGameState] = useState(null);

  const [playerName, setPlayerName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [randomChatActive, setRandomChatActive] = useState(false);

  const [notification, setNotification] = useState(null);

  const [currentPage, setCurrentPage] = useState(
    window.location.hash || window.location.pathname || "",
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(
        window.location.hash || window.location.pathname || "",
      );
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  /* ============================ */
  /* START TRUTH OR DARE */
  /* ============================ */

  const handleStart = () => {
    const name = playerName.trim();

    if (!name) {
      setNotification({
        type: "warning",
        message: "Please enter your name first.",
      });
      return;
    }

    socket.emit("join-game", { name });
    setHasJoined(true);
    setRandomChatActive(false);

    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );

      setCurrentPage("");
    }
  };

  /* ============================ */
  /* START RANDOM VIDEO CHAT */
  /* ============================ */

  const handleEnterRandomChat = () => {
    const name = playerName.trim();

    if (!name) {
      setNotification({
        type: "warning",
        message: "Please enter your name first.",
      });
      return;
    }

    // Random chat has its own queue.
    // Do not emit "join-game" here.
    setRandomChatActive(true);
  };

  const handleLeaveRandomChat = () => {
    setRandomChatActive(false);
    setNotification(null);
  };

  /* ============================ */
  /* SOCKET EVENTS */
  /* ============================ */

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected:", socket.id);
    };

    const handlePlayerCount = (count) => {
      setPlayerCount(count);
    };

    const handleRoomUpdate = (data) => {
      console.log("ROOM UPDATE", {
        roomId: data.roomId,
        players: data.players.map((player) => player.name),
        mySocket: socket.id,
      });

      setRoomData(data);
    };

    const handleReadyUpdate = (data) => {
      setReadyData(data);
    };

    const handleRoundReset = () => {
      setGameState(null);
    };

    const returnHome = () => {
      setGameState(null);
      setRoomData(null);
      setReadyData(null);
      setHasJoined(false);

      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );

      setCurrentPage("");
    };

    const handlePlayerRemoved = (data) => {
      console.log("PLAYER REMOVED:", data);

      setNotification({
        type: "warning",
        message: data?.message || "You have been removed from the game.",
      });

      returnHome();
    };

    const handleGameLeft = () => {
      console.log("GAME LEFT");
      returnHome();
    };

    const handleGameStateUpdate = (data) => {
      console.log("GAME PHASE:", data.phase);
      setGameState(data);
    };

    const handlePlayerReported = (data) => {
      setNotification({
        type: "warning",
        message: data.message,
      });
    };

    socket.on("connect", handleConnect);
    socket.on("player-count", handlePlayerCount);
    socket.on("room-update", handleRoomUpdate);
    socket.on("ready-update", handleReadyUpdate);
    socket.on("round-reset", handleRoundReset);
    socket.on("player-removed", handlePlayerRemoved);
    socket.on("game-left", handleGameLeft);
    socket.on("game-state-update", handleGameStateUpdate);
    socket.on("player-reported", handlePlayerReported);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("player-count", handlePlayerCount);
      socket.off("room-update", handleRoomUpdate);
      socket.off("room-moved");
      socket.off("ready-update", handleReadyUpdate);
      socket.off("round-reset", handleRoundReset);
      socket.off("player-removed", handlePlayerRemoved);
      socket.off("game-left", handleGameLeft);
      socket.off("game-state-update", handleGameStateUpdate);
      socket.off("player-reported", handlePlayerReported);
    };
  }, []);

  /* ============================ */
  /* APP LIFECYCLE LOGGING */
  /* ============================ */

  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("Page unloading");
    };

    const handlePageHide = () => {
      console.log("Page hidden");
    };

    const handleVisibility = () => {
      console.log("Visibility:", document.visibilityState);
    };

    const handleDisconnect = (reason) => {
      console.log("Socket disconnected:", reason);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibility);

    socket.on("disconnect", handleDisconnect);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibility);

      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  /* ============================ */
  /* WEBSITE PAGE ROUTER */
  /* ============================ */

  const renderWebsitePage = () => {
    switch (currentPage) {
      case "#/about":
        return <AboutPage />;

      case "#/how-to-play":
        return <HowToPlayPage />;

      case "#/rules":
        return <RulesPage />;

      case "#/safety":
      case "/safety":
        return <SafetyPage />;

      case "#/community-guidelines":
      case "/community-guidelines":
        return <CommunityGuidelinesPage />;

      case "#/legal":
      case "/legal":
        return <LegalPage />;

      case "#/privacy":
      case "/privacy":
        return <PrivacyPage />;

      case "#/terms":
      case "/terms":
        return <TermsPage />;

      case "#/contact":
      case "/contact":
        return <ContactPage />;

      case "#/omegle-alternative":
      case "/omegle-alternative":
        return <OmegleAlternativePage />;

      default:
        return null;
    }
  };

  /* ============================ */
  /* RANDOM CHAT SCREEN */
  /* ============================ */

  if (randomChatActive && !hasJoined) {
    return (
      <RandomChatPage
        playerName={playerName.trim()}
        onLeave={handleLeaveRandomChat}
      />
    );
  }

  /* ============================ */
  /* WEBSITE / LANDING PAGE */
  /* ============================ */

  if (!hasJoined) {
    const websitePage = renderWebsitePage();

    if (websitePage) {
      return <WebsiteLayout>{websitePage}</WebsiteLayout>;
    }

    return (
      <>
        <LandingPage
          playerName={playerName}
          setPlayerName={setPlayerName}
          onStart={handleStart}
          onStartGame={handleStart}
          onEnterRandomChat={handleEnterRandomChat}
        />

        <Notification notification={notification} />
      </>
    );
  }

  /* ============================ */
  /* EXISTING TRUTH OR DARE GAME */
  /* ============================ */

  return (
    <>
      <Notification notification={notification} />

      <MainLayout
        playerCount={playerCount}
        roomData={roomData}
        readyData={readyData}
        gameState={gameState}
      />
    </>
  );
}

export default App;
