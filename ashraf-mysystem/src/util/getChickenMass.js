export function getChickenMass(kg, procent) {
  const procentKg = procent ? (kg * procent/100) : 0;
  // pure mass and procent kg
  return [kg - procentKg, procentKg];
}
