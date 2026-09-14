import PlayerTile from "./PlayerTile";
import BottleArea from "../bottle/BottleArea";
import useWebRTC from "../../hooks/useWebRTC";
import socket from "../../socket/socket";

function VideoGrid({
  roomData,
  gameState,
  onBottleStopped,
}) {
  const {
    localStream,
    remoteStreams,
  } = useWebRTC(roomData);

  return (
    <div className="relative flex-1 p-4">
      {/* PLAYER TILES */}
      <div
        className="
          relative
          z-0
          grid
          grid-cols-2
          grid-rows-2
          gap-3
          p-1
          h-full
        "
      >
        {roomData?.players?.map((player) => (
          <PlayerTile
            key={player.id}
            player={player}
            selected={
              gameState?.selectedPlayer?.id ===
              player.id
            }
            gameState={gameState}
            localStream={
              player.id === socket.id
                ? localStream
                : remoteStreams[player.id]
            }
          />
        ))}
      </div>

      {/* BOTTLE */}
      <div
        className="
          absolute
          inset-0
          z-50
          flex
          items-center
          justify-center
          pointer-events-none
        "
      >
        <BottleArea
          gameState={gameState}
          onBottleStopped={onBottleStopped}
        />
      </div>
    </div>
  );
}

export default VideoGrid;