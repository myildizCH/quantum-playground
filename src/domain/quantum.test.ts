import { describe, expect, it } from "vitest";
import { applyCircuit, computeProbabilities, initializeState } from "./quantum";
import type { CircuitStep } from "./types";

function expectProbability(actual: number, expected: number) {
  expect(actual).toBeCloseTo(expected, 8);
}

describe("quantum simulator", () => {
  it("starts a single qubit in |0>", () => {
    const probabilities = computeProbabilities(initializeState(1), 1);

    expectProbability(probabilities[0].probability, 1);
    expectProbability(probabilities[1].probability, 0);
  });

  it("flips |0> to |1> with X", () => {
    const steps: CircuitStep[] = [{ id: "x", gate: "X", target: 0 }];
    const probabilities = computeProbabilities(applyCircuit(initializeState(1), steps, 1), 1);

    expectProbability(probabilities[0].probability, 0);
    expectProbability(probabilities[1].probability, 1);
  });

  it("creates a 50/50 superposition with H", () => {
    const steps: CircuitStep[] = [{ id: "h", gate: "H", target: 0 }];
    const probabilities = computeProbabilities(applyCircuit(initializeState(1), steps, 1), 1);

    expectProbability(probabilities[0].probability, 0.5);
    expectProbability(probabilities[1].probability, 0.5);
  });

  it("changes phase but not measurement probabilities with Z after H", () => {
    const hOnly = applyCircuit(initializeState(1), [{ id: "h", gate: "H", target: 0 }], 1);
    const hThenZ = applyCircuit(
      initializeState(1),
      [
        { id: "h", gate: "H", target: 0 },
        { id: "z", gate: "Z", target: 0 },
      ],
      1,
    );

    expect(hThenZ[1].re).toBeCloseTo(-hOnly[1].re, 8);
    expectProbability(computeProbabilities(hThenZ, 1)[0].probability, 0.5);
    expectProbability(computeProbabilities(hThenZ, 1)[1].probability, 0.5);
  });

  it("creates Bell state probabilities with H and CNOT", () => {
    const steps: CircuitStep[] = [
      { id: "h", gate: "H", target: 0 },
      { id: "cnot", gate: "CNOT", control: 0, target: 1 },
    ];
    const probabilities = computeProbabilities(applyCircuit(initializeState(2), steps, 2), 2);

    expectProbability(probabilities[0].probability, 0.5);
    expectProbability(probabilities[1].probability, 0);
    expectProbability(probabilities[2].probability, 0);
    expectProbability(probabilities[3].probability, 0.5);
  });
});
