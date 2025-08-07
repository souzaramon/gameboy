import * as proc from "./instruction-proc";

export type ProcName = keyof typeof proc;

export type MCycles = number;

export type TCycles = number;

export enum R8 {
  A = "A",
  F = "F",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  H = "H",
  L = "L",
}

export enum R16 {
  AF = "AF",
  BC = "BC",
  DE = "DE",
  HL = "HL",
  PC = "PC",
  SP = "SP",
}

export enum F {
  Z = 7,
  N = 6,
  H = 5,
  C = 4,
}
