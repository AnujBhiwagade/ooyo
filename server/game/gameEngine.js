function startCountdown(room, onTick, onComplete) {
  room.countdownStarted = true;

  room.game.phase = "countdown";

  let countdown = 5;

  console.log(`Countdown started in ${room.id}`);

  const countdownInterval = setInterval(() => {
    room.game.countdown = countdown;

    onTick();

    console.log(
      `Room ${room.id} Countdown: ${countdown}`,
    );

    if (countdown === 0) {
      clearInterval(countdownInterval);

      room.game.countdown = 0;

      /*
       * Countdown is finished.
       *
       * The selected player was already chosen
       * before the countdown started.
       */
      room.game.phase = "choice";

      onComplete();

      return;
    }

    countdown--;
  }, 1000);
}

function selectRandomPlayer(room) {
  const randomIndex = Math.floor(
    Math.random() * room.players.length,
  );

  const selectedPlayer =
    room.players[randomIndex];

  selectedPlayer.index = randomIndex;

  room.game.selectedPlayer = selectedPlayer;

  return selectedPlayer;
}

function submitTask(room, playerId, task) {
  const player = room.players.find(
    (player) => player.id === playerId,
  );

  if (!player) {
    return null;
  }

  player.submitted = true;
  player.task = task;

  room.game.submittedTasks.push(task);

  const submittedCount = room.players.filter(
    (player) => player.submitted,
  ).length;

  if (
    submittedCount ===
    room.players.length - 1
  ) {
    room.game.phase = "task-selection";
  }

  return submittedCount;
}

function chooseTask(room, task) {
  if (!task) {
    return false;
  }

  room.game.chosenTask = task;

  room.game.phase = "task-active";

  return true;
}

function startTaskTimer(
  room,
  onTick,
  onComplete,
) {
  room.game.timer = 30;

  const timerInterval = setInterval(() => {
    room.game.timer--;

    onTick();

    if (room.game.timer <= 0) {
      clearInterval(timerInterval);

      room.game.timer = null;

      onComplete();
    }
  }, 1000);
}

function submitVote(room, playerId, vote) {
  if (!room.game.selectedPlayer) {
    return null;
  }

  // Selected player cannot vote
  if (
    playerId ===
    room.game.selectedPlayer.id
  ) {
    return null;
  }

  const player = room.players.find(
    (player) => player.id === playerId,
  );

  if (!player) {
    return null;
  }

  // Remove previous vote
  room.game.successVotes =
    room.game.successVotes.filter(
      (id) => id !== playerId,
    );

  room.game.failVotes =
    room.game.failVotes.filter(
      (id) => id !== playerId,
    );

  // Add new vote
  if (vote === "success") {
    room.game.successVotes.push(playerId);
  } else if (vote === "fail") {
    room.game.failVotes.push(playerId);
  } else {
    return null;
  }

  // Mark player as having voted
  player.voted = true;

  const totalVotes =
    room.game.successVotes.length +
    room.game.failVotes.length;

  const requiredVotes =
    room.players.length - 1;

  const votingComplete =
    totalVotes === requiredVotes;

  return {
    totalVotes,
    requiredVotes,
    votingComplete,
  };
}

function calculateVoteResult(room) {
  const successVotes =
    room.game.successVotes.length;

  const failVotes =
    room.game.failVotes.length;

  const result =
    successVotes > failVotes
      ? "SUCCESS"
      : "FAILED";

  room.game.result = result;

  if (result === "SUCCESS") {
    const selectedPlayer =
      room.players.find(
        (player) =>
          player.id ===
          room.game.selectedPlayer?.id,
      );

    if (selectedPlayer) {
      selectedPlayer.score++;
    }
  }

  return result;
}

function chooseMode(room, mode) {
  if (!room.game.selectedPlayer) {
    return false;
  }

  if (
    mode !== "truth" &&
    mode !== "dare"
  ) {
    return false;
  }

  room.game.mode = mode;

  room.game.phase = "submission";

  room.game.submittedTasks = [];

  return true;
}

module.exports = {
  startCountdown,
  selectRandomPlayer,
  submitTask,
  chooseTask,
  startTaskTimer,
  submitVote,
  calculateVoteResult,
  chooseMode,
};

// i think now our project done now can we clean code which we wright for our understing example Server running on port 3000 User connected: gIc6Sqc7MxjYyyIVAAAB 🌐 PLAYER IP: ::1 🛡 MODERATION RECORD CREATED FOR IP: ::1 🛡 MODERATION DATA: { reports: [], strikes: 0, bannedUntil: null } Total Players: 1 1 joined room-1789229909724 because this unnecessary fill our storage
