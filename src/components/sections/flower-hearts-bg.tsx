"use client";

import React from "react";

export function FlowerHeartsBG() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 opacity-60">
      <div className="flowers-wrapper">
        <div className="flowers">
          {/* Flower 1 */}
          <div className="flower flower--1">
            <div className="flower__leafs flower__leafs--1">
              <div className="flower__leaf flower__leaf--1"></div>
              <div className="flower__leaf flower__leaf--2"></div>
              <div className="flower__leaf flower__leaf--3"></div>
              <div className="flower__leaf flower__leaf--4"></div>
              <div className="flower__white-circle"></div>
              <div className="flower__light flower__light--1"></div>
              <div className="flower__light flower__light--2"></div>
            </div>
            <div className="flower__line">
              <div className="flower__line__leaf flower__line__leaf--1"></div>
              <div className="flower__line__leaf flower__line__leaf--2"></div>
            </div>
          </div>

          {/* Flower 2 */}
          <div className="flower flower--2">
            <div className="flower__leafs flower__leafs--2">
              <div className="flower__leaf flower__leaf--1"></div>
              <div className="flower__leaf flower__leaf--2"></div>
              <div className="flower__leaf flower__leaf--3"></div>
              <div className="flower__leaf flower__leaf--4"></div>
              <div className="flower__white-circle"></div>
            </div>
            <div className="flower__line">
              <div className="flower__line__leaf flower__line__leaf--1"></div>
            </div>
          </div>

          {/* Flower 3 */}
          <div className="flower flower--3">
            <div className="flower__leafs flower__leafs--3">
              <div className="flower__leaf flower__leaf--1"></div>
              <div className="flower__leaf flower__leaf--2"></div>
              <div className="flower__leaf flower__leaf--3"></div>
              <div className="flower__leaf flower__leaf--4"></div>
              <div className="flower__white-circle"></div>
            </div>
            <div className="flower__line">
              <div className="flower__line__leaf flower__line__leaf--1"></div>
            </div>
          </div>
        </div>

        {/* Floating Heart Bubbles */}
        <div className="bubbles">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bubble" style={{ "--i": i } as React.CSSProperties}>
              <svg className="heart-svg" viewBox="0 0 32 32">
                <path d="M23.6 2c-3.363 0-6.258 2.736-7.599 5.594-1.342-2.858-4.237-5.594-7.601-5.594-4.637 0-8.4 3.764-8.4 8.401 0 9.433 9.516 11.906 16.001 21.232 6.13-9.268 15.999-12.1 15.999-21.232 0-4.637-3.763-8.401-8.4-8.401z" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .flowers-wrapper {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .flowers {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) scale(0.65);
          width: 600px;
          height: 350px;
        }

        .flower {
          position: absolute;
          bottom: 0;
          transform-origin: bottom center;
        }

        .flower--1 {
          left: 20%;
          animation: moveFlower1 4s linear infinite;
        }
        .flower--2 {
          left: 50%;
          transform: rotate(15deg);
          animation: moveFlower2 4s linear infinite;
        }
        .flower--3 {
          left: 80%;
          transform: rotate(-15deg);
          animation: moveFlower3 4s linear infinite;
        }

        .flower__line {
          height: 180px;
          width: 6px;
          background: linear-gradient(to top, #5b2a86, #7e56a5);
          border-radius: 4px;
        }

        .flower__leafs {
          position: relative;
          width: 50px;
          height: 50px;
        }

        .flower__leaf {
          position: absolute;
          width: 24px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(to top, #b79bd4, #9d7cbf);
          opacity: 0.9;
        }
        .flower__leaf--1 { transform: translate(0, 0) rotate(0deg); }
        .flower__leaf--2 { transform: translate(14px, 10px) rotate(45deg); }
        .flower__leaf--3 { transform: translate(-14px, 10px) rotate(-45deg); }
        .flower__leaf--4 { transform: translate(0, 20px) rotate(90deg); }

        .flower__white-circle {
          position: absolute;
          top: 12px;
          left: 4px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 10px #f59e0b;
        }

        /* Bubbles & Floating SVG Hearts */
        .bubbles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .bubble {
          position: absolute;
          bottom: -40px;
          left: calc(var(--i) * 8% + 4%);
          animation: floatUp calc(6s + var(--i) * 0.8s) linear infinite;
          animation-delay: calc(var(--i) * 0.4s);
          opacity: 0.4;
        }

        .heart-svg {
          width: 20px;
          height: 20px;
          fill: #7e56a5;
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.6) rotate(0deg);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-500px) scale(1.1) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes moveFlower1 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes moveFlower2 {
          0%, 100% { transform: rotate(15deg); }
          50% { transform: rotate(18deg); }
        }
        @keyframes moveFlower3 {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(-12deg); }
        }
      `}</style>
    </div>
  );
}
