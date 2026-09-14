import { useEffect, useRef, useState } from "react";

function BottleArea({ gameState }) {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  const animationRef = useRef(null);
  const lastTimeRef = useRef(null);

  const rotationRef = useRef(0);
  const speedRef = useRef(60);

  const phaseRef = useRef(gameState?.phase);
  const countdownRef = useRef(gameState?.countdown);

  const targetRotationRef = useRef(null);
  const previousCountdownRef = useRef(null);

  // ============================
  // SYNC SERVER STATE
  // ============================

  useEffect(() => {
    phaseRef.current = gameState?.phase;
    countdownRef.current = gameState?.countdown;
  }, [
    gameState?.phase,
    gameState?.countdown,
  ]);

  // ============================
  // PREPARE FINAL TARGET
  // ============================
  //
  // IMPORTANT:
  //
  // We DO NOT calculate the target
  // during countdown 5, 4 or 3.
  //
  // The bottle freely spins until 2.
  //
  // At countdown 2 we calculate the
  // final forward-only destination.
  // ============================

  useEffect(() => {
    const countdown = gameState?.countdown;
    const selectedIndex =
      gameState?.selectedPlayer?.index;

    if (selectedIndex === undefined) {
      targetRotationRef.current = null;
      previousCountdownRef.current = countdown;
      return;
    }

    /*
     * Reset target when a new countdown starts.
     */
    if (
      countdown === 5 &&
      previousCountdownRef.current !== 5
    ) {
      targetRotationRef.current = null;
    }

    /*
     * Calculate target ONLY when we
     * enter countdown 2.
     */
    if (
      countdown === 2 &&
      previousCountdownRef.current !== 2
    ) {
      const directionMap = {
        0: 270,
        1: 0,
        2: 180,
        3: 90,
      };

      const targetAngle =
        directionMap[selectedIndex] ?? 0;

      const currentAngle =
        ((rotationRef.current % 360) + 360) % 360;

      /*
       * Always calculate a forward distance.
       */
      let difference =
        targetAngle - currentAngle;

      if (difference < 0) {
        difference += 360;
      }

      /*
       * Add ONE complete rotation so
       * the final approach has enough
       * distance to feel natural.
       *
       * This target is created at 2,
       * not at 5.
       */
      targetRotationRef.current =
        rotationRef.current +
        360 +
        difference;
    }

    previousCountdownRef.current = countdown;
  }, [
    gameState?.countdown,
    gameState?.selectedPlayer?.index,
  ]);

  // ============================
  // ANIMATION LOOP
  // ============================

  useEffect(() => {
    const animate = (time) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const delta = Math.min(
        (time - lastTimeRef.current) / 1000,
        0.05,
      );

      lastTimeRef.current = time;

      const phase = phaseRef.current;
      const countdown = countdownRef.current;

      // ==================================================
      // COUNTDOWN 5
      // ACCELERATE
      // ==================================================

      if (
        phase === "countdown" &&
        countdown === 5
      ) {
        const targetSpeed = 420;

        speedRef.current +=
          (targetSpeed - speedRef.current) *
          Math.min(delta * 4, 1);

        rotationRef.current +=
          speedRef.current * delta;

        setRotation(rotationRef.current);

        setScale((previous) =>
          Math.min(
            previous + delta * 0.3,
            1.25,
          ),
        );
      }

      // ==================================================
      // COUNTDOWN 4
      // FAST SPIN
      // ==================================================

      else if (
        phase === "countdown" &&
        countdown === 4
      ) {
        const targetSpeed = 620;

        speedRef.current +=
          (targetSpeed - speedRef.current) *
          Math.min(delta * 3, 1);

        rotationRef.current +=
          speedRef.current * delta;

        setRotation(rotationRef.current);
      }

      // ==================================================
      // COUNTDOWN 3
      // CONTROLLED DECELERATION
      // ==================================================

      else if (
        phase === "countdown" &&
        countdown === 3
      ) {
        const targetSpeed = 280;

        speedRef.current +=
          (targetSpeed - speedRef.current) *
          Math.min(delta * 2.5, 1);

        rotationRef.current +=
          speedRef.current * delta;

        setRotation(rotationRef.current);

        setScale((previous) =>
          Math.max(
            1,
            previous - delta * 0.25,
          ),
        );
      }

      // ==================================================
      // COUNTDOWN 2
      // FINAL APPROACH STARTS
      // ==================================================

      else if (
        phase === "countdown" &&
        countdown === 2
      ) {
        const target =
          targetRotationRef.current;

        if (target !== null) {
          const remaining =
            target - rotationRef.current;

          if (remaining > 0) {
            /*
             * Smoothly reduce the speed as
             * the bottle approaches the target.
             */
            const desiredSpeed = Math.max(
              80,
              Math.min(
                360,
                remaining * 1.2,
              ),
            );

            speedRef.current +=
              (desiredSpeed - speedRef.current) *
              Math.min(delta * 3, 1);

            const movement =
              Math.min(
                speedRef.current * delta,
                remaining,
              );

            rotationRef.current += movement;

            setRotation(
              rotationRef.current,
            );
          }
        }

        setScale((previous) =>
          Math.max(
            1,
            previous - delta * 0.3,
          ),
        );
      }

      // ==================================================
      // COUNTDOWN 1
      // CONTINUE FINAL MOVEMENT
      // ==================================================

      else if (
        phase === "countdown" &&
        countdown === 1
      ) {
        const target =
          targetRotationRef.current;

        if (target !== null) {
          const remaining =
            target - rotationRef.current;

          if (remaining > 0) {
            /*
             * Slower final approach.
             */
            const desiredSpeed = Math.max(
              25,
              remaining * 1.5,
            );

            speedRef.current +=
              (desiredSpeed - speedRef.current) *
              Math.min(delta * 4, 1);

            const movement =
              Math.min(
                speedRef.current * delta,
                remaining,
              );

            rotationRef.current += movement;

            setRotation(
              rotationRef.current,
            );
          }
        }

        setScale(1);
      }

      // ==================================================
      // COUNTDOWN 0
      // FINAL STOP
      // ==================================================

      else if (
        phase === "countdown" &&
        countdown === 0
      ) {
        const target =
          targetRotationRef.current;

        if (target !== null) {
          rotationRef.current = target;
          setRotation(target);
        }

        speedRef.current = 0;
        setScale(1);
      }

      // ==================================================
      // CHOICE
      // HOLD
      // ==================================================

      else if (phase === "choice") {
        const target =
          targetRotationRef.current;

        if (target !== null) {
          rotationRef.current = target;
          setRotation(target);
        }

        speedRef.current = 0;
        setScale(1);
      }

      // ==================================================
      // OTHER PHASES
      // IDLE ROTATION
      // ==================================================

      else if (
        phase === "waiting" ||
        phase === "submission" ||
        phase === "task-selection" ||
        phase === "task-active" ||
        phase === "voting" ||
        phase === "result"
      ) {
        const targetSpeed = 60;

        speedRef.current +=
          (targetSpeed - speedRef.current) *
          Math.min(delta * 3, 1);

        rotationRef.current +=
          speedRef.current * delta;

        setRotation(
          rotationRef.current,
        );

        setScale((previous) =>
          Math.max(
            1,
            previous - delta * 1.2,
          ),
        );

        if (phase === "waiting") {
          targetRotationRef.current = null;
          previousCountdownRef.current = null;
          speedRef.current = 60;
        }
      }

      animationRef.current =
        requestAnimationFrame(animate);
    };

    animationRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current,
        );
      }

      lastTimeRef.current = null;
    };
  }, []);

  return (
    <div className="pointer-events-none flex items-center justify-center">
      <div
        style={{
          transform: `
            rotate(${rotation}deg)
            scale(${scale})
          `,
          willChange: "transform",
        }}
        className="
          w-16
          h-24
          select-none
          flex
          items-center
          justify-center
        "
      >
        <img
          src="/bottleImg.png"
          alt="Spinning bottle"
          className="
            w-full
            h-full
            object-contain
            pointer-events-none
          "
        />
      </div>
    </div>
  );
}

export default BottleArea;