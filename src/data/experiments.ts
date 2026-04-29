import type { Experiment } from "../domain/types";

export const experiments: Experiment[] = [
  {
    id: "quantum-coin",
    title: "Quantum Coin",
    description: "Put one qubit into a balanced superposition, then measure it like a coin toss.",
    qubitCount: 1,
    initialCircuit: [{ id: "coin-h", gate: "H", target: 0 }],
    learningNote:
      "The Hadamard gate turns |0> into an equal blend of |0> and |1>. Measurement does not reveal a hidden value; it samples from the probabilities created by the state.",
  },
  {
    id: "qubit-flip",
    title: "Qubit Flip",
    description: "Use the X gate as the quantum version of a NOT operation.",
    qubitCount: 1,
    initialCircuit: [{ id: "flip-x", gate: "X", target: 0 }],
    learningNote:
      "The X gate swaps the amplitudes of |0> and |1>. Starting from |0>, that makes the measurement certain: the qubit lands on |1> every time.",
  },
  {
    id: "phase-mystery",
    title: "Phase Mystery",
    description: "Change phase with Z and see why probabilities do not tell the whole story.",
    qubitCount: 1,
    initialCircuit: [
      { id: "phase-h", gate: "H", target: 0 },
      { id: "phase-z", gate: "Z", target: 0 },
    ],
    learningNote:
      "The Z gate flips the sign of the |1> amplitude. The chart still reads 50/50, but the phase is different, and that matters when later gates make amplitudes interfere.",
  },
  {
    id: "entanglement-lab",
    title: "Entanglement Lab",
    description: "Build a Bell state where two qubits behave as one connected system.",
    qubitCount: 2,
    initialCircuit: [
      { id: "bell-h", gate: "H", target: 0 },
      { id: "bell-cnot", gate: "CNOT", control: 0, target: 1 },
    ],
    learningNote:
      "Hadamard creates the branch, then CNOT copies the branch into the second qubit. The result is not four equal outcomes: |00> and |11> share all the probability.",
  },
];
