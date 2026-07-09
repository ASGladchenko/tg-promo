export function waitForImageReady(image: HTMLImageElement) {
  const decodeImage = () =>
    typeof image.decode === "function" ? image.decode().catch(() => undefined) : Promise.resolve();

  if (image.complete && image.naturalWidth > 0) {
    return decodeImage();
  }

  return new Promise<void>((resolve) => {
    const handleLoad = () => {
      void decodeImage().finally(resolve);
    };

    const handleError = () => {
      resolve();
    };

    image.addEventListener("load", handleLoad, { once: true });
    image.addEventListener("error", handleError, { once: true });
  });
}
