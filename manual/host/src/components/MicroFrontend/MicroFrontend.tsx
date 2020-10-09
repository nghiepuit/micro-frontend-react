import React, { useEffect, useState } from "react";

const Loader: React.FC<{ initialDelay?: number }> = ({ initialDelay = 50 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsVisible(true);
    }, initialDelay);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isVisible ? <>Loading...</> : null;
};

export const MicroFrontend: React.FC<{
  history: any;
  host: string;
  name: string;
}> = ({ history, host, name }) => {
  const scriptId = `micro-frontend-script-${name}`;
  const [isLoading, setIsLoading] = useState(
    !document.querySelector(`[data-id="${scriptId}"]`)
  );

  useEffect(() => {
    const render = () => {
      const renderMethodName = `render${name}`;
      (window as any)[renderMethodName](`${name}-container`, history);
      setIsLoading(false);
    };

    const appendScript = (src: string) =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.setAttribute("data-id", scriptId);
        script.crossOrigin = "";
        script.src = src;
        script.onload = resolve;
        document.head.appendChild(script);
      });

    const appendScriptsThenRender = async () => {
      try {
        const res = await fetch(`${host}/asset-manifest.json`);
        const manifest: { entrypoints: string[] } = await res.json();
        await Promise.all(
          manifest.entrypoints.map((path) => appendScript(`${host}/${path}`))
        );
        render();
      } catch (e) {
        setIsLoading(() => {
          throw new Error(e);
        });
      }
    };

    if (document.querySelector(`[data-id="${scriptId}"]`)) {
      render();
    } else {
      appendScriptsThenRender();
    }

    return () => {
      (window as any)[`unmount${name}`](`${name}-container`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <main id={`${name}-container`} />
      {isLoading && <Loader />}
    </>
  );
};
