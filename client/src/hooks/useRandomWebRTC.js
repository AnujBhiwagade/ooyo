
import { useCallback, useEffect, useRef, useState } from "react";
import socket from "../socket/socket";

const RTC_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function useRandomWebRTC(sessionId, partnerId) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [connectionState, setConnectionState] = useState("idle");

  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const pendingIceRef = useRef([]);
  const sessionRef = useRef(sessionId);
  const partnerRef = useRef(partnerId);
  const makingOfferRef = useRef(false);

  sessionRef.current = sessionId;
  partnerRef.current = partnerId;

  const closePeer = useCallback(() => {
    const peer = peerRef.current;

    if (peer) {
      peer.onicecandidate = null;
      peer.ontrack = null;
      peer.onconnectionstatechange = null;
      peer.close();
      peerRef.current = null;
    }

    pendingIceRef.current = [];
    remoteStreamRef.current = null;
    makingOfferRef.current = false;
    setRemoteStream(null);
    setConnectionState("idle");
  }, []);

  // Obtain local camera and microphone once.
  useEffect(() => {
    let cancelled = false;
    let acquiredStream = null;

    async function startLocalMedia() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera access requires HTTPS or localhost.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        acquiredStream = stream;

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);
        setCameraError("");
      } catch (error) {
        if (!cancelled) {
          setCameraError(
            error.name === "NotAllowedError"
              ? "Camera or microphone permission was denied."
              : error.message || "Could not access your camera.",
          );
        }
      }
    }

    startLocalMedia();

    return () => {
      cancelled = true;
      acquiredStream?.getTracks().forEach((track) => track.stop());

      if (localStreamRef.current === acquiredStream) {
        localStreamRef.current = null;
      }
    };
  }, []);

  const createPeer = useCallback(() => {
    if (peerRef.current) return peerRef.current;

    const peer = new RTCPeerConnection(RTC_CONFIG);
    peerRef.current = peer;

    const stream = localStreamRef.current;

    if (stream) {
      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });
    }

    peer.onicecandidate = (event) => {
      if (!event.candidate) return;

      const activeSession = sessionRef.current;
      const activePartner = partnerRef.current;

      if (!activeSession || !activePartner) return;

      socket.emit("random-video-ice-candidate", {
        sessionId: activeSession,
        candidate: event.candidate,
      });
    };

    peer.ontrack = (event) => {
      if (
        peerRef.current !== peer ||
        !sessionRef.current
      ) {
        return;
      }

      let stream = event.streams?.[0];

      if (!stream) {
        if (!remoteStreamRef.current) {
          remoteStreamRef.current = new MediaStream();
        }

        stream = remoteStreamRef.current;

        if (!stream.getTracks().some((track) => track.id === event.track.id)) {
          stream.addTrack(event.track);
        }
      }

      remoteStreamRef.current = stream;
      setRemoteStream(stream);
    };

    peer.onconnectionstatechange = () => {
      if (peerRef.current !== peer) return;

      setConnectionState(peer.connectionState);

      if (
        peer.connectionState === "failed" ||
        peer.connectionState === "closed"
      ) {
        setRemoteStream(null);
      }
    };

    return peer;
  }, []);

  // Apply ICE candidates received before the remote description.
  const flushPendingIce = useCallback(async (peer) => {
    if (!peer.remoteDescription) return;

    const pending = pendingIceRef.current.splice(0);

    for (const item of pending) {
      if (
        item.sessionId !== sessionRef.current ||
        peerRef.current !== peer
      ) {
        continue;
      }

      try {
        await peer.addIceCandidate(item.candidate);
      } catch (error) {
        console.error("Could not apply queued ICE candidate:", error);
      }
    }
  }, []);

  // Set up the connection for each matched stranger.
  useEffect(() => {
    if (!sessionId || !partnerId || !localStream) {
      closePeer();
      return;
    }

    let cancelled = false;

    pendingIceRef.current = [];
    setConnectionState("connecting");

    async function startConnection() {
      try {
        const peer = createPeer();

        // Only one peer creates the offer.
        if (socket.id < partnerId) {
          makingOfferRef.current = true;

          const offer = await peer.createOffer();

          if (
            cancelled ||
            sessionRef.current !== sessionId ||
            peerRef.current !== peer
          ) {
            return;
          }

          await peer.setLocalDescription(offer);

          socket.emit("random-video-offer", {
            sessionId,
            offer: peer.localDescription,
          });
        }
      } catch (error) {
        console.error("Random WebRTC setup failed:", error);
        if (!cancelled) setConnectionState("failed");
      } finally {
        makingOfferRef.current = false;
      }
    }

    startConnection();

    return () => {
      cancelled = true;
      closePeer();
    };
  }, [
    sessionId,
    partnerId,
    localStream,
    createPeer,
    closePeer,
  ]);

  // Handle WebRTC signaling events.
  useEffect(() => {
    const isCurrentSession = (data) =>
      data?.sessionId === sessionRef.current &&
      data?.sender === partnerRef.current;

    const handleOffer = async (data) => {
      if (!isCurrentSession(data) || !data.offer) return;

      try {
        const peer = createPeer();

        if (peer.signalingState !== "stable") {
          await peer.setLocalDescription({ type: "rollback" });
        }

        await peer.setRemoteDescription(data.offer);
        await flushPendingIce(peer);

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        if (
          sessionRef.current !== data.sessionId ||
          peerRef.current !== peer
        ) {
          return;
        }

        socket.emit("random-video-answer", {
          sessionId: data.sessionId,
          answer: peer.localDescription,
        });
      } catch (error) {
        console.error("Random WebRTC offer failed:", error);
        setConnectionState("failed");
      }
    };

    const handleAnswer = async (data) => {
      if (!isCurrentSession(data) || !data.answer) return;

      try {
        const peer = peerRef.current;

        if (!peer || peer.signalingState !== "have-local-offer") return;

        await peer.setRemoteDescription(data.answer);
        await flushPendingIce(peer);
      } catch (error) {
        console.error("Random WebRTC answer failed:", error);
        setConnectionState("failed");
      }
    };

    const handleIceCandidate = async (data) => {
      if (!isCurrentSession(data) || !data.candidate) return;

      const peer = peerRef.current;

      if (!peer) return;

      if (!peer.remoteDescription) {
        pendingIceRef.current.push({
          sessionId: data.sessionId,
          candidate: data.candidate,
        });
        return;
      }

      try {
        await peer.addIceCandidate(data.candidate);
      } catch (error) {
        console.error("Random WebRTC ICE candidate failed:", error);
      }
    };

    socket.on("random-video-offer", handleOffer);
    socket.on("random-video-answer", handleAnswer);
    socket.on("random-video-ice-candidate", handleIceCandidate);

    return () => {
      socket.off("random-video-offer", handleOffer);
      socket.off("random-video-answer", handleAnswer);
      socket.off("random-video-ice-candidate", handleIceCandidate);
    };
  }, [createPeer, flushPendingIce]);

  useEffect(() => {
    return () => {
      closePeer();

      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    };
  }, [closePeer]);

  const toggleCamera = useCallback(() => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return false;

    track.enabled = !track.enabled;
    return track.enabled;
  }, []);

  const toggleMicrophone = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return false;

    track.enabled = !track.enabled;
    return track.enabled;
  }, []);

  return {
    localStream,
    remoteStream,
    cameraError,
    connectionState,
    toggleCamera,
    toggleMicrophone,
  };
}
