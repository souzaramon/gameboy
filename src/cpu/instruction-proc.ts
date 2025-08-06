import { CPU } from "./cpu";
import { R8, R16, F, MCycles } from "./cpu.types";

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

// (BIT u3,r8): Test bit u3 in register r8, set the zero flag if bit not set.
export function BIT_u3_r8(cpu: CPU, u3: number, r8: R8) {
  const result = cpu.getR(r8) & (1 << u3);

  cpu.setF(F.Z, result === 0);
  cpu.setF(F.N, false);
  cpu.setF(F.H, true);

  return 2;
}

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

// (DI): Disable Interrupts by clearing the IME flag.
export function DI(cpu: CPU) {
  cpu.ime = 0;

  return 0;
}

// (EI):   TODO

// (HALT): TODO

// (CALL n16):    TODO

// (CALL cc,n16): TODO

// (JP HL): Jump to address in HL; effectively, copy the value in register HL into PC.
export function JP_HL(cpu: CPU) {
  cpu.setR(R16.PC, cpu.getR(R16.HL));

  return 0;
}

// (JP n16):      TODO

// (JP cc,n16):   TODO

// (JR n16):      TODO

// (JR cc,n16):   TODO

// (RET cc):      TODO

// (RET):         TODO

// (RETI):        TODO

// (RST vec):     TODO

// NOTE: (LD r8,r8): Copy the value in register on the right into the register on the left.
export function LD_r8_r8(cpu: CPU, r8_1: R8, r8_2: R8): MCycles {
  cpu.setR(r8_1, cpu.getR(r8_2));

  return 0;
}

// (LD r8,n8): Copy the value n8 into register r8'.
export function LD_r8_n8(cpu: CPU, r8: R8): MCycles {
  cpu.setR(r8, cpu.memory.read8(cpu.getR(R16.PC)));
  cpu.setR(R16.PC, cpu.getR(R16.PC) + 1);

  return 2;
}

// (LD r16,n16): Copy the value n16 into register r16.
export function LD_r16_n16(cpu: CPU, r16: R16): MCycles {
  cpu.setR(r16, cpu.memory.read16(cpu.getR(R16.PC)));
  cpu.setR(R16.PC, cpu.getR(R16.PC) + 2);

  return 2;
}

// (LD [r16],A): Copy the value in register A into the byte pointed to by r16.
export function LD_r16_A(cpu: CPU, r16: R16): MCycles {
  const addr = cpu.getR(r16);
  cpu.memory.write8(addr, cpu.getR(R8.A));

  return 2;
}

// (LD [HL],r8): Copy the value in register r8 into the byte pointed to by HL.
export function LD_HL_r8(cpu: CPU, r8: R8): MCycles {
  cpu.memory.write8(cpu.getR(R16.HL), cpu.getR(r8));

  return 0;
}

// (LD [HL],n8): Copy the value n8 into the byte pointed to by HL.
export function LD_HL_n8(cpu: CPU): MCycles {
  cpu.memory.write8(cpu.getR(R16.HL), cpu.memory.read8(cpu.getR(R16.PC)));
  cpu.setR(R16.PC, cpu.getR(R16.PC) + 1);

  return 1;
}

// (LD SP,n16): Copy the value n16 into register SP.
export function LD_SP_n16(cpu: CPU): MCycles {
  cpu.setR(R16.SP, cpu.memory.read16(cpu.getR(R16.PC)));
  cpu.setR(R16.PC, cpu.getR(R16.PC) + 2);

  return 2;
}

// (LD A,[r16]): Copy the byte pointed to by r16 into register A.
export function LD_A_r16(cpu: CPU, r16: R16): MCycles {
  cpu.setR(R8.A, cpu.memory.read8(cpu.getR(r16)));

  return 1;
}

// (LD r8,[HL]): Copy the value pointed to by HL into register r8.
export function LD_r8_HL(cpu: CPU, r8: R8): MCycles {
  cpu.setR(r8, cpu.memory.read8(cpu.getR(R16.HL)));

  return 1;
}

