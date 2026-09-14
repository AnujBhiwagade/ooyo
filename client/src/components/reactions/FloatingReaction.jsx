import { useEffect } from "react";

function FloatingReaction({ emoji, onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="absolute bottom-20 left-1/2 z-50 text-4xl reaction-float pointer-events-none">
      {emoji}
    </div>
  );
}

export default FloatingReaction;