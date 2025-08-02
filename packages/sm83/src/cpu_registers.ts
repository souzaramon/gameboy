const enum Name {
  NONE = "NONE",
  A = "R_A",
  F = "R_F",
  B = "R_B",
  C = "R_C",
  D = "R_D",
  E = "R_E",
  H = "R_H",
  L = "R_L",
  AF = "R_AF",
  BC = "R_BC",
  DE = "R_DE",
  HL = "R_HL",
}

const enum Flag {
  Z = 7,
  N = 6,
  H = 5,
  C = 4,
}

export class CPURegisters {
  constructor(
    public PC: number,
    public SP: number,
    public A: number,
    public F: number,
    public B: number,
    public C: number,
    public D: number,
    public E: number,
    public H: number,
    public L: number
  ) {}

  getFlag = (flag: Flag) => {};

  setFlag = (flag: Flag, value: boolean) => {};

  getByName8 = (reg: Name) => {};

  setByName8 = (reg: Name, value: number) => {};

  getByName16 = (reg: Name) => {};

  setByName16 = (reg: Name, value: number) => {};
}
