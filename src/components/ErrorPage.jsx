import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  const [stars, setStars] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initialStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
    }));
    setStars(initialStars);
  }, []);

  const text = "THERE IS 1 IMPOSTOR AMONG US";

  if (!mounted) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black text-white" style={{ fontFamily: "'VT323', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

        .star-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: moveStars linear infinite;
        }

        @keyframes moveStars {
          from { left: 100%; }
          to { left: -10%; }
        }

        .crt-overlay::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                      linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06));
          z-index: 30;
          background-size: 100% 3px, 3px 100%;
          pointer-events: none;
        }

        .crt-scanline {
          width: 100%;
          height: 100px;
          z-index: 31;
          background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.05) 10%, rgba(0,0,0,0.1) 100%);
          opacity: 0.1;
          position: absolute;
          bottom: 100%;
          animation: scanline 8s linear infinite;
        }

        @keyframes scanline {
          0% { bottom: 100%; }
          100% { bottom: -100px; }
        }

        @keyframes floatRed {
          0%   { left: -25%; top: 40%; transform: rotate(0deg); }
          25%  { top: 45%; }
          50%  { top: 35%; }
          75%  { top: 40%; }
          100% { left: 125%; top: 40%; transform: rotate(360deg); }
        }

        @keyframes floatBlue {
          0%   { left: -25%; top: 70%; transform: rotate(0deg); }
          25%  { top: 55%; }
          50%  { top: 65%; }
          75%  { top: 70%; }
          100% { left: 125%; top: 70%; transform: rotate(-360deg); }
        }

        .animate-float-red  { animation: floatRed  20s linear infinite; }
        .animate-float-blue { animation: floatBlue 28s linear infinite; animation-delay: 12s; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .fade-in            { animation: fadeIn 1s ease-out forwards; }
        .fade-in-delayed    { opacity: 0; animation: fadeIn 1s ease-out 3.5s forwards; }
        .fade-in-delayed-2  { opacity: 0; animation: fadeIn 1s ease-out 5s   forwards; }
        .fade-in-delayed-3  { opacity: 0; animation: fadeIn 1s ease-out 6.5s forwards; }
      `}</style>

      {/* Stars */}
      <div className="star-field">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              width: star.size,
              height: star.size,
              top: `${star.y}%`,
              left: `${star.x}%`,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.5)`,
              animationDuration: `${25 / star.speed}s`,
              animationDelay: `${Math.random() * -25}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center text-center px-4 select-none">
        <h1 className="text-9xl md:text-[12rem] font-bold tracking-[0.1em] text-white mb-4 leading-none fade-in">
          404
        </h1>

        <div className="mb-8 fade-in">
          <h2 className="text-3xl md:text-5xl text-red-500 uppercase font-black tracking-[0.2em] whitespace-nowrap">
            {text}
          </h2>
        </div>

        <div className="space-y-6 fade-in-delayed">
          <p className="text-2xl md:text-4xl text-gray-400 max-w-2xl mx-auto tracking-wide leading-relaxed">
            This page was ejected into space.
          </p>

          <p className="text-xl md:text-3xl text-white tracking-widest fade-in-delayed-2">
            <span className="text-red-600 font-bold px-2">404-Page</span> was not An Impostor.
          </p>

          <div className="pt-12 fade-in-delayed-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-12 py-4 font-bold text-white transition-all duration-300 bg-transparent border-2 border-white/30 hover:border-white hover:bg-white hover:text-black uppercase tracking-[0.3em] text-xl"
            >
              Return to Ship
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Characters */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-56 h-auto animate-float-red" style={{ left: "-25%" }}>
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-red-among-us-icon-svg-download-png-2691060.png"
            alt="Ejected Red"
            style={{ filter: "drop-shadow(0 0 20px rgba(255,0,0,0.5))" }}
          />
        </div>
        <div className="absolute w-40 h-auto animate-float-blue" style={{ left: "-25%" }}>
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-blue-among-us-icon-svg-download-png-2691064.png"
            alt="Ejected Blue"
            style={{ filter: "drop-shadow(0 0 20px rgba(0,0,255,0.5))", opacity: 0.6 }}
          />
        </div>
      </div>

      {/* CRT Effects */}
      <div className="crt-overlay pointer-events-none absolute inset-0 z-40"></div>
      <div className="crt-scanline z-50"></div>
      <div className="absolute inset-0 pointer-events-none z-20" style={{ background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 100%)" }}></div>
    </div>
  );
};

export default ErrorPage;
