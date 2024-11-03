import {
  Application,
  Assets,
  Container,
  DisplacementFilter,
  Sprite,
  Texture,
  Ticker,
  TilingSprite,
} from "pixi.js";
import React, { useCallback, useEffect, useRef } from "react";

export const FishPond = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application>(new Application());
  const fishesRef = useRef<Sprite[]>([]);
  const overlayRef = useRef<TilingSprite>();

  const preload = async () => {
    const assets = [
      {
        alias: "background",
        src: "https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg",
      },
      {
        alias: "fish1",
        src: "https://pixijs.com/assets/tutorials/fish-pond/fish1.png",
      },
      {
        alias: "fish2",
        src: "https://pixijs.com/assets/tutorials/fish-pond/fish2.png",
      },
      {
        alias: "fish3",
        src: "https://pixijs.com/assets/tutorials/fish-pond/fish3.png",
      },
      {
        alias: "fish4",
        src: "https://pixijs.com/assets/tutorials/fish-pond/fish4.png",
      },
      {
        alias: "fish5",
        src: "https://pixijs.com/assets/tutorials/fish-pond/fish5.png",
      },
      {
        alias: "overlay",
        src: "https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png",
      },
      {
        alias: "displacement",
        src: "https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png",
      },
    ];

    await Assets.load(assets);
  };

  const addBackground = () => {
    const background = Sprite.from("background");
    background.anchor.set(0.5);

    if (appRef.current.screen.width > appRef.current.screen.height) {
      background.width = appRef.current.screen.width * 1.2;
      background.scale.y = background.scale.x;
    } else {
      background.height = appRef.current.screen.height * 1.2;
      background.scale.x = background.scale.y;
    }

    background.x = appRef.current.screen.width / 2;
    background.y = appRef.current.screen.height / 2;

    appRef.current.stage.addChild(background);
  };

  const addFishes = () => {
    const fishContainer = new Container();
    appRef.current.stage.addChild(fishContainer);

    const fishCount = 20;
    const fishAssets = ["fish1", "fish2", "fish3", "fish4", "fish5"];

    for (let i = 0; i < fishCount; i++) {
      const fishAsset = fishAssets[i % fishAssets.length];
      const fish = Sprite.from(fishAsset);

      fish.anchor.set(0.5);
      fish.direction = Math.random() * Math.PI * 2;
      fish.speed = 2 + Math.random() * 2;
      fish.turnSpeed = Math.random() - 0.8;

      fish.x = Math.random() * appRef.current.screen.width;
      fish.y = Math.random() * appRef.current.screen.height;
      fish.scale.set(0.5 + Math.random() * 0.2);

      fishContainer.addChild(fish);
      fishesRef.current.push(fish);
    }
  };

  const animateFishes = () => {
    const stagePadding = 100;
    const boundWidth = appRef.current.screen.width + stagePadding * 2;
    const boundHeight = appRef.current.screen.height + stagePadding * 2;

    fishesRef.current.forEach((fish) => {
      fish.direction += fish.turnSpeed * 0.01;
      fish.x += Math.sin(fish.direction) * fish.speed;
      fish.y += Math.cos(fish.direction) * fish.speed;
      fish.rotation = -fish.direction - Math.PI / 2;

      if (fish.x < -stagePadding) {
        fish.x += boundWidth;
      }
      if (fish.x > appRef.current.screen.width + stagePadding) {
        fish.x -= boundWidth;
      }
      if (fish.y < -stagePadding) {
        fish.y += boundHeight;
      }
      if (fish.y > appRef.current.screen.height + stagePadding) {
        fish.y -= boundHeight;
      }
    });
  };

  const addWaterOverlay = () => {
    const texture = Texture.from("overlay");
    overlayRef.current = new TilingSprite({
      texture,
      width: appRef.current.screen.width,
      height: appRef.current.screen.height,
    });
    appRef.current.stage.addChild(overlayRef.current);
  };

  const animateWaterOverlay = (time: Ticker) => {
    const delta = time.deltaTime;
    if (overlayRef.current) {
      overlayRef.current.tilePosition.x -= delta;
      overlayRef.current.tilePosition.y -= delta;
    }
  };

  const addDisplacementEffect = () => {
    const sprite = Sprite.from("displacement");
    sprite.texture.baseTexture.wrapMode = "repeat";

    const filter = new DisplacementFilter({
      sprite,
      scale: 50,
      width: appRef.current.screen.width,
      height: appRef.current.screen.height,
    });

    appRef.current.stage.filters = [filter];
  };

  const setup = async () => {
    await appRef.current.init({ background: "#1099bb", resizeTo: window });
    divRef.current?.append(appRef.current.canvas);
  };

  const run = useCallback(async () => {
    await setup();
    await preload();
    addBackground();
    addFishes();
    appRef.current.ticker.add(animateFishes);
    addWaterOverlay();
    appRef.current.ticker.add(animateWaterOverlay);
    addDisplacementEffect();
  }, []);

  useEffect(() => {
    run();
  }, [run]);

  return <div ref={divRef}></div>;
};
