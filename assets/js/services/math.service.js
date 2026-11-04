(function (global) {
  'use strict';

  const SPhOH = (global.SPhOH = global.SPhOH || {});
  let typesetQueue = Promise.resolve();

  function typeset(target = document.body) {
    const mathJax = global.MathJax;
    if (!mathJax || typeof mathJax.typesetPromise !== 'function') {
      console.error('MathJax is unavailable; LaTeX formulas could not be rendered.');
      return Promise.resolve();
    }

    typesetQueue = typesetQueue
      .then(() => {
        mathJax.typesetClear([target]);
        return mathJax.typesetPromise([target]);
      })
      .catch((error) => {
        console.error('Failed to render LaTeX formulas with MathJax.', error);
      });

    return typesetQueue;
  }

  SPhOH.MathTypeset = Object.freeze({ typeset });
})(window);
