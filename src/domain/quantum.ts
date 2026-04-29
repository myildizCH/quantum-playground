import type { BasisState, CircuitStep, Complex, Probability, QuantumState } from "./types";

const SQRT_HALF = 1 / Math.sqrt(2);
const EPSILON = 1e-12;

const basisLabels: Record<1 | 2, BasisState[]> = {
  1: ["0", "1"],
  2: ["00", "01", "10", "11"],
};

export function complex(re: number, im = 0): Complex {
  return { re, im };
}

function add(a: Complex, b: Complex): Complex {
  return complex(a.re + b.re, a.im + b.im);
}

function multiply(a: Complex, b: Complex): Complex {
  return complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
}

function magnitudeSquared(value: Complex): number {
  return value.re * value.re + value.im * value.im;
}

export function initializeState(qubitCount: 1 | 2): QuantumState {
  return Array.from({ length: 2 ** qubitCount }, (_, index) => complex(index === 0 ? 1 : 0));
}

export function applyCircuit(initialState: QuantumState, steps: CircuitStep[], qubitCount: 1 | 2): QuantumState {
  return steps.reduce((state, step) => applyStep(state, step, qubitCount), initialState);
}

export function applyStep(state: QuantumState, step: CircuitStep, qubitCount: 1 | 2): QuantumState {
  if (step.gate === "CNOT") {
    return applyCnot(state, step.control ?? 0, step.target, qubitCount);
  }

  const matrices = {
    H: [
      [complex(SQRT_HALF), complex(SQRT_HALF)],
      [complex(SQRT_HALF), complex(-SQRT_HALF)],
    ],
    X: [
      [complex(0), complex(1)],
      [complex(1), complex(0)],
    ],
    Z: [
      [complex(1), complex(0)],
      [complex(0), complex(-1)],
    ],
  };

  return applySingleQubitGate(state, step.target, qubitCount, matrices[step.gate]);
}

export function computeProbabilities(state: QuantumState, qubitCount: 1 | 2): Probability[] {
  return state.map((amplitude, index) => ({
    basis: basisLabels[qubitCount][index],
    probability: normalizeTinyNumber(magnitudeSquared(amplitude)),
  }));
}

export function measureOnce(state: QuantumState, qubitCount: 1 | 2, random = Math.random()): BasisState {
  const probabilities = computeProbabilities(state, qubitCount);
  let cursor = 0;

  for (const item of probabilities) {
    cursor += item.probability;
    if (random <= cursor + EPSILON) {
      return item.basis;
    }
  }

  return probabilities[probabilities.length - 1].basis;
}

export function formatAmplitude(value: Complex): string {
  const re = normalizeTinyNumber(value.re);
  const im = normalizeTinyNumber(value.im);

  if (im === 0) {
    return formatNumber(re);
  }

  if (re === 0) {
    return `${formatNumber(im)}i`;
  }

  const sign = im > 0 ? "+" : "-";
  return `${formatNumber(re)} ${sign} ${formatNumber(Math.abs(im))}i`;
}

function applySingleQubitGate(
  state: QuantumState,
  target: 0 | 1,
  qubitCount: 1 | 2,
  matrix: Complex[][],
): QuantumState {
  const next = state.map(() => complex(0));
  const targetBit = qubitCount - 1 - target;

  for (let index = 0; index < state.length; index += 1) {
    const bit = (index >> targetBit) & 1;

    for (let outputBit = 0; outputBit <= 1; outputBit += 1) {
      const outputIndex = bit === outputBit ? index : index ^ (1 << targetBit);
      next[outputIndex] = add(next[outputIndex], multiply(matrix[outputBit][bit], state[index]));
    }
  }

  return next;
}

function applyCnot(state: QuantumState, control: 0 | 1, target: 0 | 1, qubitCount: 1 | 2): QuantumState {
  if (qubitCount !== 2 || control === target) {
    return state;
  }

  const next = state.map(() => complex(0));
  const controlBit = qubitCount - 1 - control;
  const targetBit = qubitCount - 1 - target;

  for (let index = 0; index < state.length; index += 1) {
    const controlIsOne = ((index >> controlBit) & 1) === 1;
    const outputIndex = controlIsOne ? index ^ (1 << targetBit) : index;
    next[outputIndex] = state[index];
  }

  return next;
}

function normalizeTinyNumber(value: number): number {
  return Math.abs(value) < EPSILON ? 0 : value;
}

function formatNumber(value: number): string {
  if (Math.abs(value - Math.round(value)) < EPSILON) {
    return String(Math.round(value));
  }

  return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}
