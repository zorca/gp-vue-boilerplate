export function arc (x, y, startAngle, endAngle, outerRadius, innerRadius = 0) {
  const sinAlpha = Math.sin(startAngle);
  const cosAlpha = Math.cos(startAngle);
  const sinBeta = Math.sin(endAngle);
  const cosBeta = Math.cos(endAngle);

  const largeArc = endAngle - startAngle > Math.PI;

  const P = {
    x: x + (outerRadius * sinAlpha),
    y: y - (outerRadius * cosAlpha)
  };

  const Q = {
    x: x + (outerRadius * sinBeta),
    y: y - (outerRadius * cosBeta)
  };

  const R = {
    x: x + (innerRadius * sinBeta),
    y: y - (innerRadius * cosBeta)
  };

  const S = {
    x: x + (innerRadius * sinAlpha),
    y: y - (innerRadius * cosAlpha)
  };

  return `M${P.x},${P.y} A${outerRadius},${outerRadius} 0 ${largeArc ? '1,1' : '0,1'} ${Q.x},${Q.y} L${R.x},${R.y} A${innerRadius},${innerRadius} 0 ${largeArc ? '1,0' : '0,0'} ${S.x},${S.y} Z`;
}
