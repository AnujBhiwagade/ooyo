import { useEffect, useRef, useState } from "react";
import socket from "../socket/socket";

function useWebRTC(roomData) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});

  const peerConnections = useRef({});
  const localStreamRef = useRef(null);
  const pendingCandidates = useRef({});

  // ============================
  // ICE SERVERS
  // ============================

  const rtcConfiguration = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  // ============================
  // CREATE PEER CONNECTION
  // ============================

  const createPeerConnection = (playerId) => {
    if (peerConnections.current[playerId]) {
      return peerConnections.current[playerId];
    }

    const peerConnection = new RTCPeerConnection(
      rtcConfiguration
    );

    peerConnections.current[playerId] =
      peerConnection;

    // ============================
    // ADD LOCAL TRACKS
    // ============================

    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => {
          peerConnection.addTrack(
            track,
            localStreamRef.current
          );
        });
    }

    // ============================
    // RECEIVE REMOTE STREAM
    // ============================

    peerConnection.ontrack = (event) => {
      const [stream] = event.streams;

      if (!stream) return;

      setRemoteStreams((previous) => ({
        ...previous,
        [playerId]: stream,
      }));
    };

    // ============================
    // ICE CANDIDATE
    // ============================

    peerConnection.onicecandidate = (event) => {
      if (!event.candidate) {
        return;
      }

      socket.emit("ice-candidate", {
        target: playerId,
        candidate: event.candidate,
      });
    };

    // ============================
    // CONNECTION STATE
    // ============================

    peerConnection.onconnectionstatechange = () => {
      const state =
        peerConnection.connectionState;

      console.log(
        `WebRTC connection with ${playerId}:`,
        state
      );

      if (
        state === "failed" ||
        state === "closed"
      ) {
        peerConnection.close();

        delete peerConnections.current[
          playerId
        ];

        setRemoteStreams((previous) => {
          const updated = {
            ...previous,
          };

          delete updated[playerId];

          return updated;
        });
      }
    };

    return peerConnection;
  };

  // ============================
  // START CAMERA
  // ============================

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        if (!mounted) {
          stream
            .getTracks()
            .forEach((track) => track.stop());

          return;
        }

        localStreamRef.current = stream;

        setLocalStream(stream);
      } catch (error) {
        console.error(
          "Failed to access camera/microphone:",
          error
        );
      }
    };

    startCamera();

    return () => {
      mounted = false;

      if (localStreamRef.current) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        localStreamRef.current = null;
      }
    };
  }, []);

  // ============================
  // EXISTING PLAYERS CREATE OFFERS
  // ============================
  //
  // For every pair of players we use the
  // socket ID to decide who is the OFFERER.
  //
  // This prevents both players from creating
  // offers at the same time.
  //
  // The player with the smaller socket ID
  // creates the offer.
  //
  // ============================

  useEffect(() => {
    if (!localStream) {
      return;
    }

    if (!roomData?.players) {
      return;
    }

    const createOffers = async () => {
      for (const player of roomData.players) {
        if (player.id === socket.id) {
          continue;
        }

        // ============================
        // DETERMINISTIC OFFERER
        // ============================

        const shouldCreateOffer =
          socket.id < player.id;

        if (!shouldCreateOffer) {
          continue;
        }

        const peerConnection =
          createPeerConnection(player.id);

        if (
          peerConnection.signalingState !==
          "stable"
        ) {
          continue;
        }

        try {
          console.log(
            `Creating offer: ${socket.id} → ${player.id}`
          );

          const offer =
            await peerConnection.createOffer();

          await peerConnection.setLocalDescription(
            offer
          );

          socket.emit("video-offer", {
            target: player.id,
            offer: peerConnection.localDescription,
          });
        } catch (error) {
          console.error(
            "Failed to create video offer:",
            error
          );
        }
      }
    };

    createOffers();
  }, [
    localStream,
    roomData?.players,
  ]);

  // ============================
  // RECEIVE OFFER
  // ============================

  useEffect(() => {
    const handleOffer = async ({
      sender,
      offer,
    }) => {
      try {
        console.log(
          `Received offer: ${sender} → ${socket.id}`
        );

        const peerConnection =
          createPeerConnection(sender);

        // ============================
        // SET REMOTE OFFER
        // ============================

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );

        // ============================
        // ADD QUEUED ICE CANDIDATES
        // ============================

        const queuedCandidates =
          pendingCandidates.current[sender] || [];

        for (const candidate of queuedCandidates) {
          await peerConnection.addIceCandidate(
            candidate
          );
        }

        delete pendingCandidates.current[
          sender
        ];

        // ============================
        // CREATE ANSWER
        // ============================

        const answer =
          await peerConnection.createAnswer();

        await peerConnection.setLocalDescription(
          answer
        );

        socket.emit("video-answer", {
          target: sender,
          answer: peerConnection.localDescription,
        });
      } catch (error) {
        console.error(
          "Failed to handle video offer:",
          error
        );
      }
    };

    socket.on(
      "video-offer",
      handleOffer
    );

    return () => {
      socket.off(
        "video-offer",
        handleOffer
      );
    };
  }, []);

  // ============================
  // RECEIVE ANSWER
  // ============================

  useEffect(() => {
    const handleAnswer = async ({
      sender,
      answer,
    }) => {
      try {
        console.log(
          `Received answer: ${sender} → ${socket.id}`
        );

        const peerConnection =
          peerConnections.current[sender];

        if (!peerConnection) {
          return;
        }

        if (
          peerConnection.signalingState !==
          "have-local-offer"
        ) {
          return;
        }

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );

        // ============================
        // ADD QUEUED ICE CANDIDATES
        // ============================

        const queuedCandidates =
          pendingCandidates.current[sender] || [];

        for (const candidate of queuedCandidates) {
          await peerConnection.addIceCandidate(
            candidate
          );
        }

        delete pendingCandidates.current[
          sender
        ];
      } catch (error) {
        console.error(
          "Failed to handle video answer:",
          error
        );
      }
    };

    socket.on(
      "video-answer",
      handleAnswer
    );

    return () => {
      socket.off(
        "video-answer",
        handleAnswer
      );
    };
  }, []);

  // ============================
  // RECEIVE ICE CANDIDATE
  // ============================

  useEffect(() => {
    const handleIceCandidate = async ({
      sender,
      candidate,
    }) => {
      try {
        const peerConnection =
          peerConnections.current[sender];

        if (!peerConnection) {
          return;
        }

        const iceCandidate =
          new RTCIceCandidate(candidate);

        // ============================
        // REMOTE DESCRIPTION NOT READY
        // ============================

        if (
          !peerConnection.remoteDescription
        ) {
          if (
            !pendingCandidates.current[sender]
          ) {
            pendingCandidates.current[sender] =
              [];
          }

          pendingCandidates.current[
            sender
          ].push(iceCandidate);

          return;
        }

        // ============================
        // ADD ICE
        // ============================

        await peerConnection.addIceCandidate(
          iceCandidate
        );
      } catch (error) {
        console.error(
          "Failed to add ICE candidate:",
          error
        );
      }
    };

    socket.on(
      "ice-candidate",
      handleIceCandidate
    );

    return () => {
      socket.off(
        "ice-candidate",
        handleIceCandidate
      );
    };
  }, []);

  // ============================
  // REMOVE OLD PEERS
  // ============================

  useEffect(() => {
    const currentPlayerIds =
      roomData?.players?.map(
        (player) => player.id
      ) || [];

    Object.keys(
      peerConnections.current
    ).forEach((playerId) => {
      if (
        !currentPlayerIds.includes(playerId)
      ) {
        peerConnections.current[
          playerId
        ].close();

        delete peerConnections.current[
          playerId
        ];

        delete pendingCandidates.current[
          playerId
        ];

        setRemoteStreams((previous) => {
          const updated = {
            ...previous,
          };

          delete updated[playerId];

          return updated;
        });
      }
    });
  }, [
    roomData?.players,
  ]);

  // ============================
  // CLEANUP
  // ============================

  useEffect(() => {
    return () => {
      Object.values(
        peerConnections.current
      ).forEach((peerConnection) => {
        peerConnection.close();
      });

      peerConnections.current = {};

      pendingCandidates.current = {};

      if (localStreamRef.current) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        localStreamRef.current = null;
      }
    };
  }, []);

  return {
    localStream,
    remoteStreams,
  };
}

export default useWebRTC;