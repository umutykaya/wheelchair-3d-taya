/**
 * Capture a PNG data URL from a WebGL canvas.
 * Caller must ensure the renderer has rendered the scene with
 * `preserveDrawingBuffer: true` OR invoke this synchronously after
 * a manual render() call.
 */
export function snapshotCanvas(canvas: HTMLCanvasElement | null): string | null {
  if (!canvas) return null;
  try {
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}
