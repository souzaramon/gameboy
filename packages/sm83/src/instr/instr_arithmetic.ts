import { CPU, R8, R16, F, MCycles } from "../CPU";

// (ADD A,r8): Add the value in r8 to A.
export function ADD_A_r8(cpu: CPU, r8: R8): MCycles {
  const A = cpu.getR(R8.A);
  const val = cpu.getR(r8);
  const result = (A + val) & 0xff;

  cpu.setR(R8.A, result);
  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, false);
  cpu.setF(F.H, (A & 0xf) + (val & 0xf) > 0xf);
  cpu.setF(F.C, A + val > 0xff);

  return 0;
}

// (ADD A,[HL]): Add the byte pointed to by HL to A.
export function ADD_A_HL(cpu: CPU): MCycles {
  const A = cpu.getR(R8.A);
  const val = cpu.memory.read8(cpu.getR(R16.HL));
  const result = (A + val) & 0xff;

  cpu.setR(R8.A, result);
  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, false);
  cpu.setF(F.H, (A & 0xf) + (val & 0xf) > 0xf);
  cpu.setF(F.C, A + val > 0xff);

  return 2;
}

// (ADD A,n8): Add the value n8 to A.
export function ADD_A_n8(cpu: CPU): MCycles {
  const A = cpu.getR(R8.A);
  const val = cpu.memory.read8(cpu.getR(R16.PC));
  const result = (A + val) & 0xff;

  cpu.setR(R16.PC, cpu.getR(R16.PC) + 1);
  cpu.setR(R8.A, result);
  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, false);
  cpu.setF(F.H, (A & 0xf) + (val & 0xf) > 0xf);
  cpu.setF(F.C, A + val > 0xff);

  return 0;
}

// (ADD HL,r16): TODO

// (ADD HL,SP):   TODO

// (ADD SP,e8):   TODO

// (SUB A,r8): Subtract the value in r8 from A.
export function SUB_A_r8(cpu: CPU, r8: R8): MCycles {
  const A = cpu.getR(R8.A);
  const val = cpu.getR(r8);
  const result = (A - val) & 0xff;

  cpu.setR(R8.A, result);
  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, true);
  cpu.setF(F.H, (A & 0xf) < (val & 0xf));
  cpu.setF(F.C, A < val);

  return 0;
}

// (SUB A,[HL]): Subtract the byte pointed to by HL from A.
export function SUB_A_HL(cpu: CPU): MCycles {
  const A = cpu.getR(R8.A);
  const val = cpu.memory.read8(cpu.getR(R16.HL));
  const result = (A - val) & 0xff;

  cpu.setR(R8.A, result);
  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, true);
  cpu.setF(F.H, (A & 0xf) < (val & 0xf));
  cpu.setF(F.C, A < val);

  return 2;
}

// (SUB A,n8): Subtract the value n8 from A.
export function SUB_A_n8(cpu: CPU): MCycles {
  const A = cpu.getR(R8.A);
  const val = cpu.memory.read8(cpu.getR(R16.PC));
  const result = (A - val) & 0xff;

  cpu.setR(R16.PC, cpu.getR(R16.PC) + 1);
  cpu.setR(R8.A, result);
  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, true);
  cpu.setF(F.H, (A & 0xf) < (val & 0xf));
  cpu.setF(F.C, A < val);

  return 0;
}

// (CP A, r8): ComPare the value in A with the value in r8.
export function CP_A_r8(cpu: CPU, r8: R8): MCycles {
  const A = cpu.getR(R8.A);
  const val = cpu.getR(r8);
  const result = A - val;

  cpu.setF(F.Z, (result & 0xff) === 0);
  cpu.setF(F.N, true);
  cpu.setF(F.H, (A & 0x0f) < (val & 0x0f));
  cpu.setF(F.C, A < val);

  return 0;
}

// (CP A,[HL]): ComPare the value in A with the byte pointed to by HL.
export function CP_A_HL(cpu: CPU): MCycles {
  const A = cpu.getR(R8.A);
  const val = cpu.memory.read8(cpu.getR(R16.HL));
  const result = A - val;

  cpu.setF(F.Z, (result & 0xff) === 0);
  cpu.setF(F.N, true);
  cpu.setF(F.H, (A & 0x0f) < (val & 0x0f));
  cpu.setF(F.C, A < val);

  return 2;
}

// (CP A,n8): ComPare the value in A with the value n8.
export function CP_A_n8(cpu: CPU): MCycles {
  const A = cpu.getR(R8.A);
  const val = cpu.memory.read8(cpu.getR(R16.PC));
  const result = A - val;

  cpu.setR(R16.PC, cpu.getR(R16.PC) + 1);
  cpu.setF(F.Z, (result & 0xff) === 0);
  cpu.setF(F.N, true);
  cpu.setF(F.H, (A & 0x0f) < (val & 0x0f));
  cpu.setF(F.C, A < val);

  return 0;
}

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
