function createReverseFormula (formula, scale) {
  const list = new Array(scale + 1).fill(0).map((_, i) => {
    const inp = i / scale;
    const out = formula(inp);
    return { inp, out };
  });

  return output => {
    const res = list.reduce(
      ({ distance, closest }, { inp, out }) => {
        const dist = Math.abs(output - out);
        if (dist < distance) {
          distance = dist;
          closest = inp;
        }
        return { distance, closest };
      },
      { distance: Number.POSITIVE_INFINITY }
    );
    return res.closest;
  };
}

function createMemoizedFormula (formula, scale) {
  const list = new Array(scale + 1).fill(0).map((_, i) => formula(i / scale));
  return output => list[Math.round(output * scale)];
}

export function reverse (formula, scale = 1000) {
  const reverse = createReverseFormula(formula, scale);
  return createMemoizedFormula(reverse, scale);
}

export function linear (t) { return t; }

export function easeInQuad (t) { return t * t; }

export function easeOutQuad (t) { return t * (2 - t); }

export function easeInOutQuad (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

export function easeInCubic (t) { return t * t * t; }

export function easeOutCubic (t) { return (--t) * t * t + 1; }

export function easeInOutCubic (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; }

export function easeInQuart (t) { return t * t * t * t; }

export function easeOutQuart (t) { return 1 - (--t) * t * t * t; }

export function easeInOutQuart (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t; }

export function easeInQuint (t) { return t * t * t * t * t; }

export function easeOutQuint (t) { return 1 + (--t) * t * t * t * t; }

export function easeInOutQuint (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t; }