// (LD [HLI],A): Copy the value in register A into the byte pointed by HL and increment HL afterwards.
export function LD_HLI_A(cpu: CPU): MCycles {
  const HL = cpu.getR(R16.HL);

  cpu.memory.write8(HL, cpu.getR(R8.A));
  cpu.setR(R16.HL, HL + 1);

  return 1;
}

// (LD [HLD],A): Copy the value in register A into the byte pointed by HL and decrement HL afterwards.
export function LD_HLD_A(cpu: CPU): MCycles {
  const HL = cpu.getR(R16.HL);

  cpu.memory.write8(HL, cpu.getR(R8.A));
  cpu.setR(R16.HL, HL - 1);

  return 0;
}

// (LD A,[HLI]): Copy the byte pointed to by HL into register A, and increment HL afterwards.
export function LD_A_HLI(cpu: CPU): MCycles {
  const HL = cpu.getR(R16.HL);

  cpu.setR(R8.A, cpu.memory.read8(HL));
  cpu.setR(R16.HL, HL + 1);

  return 1;
}

// (LD A,[HLD]): Copy the byte pointed to by HL into register A, and decrement HL afterwards.
export function LD_A_HLD(cpu: CPU): MCycles {
  const HL = cpu.getR(R16.HL);

  cpu.setR(R8.A, cpu.memory.read8(HL));
  cpu.setR(R16.HL, HL - 1);

  return 1;
}

// (LD SP,HL): Copy register HL into register SP.
export function LD_SP_HL(cpu: CPU): MCycles {
  cpu.setR(R16.SP, cpu.getR(R16.HL));

  return 0;
}

// (LD [n16],SP): Copy SP & $FF at address n16 and SP >> 8 at address n16 + 1.
export function LD_n16_SP(cpu: CPU): MCycles {
  const addr = cpu.memory.read16(cpu.getR(R16.PC));
  cpu.memory.write16(addr, cpu.SP);
  cpu.setR(R16.PC, cpu.getR(R16.PC) + 2);

  return 2;
}

// (LD [n16],A): Copy the value in register A into the byte at address n16.
export function LD_n16_A(cpu: CPU): MCycles {
  const addr = cpu.memory.read16(cpu.getR(R16.PC));
  cpu.memory.write16(addr, cpu.getR(R8.A));
  cpu.setR(R16.PC, cpu.getR(R16.PC) + 2);

  return 2;
}

// (LD A,[n16]): Copy the byte at address n16 into register A.
export function LD_A_n16(cpu: CPU): MCycles {
  const addr = cpu.memory.read16(cpu.getR(R16.PC));
  cpu.setR(R16.PC, cpu.getR(R16.PC) + 2);
  cpu.setR(R8.A, cpu.memory.read8(addr));

  return 2;
}

// (LD HL,SP+e8): Add the signed value e8 to SP and copy the result in HL.
export function LD_HL_SP_E8(cpu: CPU): MCycles {
  const r8_val = (cpu.memory.read8(cpu.getR(R16.PC)) << 24) >> 24;
  const result = (cpu.SP + r8_val) & 0xffff;

  cpu.setR(R16.PC, cpu.getR(R16.PC) + 1);
  cpu.setR(R16.HL, result);
  cpu.setF(F.Z, false);
  cpu.setF(F.N, false);
  cpu.setF(F.H, (cpu.SP & 0xf) + (r8_val & 0xf) > 0xf);
  cpu.setF(F.C, (cpu.SP & 0xff) + (r8_val & 0xff) > 0xff);

  return 3;
}

// (LDH [n16],A): TODO

// (LDH [C],A):   TODO

// (LDH A,[n16]): TODO

// (LDH A,[C]):   TODO

// (DAA):  TODO

// (NOP): No OPeration.
export function NOP() {
  return 0;
}

// (STOP): TODO

// (CCF):  TODO

// (SCF):  TODO
