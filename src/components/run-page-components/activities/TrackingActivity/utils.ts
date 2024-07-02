const Utils = {
  checkForCollision: function checkForCollision(options: {
    dot: {
      radius: number;
      x: number;
      y: number;
      xVector?: number;
      yVector?: number;
    };
    container: HTMLDivElement;
    collisionElements?: HTMLDivElement[];
  }) {
    const { dot, container, collisionElements } = options;
    const { radius, x, y, xVector, yVector } = dot;

    const dotTopEdge = y - radius;
    const dotRightEdge = x + radius;
    const dotBottomEdge = y + radius;
    const dotLeftEdge = x - radius;

    var collision = false;
    var newXVector = xVector;
    var newYVector = yVector;

    if (dotRightEdge >= container.clientWidth || dotLeftEdge <= 0) {
      collision = true;
      if (newXVector) newXVector *= -1;
    }
    if (dotBottomEdge >= container.clientHeight || dotTopEdge <= 0) {
      collision = true;
      if (newYVector) newYVector *= -1;
    }

    if (collisionElements && collisionElements.length > 0) {
      collisionElements.forEach((element) => {
        const {
          collision: newCollision,
          newXVector: newXVector2,
          newYVector: newYVector2,
        } = inObjectBounds(element, {
          radius,
          x,
          y,
          xVector: newXVector,
          yVector: newYVector,
        });

        if (newCollision) {
          collision = true;
          if (newXVector2) newXVector = newXVector2;
          if (newYVector2) newYVector = newYVector2;
        }
      });
    }

    return {
      collision,
      newXVector,
      newYVector,
    };

    function inObjectBounds(
      object: HTMLDivElement,
      dot: {
        radius: number;
        x: number;
        y: number;
        xVector?: number;
        yVector?: number;
      }
    ) {
      const objectTopEdge = object.offsetTop - container.offsetTop;
      const objectRightEdge =
        object.offsetLeft + object.clientWidth - container.offsetLeft;
      const objectBottomEdge =
        object.offsetTop + object.clientHeight - container.offsetTop;
      const objectLeftEdge = object.offsetLeft - container.offsetLeft;

      const { radius, x, y, xVector, yVector } = dot;

      var collision = false;
      var newXVector = xVector;
      var newYVector = yVector;

      const dotTopEdge = y - radius;
      const dotRightEdge = x + radius;
      const dotBottomEdge = y + radius;
      const dotLeftEdge = x - radius;

      if (dotRightEdge >= objectLeftEdge && dotLeftEdge <= objectRightEdge) {
        if (dotTopEdge <= objectBottomEdge && dotBottomEdge >= objectTopEdge) {
          if (newYVector !== undefined) newYVector *= -1;
          collision = true;
        }
      }
      if (dotBottomEdge >= objectTopEdge && dotTopEdge <= objectBottomEdge) {
        if (dotLeftEdge <= objectRightEdge && dotRightEdge >= objectLeftEdge) {
          if (newXVector !== undefined) newXVector *= -1;
          collision = true;
        }
      }

      return { collision, newXVector, newYVector };
    }
  },
};

export default Utils;
