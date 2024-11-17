import React, { useEffect, useState } from "react";

const RainEffect: React.FC = () => {
  const [drops, setDrops] = useState<number[]>([]);
  useEffect(() => {
    const numberOfDrops = 30;
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
        const animationDuration = Math.random() * 2 + 3;
        const animationDelay = Math.random() * 2;
        return (
          <div
            key={index}
            className="drop"
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
