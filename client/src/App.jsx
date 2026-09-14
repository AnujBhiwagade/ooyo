import { useEffect, useState } from "react";

import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./components/landing/LandingPage";

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

import Notification from "./components/notifications/Notification";

import socket from "./socket/socket";

function App() {
  const [playerCount, setPlayerCount] = useState(0);
  const [roomData, setRoomData] = useState(null);
  const [readyData, setReadyData] = useState(null);
  const [gameState, setGameState] = useState(null);

  const [playerName, setPlayerName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  const [notification, setNotification] = useState(null);

  const [currentPage, setCurrentPage] = useState(
    window.location.hash || "",
  );

  console.log(
    "APP RENDER DECISION → hasJoined:",
    hasJoined,
    "socket:",
    socket.id,
    "page:",
    currentPage,
  );

  /* ============================ */
  /* PAGE NAVIGATION */
  /* ============================ */

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(window.location.hash || "");
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  /* ============================ */
  /* START GAME */
  /* ============================ */

  const handleStart = () => {
    if (!playerName.trim()) return;

    console.log(
      "START CLICKED → joining as:",
      playerName,
      "socket:",
      socket.id,
    );

    socket.emit("join-game", {
      name: playerName,
    });

    setHasJoined(true);

    // Return to the normal game URL.
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
  /* SOCKET EVENTS */
  /* ============================ */

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("player-count", (count) => {
      setPlayerCount(count);
    });

    socket.on("room-update", (data) => {
      console.log("ROOM UPDATE", {
        roomId: data.roomId,
        players: data.players.map((p) => p.name),
        mySocket: socket.id,
      });

      console.log(
        "CURRENT ROOM BEFORE UPDATE:",
        roomData?.roomId,
      );

      setRoomData(data);
    });

    socket.on("ready-update", (data) => {
      console.log("READY UPDATE RECEIVED:", data);

      setReadyData(data);
    });

    socket.on("round-reset", () => {
      console.log("ROUND RESET");

      setGameState(null);
    });

    socket.on("player-removed", (data) => {
      console.log("🚨 PLAYER REMOVED:", data);

      setGameState(null);
      setRoomData(null);
      setReadyData(null);
      setHasJoined(false);

      // Return to landing page.
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );

      setCurrentPage("");
    });

    socket.on("game-left", () => {
      console.log("🚪 GAME LEFT - RETURNING HOME");

      setHasJoined(false);
      setRoomData(null);
      setReadyData(null);
      setGameState(null);

      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );

      setCurrentPage("");
    });

    socket.on("game-state-update", (data) => {
      console.log("PHASE:", data.phase);
      console.log("GAME STATE:", data);

      setGameState(data);
    });

    socket.on("player-reported", (data) => {
      console.log("⚠️ PLAYER REPORTED:", data);

      setNotification({
        type: "warning",
        message: data.message,
      });

      setTimeout(() => {
        setNotification(null);
      }, 4000);
    });

    return () => {
      socket.off("connect");
      socket.off("player-count");
      socket.off("room-update");
      socket.off("room-moved");
      socket.off("ready-update");
      socket.off("round-reset");
      socket.off("player-removed");
      socket.off("game-state-update");
      socket.off("player-reported");
      socket.off("game-left");
    };
  }, []);

  /* ============================ */
  /* APP LIFECYCLE */
  /* ============================ */

  useEffect(() => {
    console.log("========== APP LIFECYCLE START ==========");
    console.log("APP MOUNTED");

    console.log(
      "Navigation type:",
      performance.getEntriesByType("navigation")[0]?.type,
    );

    const handleBeforeUnload = () => {
      console.log("🔥 BEFORE UNLOAD");
    };

    const handlePageHide = () => {
      console.log("🔥 PAGE HIDE");
    };

    const handleVisibility = () => {
      console.log(
        "VISIBILITY:",
        document.visibilityState,
      );
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload,
    );

    window.addEventListener(
      "pagehide",
      handlePageHide,
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibility,
    );

    const handleConnect = () => {
      console.log(
        "🔥 SOCKET CONNECTED:",
        socket.id,
      );
    };

    const handleDisconnect = (reason) => {
      console.log(
        "🔥 SOCKET DISCONNECTED:",
        reason,
        "socket:",
        socket.id,
      );
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      console.log("APP UNMOUNTED");

      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload,
      );

      window.removeEventListener(
        "pagehide",
        handlePageHide,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility,
      );

      socket.off("connect", handleConnect);
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
        return <SafetyPage />;

      case "#/community-guidelines":
        return <CommunityGuidelinesPage />;

      case "#/legal":
        return <LegalPage />;

      case "#/privacy":
        return <PrivacyPage />;

      case "#/terms":
        return <TermsPage />;

      case "#/contact":
        return <ContactPage />;

      default:
        return null;
    }
  };

  /* ============================ */
  /* WEBSITE */
  /* ============================ */

  if (!hasJoined) {
    const websitePage = renderWebsitePage();

    if (websitePage) {
      return (
        <WebsiteLayout>
          {websitePage}
        </WebsiteLayout>
      );
    }

    return (
      <LandingPage
        playerName={playerName}
        setPlayerName={setPlayerName}
        onStart={handleStart}
      />
    );
  }

  /* ============================ */
  /* GAME */
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