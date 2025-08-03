export type MCycles = number;

export type TCycles = number;

export const enum R8 {
  A = "A",
  F = "F",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  H = "H",
  L = "L",
}

export const enum R16 {
  AF = "AF",
  BC = "BC",
  DE = "DE",
  HL = "HL",
  PC = "PC",
  SP = "SP",
}

export const enum F {
  Z = 7,
  N = 6,
  H = 5,
  C = 4,
}

export interface MemoryLike {
  read8(address: number): number;
  write8(address: number, value: number): void;
  read16(address: number): number;
  write16(address: number, value: number): void;
}
