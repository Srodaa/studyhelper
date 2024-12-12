import React, { useEffect, useState } from "react";

interface RainEffectProps {
  topStart: number;
}

const RainEffect: React.FC<RainEffectProps> = ({ topStart }) => {
  const [drops, setDrops] = useState<number[]>([]);
  useEffect(() => {
    const numberOfDrops = 40;
    const dropsArray: number[] = [];

    for (let i = 0; i < numberOfDrops; i++) {
      dropsArray.push(i);
    }

    setDrops(dropsArray);
  }, []);

  return (
    <div className="rain">
      {drops.map((_, index) => {
        const left = Math.random() * 100; //pozi
        const dropSpeed = topStart === 0 ? 5 : 3;
        const animationDuration = Math.random() * 2 + dropSpeed;
        const animationDelay = Math.random() * 2;

        const dropClass = topStart === 0 ? "drop fall2" : "drop";
        return (
          <div
            key={index}
            className={dropClass}
            style={{
              left: `${left}%`,
              animationDuration: `${animationDuration}s`,
              animationDelay: `${animationDelay}s`
            }}
          />
        );
      })}
    </div>
  );
};

export default RainEffect;
