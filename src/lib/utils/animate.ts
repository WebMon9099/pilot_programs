export function animate(func: Function) {
  var shouldRenderNext = true;
  var animationFrame = requestAnimationFrame(function inner() {
    if (shouldRenderNext) {
      func();

      animationFrame = requestAnimationFrame(inner);
    }
  });

  return () => {
    shouldRenderNext = false;
    cancelAnimationFrame(animationFrame);
  };
}
