import { CPU } from "../CPU";
import { R8, R16, F, MCycles } from "../CPU.types";

// (AND A, r8): Set A to the bitwise AND between the value in r8 and A.
export function AND_A_r8(cpu: CPU, r8: R8): MCycles {
  const result = cpu.getR(R8.A) & cpu.getR(r8);

  cpu.setR(R8.A, result);
  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, false);
  cpu.setF(F.H, true);
  cpu.setF(F.C, false);

  return 0;
}

// (AND A,[HL]): Set A to the bitwise AND between the byte pointed to by HL and A.
export function AND_A_HL(cpu: CPU): MCycles {
  const result = cpu.getR(R8.A) & cpu.memory.read8(cpu.getR(R16.HL));

  cpu.setR(R8.A, result);

  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, false);
  cpu.setF(F.H, true);
  cpu.setF(F.C, false);

  return 2;
}

// (AND A,n8): Set A to the bitwise AND between the value n8 and A.
export function AND_A_n8(cpu: CPU): MCycles {
  const result = cpu.getR(R8.A) & cpu.memory.read8(cpu.getR(R16.PC));

  cpu.setR(R16.PC, cpu.getR(R16.PC) + 1);
  cpu.setR(R8.A, result);
  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, false);
  cpu.setF(F.H, true);
  cpu.setF(F.C, false);

  return 2;
}

// (OR A, r8): Set A to the bitwise OR between the value in r8 and A.
export function OR_A_r8(cpu: CPU, r8: R8): MCycles {
  const result = cpu.getR(R8.A) | cpu.getR(r8);

  cpu.setR(R8.A, result);
  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, false);
  cpu.setF(F.H, false);
  cpu.setF(F.C, false);

  return 0;
}

// (OR A,[HL]): Set A to the bitwise OR between the byte pointed to by HL and A.
export function OR_A_HL(cpu: CPU): MCycles {
  const result = cpu.getR(R8.A) | cpu.memory.read8(cpu.getR(R16.HL));

  cpu.setR(R8.A, result);
  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, false);
  cpu.setF(F.H, false);
  cpu.setF(F.C, false);

  return 2;
}

// (OR A,n8): Set A to the bitwise OR between the value n8 and A.
export function OR_A_n8(cpu: CPU): MCycles {
  const result = cpu.getR(R8.A) | cpu.memory.read8(cpu.getR(R16.PC));

  cpu.setR(R16.PC, cpu.getR(R16.PC) + 1);
  cpu.setR(R8.A, result);
  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, false);
  cpu.setF(F.H, false);
  cpu.setF(F.C, false);

  return 2;
}

// (XOR A, r8): Set A to the bitwise XOR between the value in r8 and A.
export function XOR_A_r8(cpu: CPU, r8: R8): MCycles {
  const result = cpu.getR(R8.A) ^ cpu.getR(r8);

  cpu.setR(R8.A, result);
  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, false);
  cpu.setF(F.H, false);
  cpu.setF(F.C, false);

  return 0;
}

// (XOR A,[HL]): Set A to the bitwise XOR between the byte pointed to by HL and A.
export function XOR_A_HL(cpu: CPU): MCycles {
  const result = cpu.getR(R8.A) ^ cpu.memory.read8(cpu.getR(R16.HL));

  cpu.setR(R8.A, result);
  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, false);
  cpu.setF(F.H, false);
  cpu.setF(F.C, false);

  return 2;
}

// (XOR A,n8): Set A to the bitwise XOR between the value n8 and A.
export function XOR_A_n8(cpu: CPU): MCycles {
  const result = cpu.getR(R8.A) ^ cpu.memory.read8(cpu.getR(R16.PC));

  cpu.setR(R16.PC, cpu.getR(R16.PC) + 1);
  cpu.setR(R8.A, result);
  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, false);
  cpu.setF(F.H, false);
  cpu.setF(F.C, false);

  return 2;
}

// (CPL):           TODO

// (BIT u3,r8):     TODO

// (BIT u3,[HL]):   TODO

// (RES u3,r8):     TODO

// (RES u3,[HL]):   TODO

// (SET u3,r8):     TODO

// (SET u3,[HL]):   TODO

// (RL r8):         TODO

// (RL [HL]):       TODO

// (RLA):           TODO

// (RLC r8):        TODO

// (RLC [HL]):      TODO

// (RLCA):          TODO

// (RR r8):         TODO

// (RR [HL]):       TODO

// (RRA):           TODO

// (RRC r8):        TODO

// (RRC [HL]):      TODO

// (RRCA):          TODO

// (SLA r8):        TODO

// (SLA [HL]):      TODO

// (SRA r8):        TODO

// (SRA [HL]):      TODO

// (SRL r8):        TODO

// (SRL [HL]):      TODO

// (SWAP r8):       TODO

// (SWAP [HL]):     TODO
