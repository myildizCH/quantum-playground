import { Atom, Beaker, Dice5, RotateCcw, Trash2, Waves } from "lucide-react";
import { useMemo, useState } from "react";
import { experiments } from "./data/experiments";
import { applyCircuit, computeProbabilities, formatAmplitude, initializeState, measureOnce } from "./domain/quantum";
import type { CircuitStep, GateType } from "./domain/types";

const gateNotes: Record<GateType, string> = {
  H: "Hadamard spreads certainty into balanced possibility.",
  X: "X flips the qubit between |0> and |1>.",
  Z: "Z changes phase: invisible to raw probabilities, important for interference.",
  CNOT: "CNOT flips the target qubit only when the control qubit is |1>.",
};

export function App() {
  const [selectedExperimentId, setSelectedExperimentId] = useState(experiments[0].id);
  const selectedExperiment = experiments.find((experiment) => experiment.id === selectedExperimentId) ?? experiments[0];
  const [qubitCount, setQubitCount] = useState<1 | 2>(selectedExperiment.qubitCount);
  const [circuit, setCircuit] = useState<CircuitStep[]>(selectedExperiment.initialCircuit);
  const [measurement, setMeasurement] = useState<string | null>(null);

  const initialState = useMemo(() => initializeState(qubitCount), [qubitCount]);
  const finalState = useMemo(() => applyCircuit(initialState, circuit, qubitCount), [circuit, initialState, qubitCount]);
  const probabilities = useMemo(() => computeProbabilities(finalState, qubitCount), [finalState, qubitCount]);

  function loadExperiment(experimentId: string) {
    const experiment = experiments.find((item) => item.id === experimentId) ?? experiments[0];
    setSelectedExperimentId(experiment.id);
    setQubitCount(experiment.qubitCount);
    setCircuit(experiment.initialCircuit);
    setMeasurement(null);
  }

  function addGate(gate: GateType, target: 0 | 1) {
    const control = gate === "CNOT" ? (target === 0 ? 1 : 0) : undefined;
    setCircuit((steps) => [
      ...steps,
      {
        id: `${gate}-${crypto.randomUUID()}`,
        gate,
        target,
        control,
      },
    ]);
    setMeasurement(null);
  }

  function removeGate(id: string) {
    setCircuit((steps) => steps.filter((step) => step.id !== id));
    setMeasurement(null);
  }

  function resetCircuit() {
    setCircuit(selectedExperiment.initialCircuit);
    setQubitCount(selectedExperiment.qubitCount);
    setMeasurement(null);
  }

  function runMeasurement() {
    setMeasurement(measureOnce(finalState, qubitCount));
  }

  const activeNote = circuit.length > 0 ? gateNotes[circuit[circuit.length - 1].gate] : "The register starts at |0> or |00>.";

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Guided experiments">
        <div className="brand">
          <div className="brand-mark">
            <Atom size={22} aria-hidden="true" />
          </div>
          <div>
            <p>Quantum Playground</p>
            <span>Guided qubit lab</span>
          </div>
        </div>

        <div className="experiment-list">
          {experiments.map((experiment) => (
            <button
              className={`experiment-button ${experiment.id === selectedExperimentId ? "active" : ""}`}
              key={experiment.id}
              onClick={() => loadExperiment(experiment.id)}
            >
              <strong>{experiment.title}</strong>
              <span>{experiment.description}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="workspace" aria-label="Circuit workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">{qubitCount} qubit lab</p>
            <h1>{selectedExperiment.title}</h1>
          </div>
          <div className="header-actions">
            <button className="icon-button" onClick={resetCircuit} title="Reset circuit" aria-label="Reset circuit">
              <RotateCcw size={18} />
            </button>
            <button className="measure-button" onClick={runMeasurement}>
              <Dice5 size={18} />
              Run measurement
            </button>
          </div>
        </header>

        <div className="gate-tray" aria-label="Gate tray">
          <GateButton label="H" onClick={() => addGate("H", 0)} note="Add H to q0" />
          <GateButton label="X" onClick={() => addGate("X", 0)} note="Add X to q0" />
          <GateButton label="Z" onClick={() => addGate("Z", 0)} note="Add Z to q0" />
          {qubitCount === 2 ? (
            <>
              <GateButton label="H q1" onClick={() => addGate("H", 1)} note="Add H to q1" />
              <GateButton label="X q1" onClick={() => addGate("X", 1)} note="Add X to q1" />
              <GateButton label="CNOT" onClick={() => addGate("CNOT", 1)} note="Control q0, target q1" />
            </>
          ) : null}
        </div>

        <div className="circuit-board">
          {Array.from({ length: qubitCount }, (_, qubit) => (
            <div className="wire-row" key={qubit}>
              <span className="wire-label">q{qubit}</span>
              <div className="wire">
                {circuit.map((step) => (
                  <CircuitGate key={`${step.id}-${qubit}`} step={step} qubit={qubit as 0 | 1} onRemove={removeGate} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lower-grid">
          <section className="panel" aria-label="Probability histogram">
            <div className="panel-heading">
              <Waves size={18} aria-hidden="true" />
              <h2>Probabilities</h2>
            </div>
            <div className="histogram">
              {probabilities.map((item) => (
                <div className="bar-row" key={item.basis}>
                  <span className="basis">|{item.basis}&gt;</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${item.probability * 100}%` }} />
                  </div>
                  <span className="percent">{Math.round(item.probability * 100)}%</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel state-panel" aria-label="State vector">
            <div className="panel-heading">
              <Beaker size={18} aria-hidden="true" />
              <h2>State vector</h2>
            </div>
            <div className="state-list">
              {finalState.map((amplitude, index) => (
                <div className="state-line" key={index}>
                  <span>|{probabilities[index].basis}&gt;</span>
                  <strong>{formatAmplitude(amplitude)}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <aside className="inspector" aria-label="Explanation">
        <section className="panel explanation">
          <p className="eyebrow">What just happened?</p>
          <h2>{selectedExperiment.title}</h2>
          <p>{selectedExperiment.learningNote}</p>
          <div className="note-callout">{activeNote}</div>
        </section>

        <section className="panel measurement-panel">
          <p className="eyebrow">Latest measurement</p>
          <div className="measurement-result">{measurement ? `|${measurement}>` : "Not measured yet"}</div>
          <p>Measurement samples one basis state from the probabilities. The chart stays visible so you can compare chance with the observed result.</p>
        </section>
      </aside>
    </main>
  );
}

function GateButton({ label, note, onClick }: { label: string; note: string; onClick: () => void }) {
  return (
    <button className="gate-button" onClick={onClick} title={note}>
      {label}
    </button>
  );
}

function CircuitGate({
  step,
  qubit,
  onRemove,
}: {
  step: CircuitStep;
  qubit: 0 | 1;
  onRemove: (id: string) => void;
}) {
  const isTarget = step.target === qubit;
  const isControl = step.control === qubit;
  const isRelevant = isTarget || isControl;

  return (
    <div className={`gate-slot ${step.gate === "CNOT" ? "cnot-slot" : ""}`}>
      {isRelevant ? (
        <button className={`circuit-gate ${isControl ? "control" : ""}`} onClick={() => onRemove(step.id)} title="Remove gate">
          {isControl ? "●" : step.gate}
          {isTarget ? <Trash2 className="remove-icon" size={12} aria-hidden="true" /> : null}
        </button>
      ) : (
        <span className="empty-step" aria-hidden="true" />
      )}
    </div>
  );
}
