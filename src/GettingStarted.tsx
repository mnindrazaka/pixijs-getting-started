import { Application, Assets, Sprite } from "pixi.js";
import React, { useCallback, useEffect, useRef } from "react";

export const GettingStarted = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const setup = useCallback(async () => {
    const app = new Application();

    await app.init({ background: "#1099bb", resizeTo: window });
    divRef.current?.appendChild(app.canvas);

    const texture = await Assets.load("https://pixijs.com/assets/bunny.png");
    const bunny = new Sprite(texture);

    app.stage.addChild(bunny);

    bunny.anchor.set(0.5);
    bunny.y = app.screen.height / 2;
    bunny.x = app.screen.width / 2;

    app.ticker.add((time) => {
      bunny.rotation += 0.1 * time.deltaTime;
    });
  }, []);

  useEffect(() => {
    setup();
  }, [setup]);

  return <div ref={divRef}></div>;
};
