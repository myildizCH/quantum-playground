# Quantum Playground

Quantum Playground is a tiny lab for playing with quantum ideas without needing a PhD, a whiteboard, or a suspiciously expensive fridge.

The goal is simple: make quantum computing feel less like mysterious fog and more like something you can poke, break, measure, and slowly understand.

## What You Can Try

This first version is built around small guided experiments:

- **Quantum Coin**  
  Turn a qubit into a 50/50 possibility cloud, then measure it.

- **Qubit Flip**  
  Use the `X` gate as a quantum-flavored NOT button.

- **Phase Mystery**  
  See how something can change even when the probability chart looks the same.

- **Entanglement Lab**  
  Make two qubits act like they belong to the same tiny secret club.

## The Big Idea

A normal bit is either `0` or `1`.

A qubit can hold a blend of possibilities:

```text
|0> and |1>
```

Quantum gates change that blend. Measurement turns the blend into one visible result.

This app lets you watch that happen with:

- simple circuits
- probability bars
- state vectors
- one-click measurements
- short explanations that try very hard not to sound like a textbook

## Why This Exists

Quantum computing gets weird fast.

So instead of starting with heavy math, this playground starts with questions:

- What does a Hadamard gate actually do?
- Why is measurement random?
- If probabilities stay the same, did anything really change?
- Why is entanglement such a big deal?

The app does not answer everything. It gives you a small machine for building intuition.

## How to Run It

Open a terminal and go into the project folder:

```bash
cd quantum-playground
```

Install the dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

The terminal will show a local address, usually something like:

```text
http://127.0.0.1:5173
```

Open that address in your browser and the playground should appear.

## Useful Commands

Run the app while developing:

```bash
npm run dev
```

Check that the project can be built:

```bash
npm run build
```

Run the simulator tests:

```bash
npm test
```

If `npm install` fails with a network error, check that your internet connection is working and try again. The project needs to download React, Vite, TypeScript, and the test tools from npm.

## Project Shape

The app is intentionally small:

- no backend
- no external quantum simulator
- custom state-vector logic
- React interface
- guided experiments first, sandbox freedom second

The quantum simulator is written directly in the project so the code itself can become part of the learning.

## Next Fun Ideas

Possible future experiments:

- a visual Bloch sphere
- challenge mode
- shareable circuits
- interference puzzles
- a “classical vs quantum” comparison view
- more gates, more qubits, more delightful confusion

## Tiny Warning

This is not a real quantum computer.

It is a friendly simulator that helps the strange parts become a little less strange.
