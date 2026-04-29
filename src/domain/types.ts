export type GateType = "H" | "X" | "Z" | "CNOT";

export type BasisState = "0" | "1" | "00" | "01" | "10" | "11";

export type Complex = {
  re: number;
  im: number;
};

export type QuantumState = Complex[];

export type CircuitStep = {
  id: string;
  gate: GateType;
  target: 0 | 1;
  control?: 0 | 1;
};

export type Experiment = {
  id: string;
  title: string;
  description: string;
  qubitCount: 1 | 2;
  initialCircuit: CircuitStep[];
  learningNote: string;
};

export type Probability = {
  basis: BasisState;
  probability: number;
};
