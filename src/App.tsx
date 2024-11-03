import React, { useEffect, useState } from "react";
import { GettingStarted } from "./GettingStarted";
import { FishPond } from "./FishPond";

const routes = [
  { title: "Getting Started", path: "/", component: <GettingStarted /> },
  { title: "Fish Pond", path: "/fish-pond", component: <FishPond /> },
];

export const App = () => {
  const [path, setPath] = useState(document.location.pathname);

  useEffect(() => {
    history.pushState(null, "", path);
  }, [path]);

  const onLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    const url = new URL(event.currentTarget.href);
    setPath(url.pathname);
  };

  const component = routes.find((route) => route.path === path)?.component;

  return (
    <div>
      <ol>
        {routes.map((route) => (
          <li key={route.path}>
            <a href={route.path} onClick={onLinkClick}>
              {route.title}
            </a>
          </li>
        ))}
      </ol>
      {component ?? <p>404 Not Found</p>}
    </div>
  );
};
