import { CPU, R8, R16, F, MCycles } from "../CPU";

// (ADD A,r8): Add the value in r8 to A.
export function ADD_A_r8(cpu: CPU, r8: R8): MCycles {
  const A = cpu.getR(R8.A);
  const r8Val = cpu.getR(r8);
  const result = (A + r8Val) & 0xff;

  cpu.setR(R8.A, result);

  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, false);
  cpu.setF(F.H, (A & 0xf) + (r8Val & 0xf) > 0xf);
  cpu.setF(F.C, A + r8Val > 0xff);

  return 0;
}

// (ADD A,[HL]): TODO

// (ADD A,n8):   TODO

// (ADD HL,r16): TODO

// (ADD HL,SP):   TODO

// (ADD SP,e8):   TODO

// (SUB A,r8): Subtract the value in r8 from A.
export function SUB_A_r8(cpu: CPU, r8: R8): MCycles {
  const A = cpu.getR(R8.A);
  const r8Val = cpu.getR(r8);
  const result = (A - r8Val) & 0xff;

  cpu.setR(R8.A, result);

  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, true);
  cpu.setF(F.H, (A & 0xf) < (r8Val & 0xf));
  cpu.setF(F.C, A < r8Val);

  return 0;
}

// (SUB A,[HL]): TODO

// (SUB A,n8):   TODO

// (CP A, r8): ComPare the value in A with the value in r8.
export function CP_A_r8(cpu: CPU, r8: R8): MCycles {
  const A = cpu.getR(R8.A);
  const r8Val = cpu.getR(r8);
  const result = A - r8Val;

  cpu.setF(F.Z, (result & 0xff) === 0);
  cpu.setF(F.N, true);
  cpu.setF(F.H, (A & 0x0f) < (r8Val & 0x0f));
  cpu.setF(F.C, A < r8Val);

  return 0;
}

// (CP A,[HL]):  TODO

// (CP A,n8):    TODO

// (ADC A,r8):   TODO

// (ADC A,[HL]): TODO

// (ADC A,n8):   TODO

// (DEC SP):      TODO

// (DEC r8):     TODO

// (DEC [HL]):   TODO

// (DEC r16):    TODO

// (INC r8):     TODO

// (INC [HL]):   TODO

// (INC r16):    TODO

// (INC SP):      TODO

// (SBC A,r8):   TODO

// (SBC A,[HL]): TODO

// (SBC A,n8):   TODO

// (POP AF):      TODO

// (POP r16):     TODO

// (PUSH AF):     TODO

// (PUSH r16):    TODO
