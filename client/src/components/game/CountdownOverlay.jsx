function CountdownOverlay({ countdown }) {
  return (
    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">

      <div className="text-center">

        <h1 className="text-8xl font-bold animate-pulse">

          {countdown}

        </h1>

        <p className="text-xl mt-4 text-gray-300">
          Round Starting
        </p>

      </div>

    </div>
  );
}

export default CountdownOverlay;