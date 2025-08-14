import { Cpu } from "./cpu";
import { F, R8, R16 } from "./cpu.types";

export type MCycles = number;

// (ADD A,r8): Add the value in r8 to A.
export function ADD_A_r8(cpu: Cpu, r8: R8): MCycles {
  const A = cpu.getReg(R8.A);
  const val = cpu.getReg(r8);
  const result = (A + val) & 0xff;

  cpu.setReg(R8.A, result);
  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, (A & 0xf) + (val & 0xf) > 0xf);
  cpu.setFlag(F.C, A + val > 0xff);

  return 0;
}

// (ADD A,[HL]): Add the byte pointed to by HL to A.
export function ADD_A_HL(cpu: Cpu): MCycles {
  const A = cpu.getReg(R8.A);
  const val = cpu.bus.read(cpu.getReg(R16.HL));
  const result = (A + val) & 0xff;

  cpu.setReg(R8.A, result);
  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, (A & 0xf) + (val & 0xf) > 0xf);
  cpu.setFlag(F.C, A + val > 0xff);

  return 2;
}

// (ADD A,n8): Add the value n8 to A.
export function ADD_A_n8(cpu: Cpu): MCycles {
  const A = cpu.getReg(R8.A);
  const val = cpu.bus.read(cpu.getReg(R16.PC));
  const result = (A + val) & 0xff;

  cpu.incReg(R16.PC);
  cpu.setReg(R8.A, result);
  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, (A & 0xf) + (val & 0xf) > 0xf);
  cpu.setFlag(F.C, A + val > 0xff);

  return 0;
}

// (ADD HL,SP) / (ADD HL,r16): Add the value in r16 to HL.
export function ADD_HL_r16(cpu: Cpu, r16: R16): MCycles {
  const HL = cpu.getReg(R16.HL);
  const val = cpu.getReg(r16);
  const result = (HL + val) & 0xffff;

  cpu.setReg(R16.HL, result);

  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, (HL & 0xfff) + (val & 0xfff) > 0xfff);
  cpu.setFlag(F.C, HL + val > 0xffff);

  return 0;
}

// (ADD SP,e8):   TODO

// (SUB A,r8): Subtract the value in r8 from A.
export function SUB_A_r8(cpu: Cpu, r8: R8): MCycles {
  const A = cpu.getReg(R8.A);
  const val = cpu.getReg(r8);
  const result = (A - val) & 0xff;

  cpu.setReg(R8.A, result);
  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, true);
  cpu.setFlag(F.H, (A & 0xf) < (val & 0xf));
  cpu.setFlag(F.C, A < val);

  return 0;
}

// (SUB A,[HL]): Subtract the byte pointed to by HL from A.
export function SUB_A_HL(cpu: Cpu): MCycles {
  const A = cpu.getReg(R8.A);
  const val = cpu.bus.read(cpu.getReg(R16.HL));
  const result = (A - val) & 0xff;

  cpu.setReg(R8.A, result);
  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, true);
  cpu.setFlag(F.H, (A & 0xf) < (val & 0xf));
  cpu.setFlag(F.C, A < val);

  return 2;
}

// (SUB A,n8): Subtract the value n8 from A.
export function SUB_A_n8(cpu: Cpu): MCycles {
  const A = cpu.getReg(R8.A);
  const val = cpu.bus.read(cpu.getReg(R16.PC));
  const result = (A - val) & 0xff;

  cpu.incReg(R16.PC);
  cpu.setReg(R8.A, result);
  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, true);
  cpu.setFlag(F.H, (A & 0xf) < (val & 0xf));
  cpu.setFlag(F.C, A < val);

  return 0;
}

// (CP A, r8): ComPare the value in A with the value in r8.
export function CP_A_r8(cpu: Cpu, r8: R8): MCycles {
  const A = cpu.getReg(R8.A);
  const val = cpu.getReg(r8);
  const result = A - val;

  cpu.setFlag(F.Z, (result & 0xff) === 0);
  cpu.setFlag(F.N, true);
  cpu.setFlag(F.H, (A & 0x0f) < (val & 0x0f));
  cpu.setFlag(F.C, A < val);

  return 0;
}

// (CP A,[HL]): ComPare the value in A with the byte pointed to by HL.
export function CP_A_HL(cpu: Cpu): MCycles {
  const A = cpu.getReg(R8.A);
  const val = cpu.bus.read(cpu.getReg(R16.HL));
  const result = A - val;

  cpu.setFlag(F.Z, (result & 0xff) === 0);
  cpu.setFlag(F.N, true);
  cpu.setFlag(F.H, (A & 0x0f) < (val & 0x0f));
  cpu.setFlag(F.C, A < val);

  return 2;
}

// (CP A,n8): ComPare the value in A with the value n8.
export function CP_A_n8(cpu: Cpu): MCycles {
  const A = cpu.getReg(R8.A);
  const val = cpu.bus.read(cpu.getReg(R16.PC));
  const result = A - val;

  cpu.incReg(R16.PC);
  cpu.setFlag(F.Z, (result & 0xff) === 0);
  cpu.setFlag(F.N, true);
  cpu.setFlag(F.H, (A & 0x0f) < (val & 0x0f));
  cpu.setFlag(F.C, A < val);

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

// (POP r16): Pop register r16 from the stack. This is roughly equivalent to the following imaginary instructions:
export function POP_r16(cpu: Cpu, r16: R16) {
  cpu.setReg(r16, cpu.stack.pop16());

  return 0;
}

// (PUSH AF):     TODO

// (PUSH r16): Push register r16 into the stack. This is roughly equivalent to the following imaginary instructions:
export function PUSH_r16(cpu: Cpu, r16: R16) {
  cpu.stack.push16(cpu.getReg(r16));

  return 0;
}

// (AND A, r8): Set A to the bitwise AND between the value in r8 and A.
export function AND_A_r8(cpu: Cpu, r8: R8): MCycles {
  const result = cpu.getReg(R8.A) & cpu.getReg(r8);

  cpu.setReg(R8.A, result);
  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, true);
  cpu.setFlag(F.C, false);

  return 0;
}

// (AND A,[HL]): Set A to the bitwise AND between the byte pointed to by HL and A.
export function AND_A_HL(cpu: Cpu): MCycles {
  const result = cpu.getReg(R8.A) & cpu.bus.read(cpu.getReg(R16.HL));

  cpu.setReg(R8.A, result);

  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, true);
  cpu.setFlag(F.C, false);

  return 2;
}

// (AND A,n8): Set A to the bitwise AND between the value n8 and A.
export function AND_A_n8(cpu: Cpu): MCycles {
  const result = cpu.getReg(R8.A) & cpu.bus.read(cpu.getReg(R16.PC));

  cpu.incReg(R16.PC);
  cpu.setReg(R8.A, result);
  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, true);
  cpu.setFlag(F.C, false);

  return 2;
}

// (OR A, r8): Set A to the bitwise OR between the value in r8 and A.
export function OR_A_r8(cpu: Cpu, r8: R8): MCycles {
  const result = cpu.getReg(R8.A) | cpu.getReg(r8);

  cpu.setReg(R8.A, result);
  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, false);
  cpu.setFlag(F.C, false);

  return 0;
}

// (OR A,[HL]): Set A to the bitwise OR between the byte pointed to by HL and A.
export function OR_A_HL(cpu: Cpu): MCycles {
  const result = cpu.getReg(R8.A) | cpu.bus.read(cpu.getReg(R16.HL));

  cpu.setReg(R8.A, result);
  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, false);
  cpu.setFlag(F.C, false);

  return 2;
}

// (OR A,n8): Set A to the bitwise OR between the value n8 and A.
export function OR_A_n8(cpu: Cpu): MCycles {
  const result = cpu.getReg(R8.A) | cpu.bus.read(cpu.getReg(R16.PC));

  cpu.incReg(R16.PC);
  cpu.setReg(R8.A, result);
  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, false);
  cpu.setFlag(F.C, false);

  return 2;
}

// (XOR A, r8): Set A to the bitwise XOR between the value in r8 and A.
export function XOR_A_r8(cpu: Cpu, r8: R8): MCycles {
  const result = cpu.getReg(R8.A) ^ cpu.getReg(r8);

  cpu.setReg(R8.A, result);
  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, false);
  cpu.setFlag(F.C, false);

  return 0;
}

// (XOR A,[HL]): Set A to the bitwise XOR between the byte pointed to by HL and A.
export function XOR_A_HL(cpu: Cpu): MCycles {
  const result = cpu.getReg(R8.A) ^ cpu.bus.read(cpu.getReg(R16.HL));

  cpu.setReg(R8.A, result);
  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, false);
  cpu.setFlag(F.C, false);

  return 2;
}

// (XOR A,n8): Set A to the bitwise XOR between the value n8 and A.
export function XOR_A_n8(cpu: Cpu): MCycles {
  const result = cpu.getReg(R8.A) ^ cpu.bus.read(cpu.getReg(R16.PC));

  cpu.incReg(R16.PC);
  cpu.setReg(R8.A, result);
  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, false);
  cpu.setFlag(F.C, false);

  return 2;
}

// (CPL): ComPLement accumulator (A = ~A); also called bitwise NOT.
export function CPL(cpu: Cpu) {
  cpu.setReg(R8.A, ~cpu.getReg(R8.A));
  cpu.setFlag(F.N, true);
  cpu.setFlag(F.H, true);

  return 0;
}

// (BIT u3,r8): Test bit u3 in register r8, set the zero flag if bit not set.
export function BIT_u3_r8(cpu: Cpu, u3: number, r8: R8) {
  const result = cpu.getReg(r8) & (1 << u3);

  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, true);

  return 2;
}

// (BIT u3,[HL]): Test bit u3 in the byte pointed by HL, set the zero flag if bit not set.
export function BIT_u3_HL(cpu: Cpu, u3: number) {
  const result = cpu.bus.read(cpu.getReg(R16.HL)) & (1 << u3);

  cpu.setFlag(F.Z, result === 0);
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, true);

  return 2;
}

// (RES u3,r8): Set bit u3 in register r8 to 0. Bit 0 is the rightmost one, bit 7 the leftmost one.
export function RES_u3_r8(cpu: Cpu, u3: number, r8: R8) {
  const value = cpu.getReg(r8);
  const mask = ~(1 << u3);

  cpu.setReg(r8, value & mask);

  return 2;
}

// (RES u3,[HL]): Set bit u3 in the byte pointed by HL to 0. Bit 0 is the rightmost one, bit 7 the leftmost one.
export function RES_u3_HL(cpu: Cpu, u3: number) {
  const HL = cpu.getReg(R16.HL);
  const mask = ~(1 << u3);

  cpu.bus.write(HL, cpu.bus.read(HL) & mask);

  return 2;
}

// (SET u3,r8): Set bit u3 in register r8 to 1. Bit 0 is the rightmost one, bit 7 the leftmost one.
export function SET_u3_r8(cpu: Cpu, u3: number, r8: R8) {
  const value = cpu.getReg(r8);
  const mask = 1 << u3;

  cpu.setReg(r8, value | mask);

  return 2;
}

// (SET u3,[HL]): Set bit u3 in the byte pointed by HL to 1. Bit 0 is the rightmost one, bit 7 the leftmost one.
export function SET_u3_HL(cpu: Cpu, u3: number) {
  const HL = cpu.getReg(R16.HL);
  const mask = 1 << u3;

  cpu.bus.write(HL, cpu.bus.read(HL) | mask);

  return 2;
}

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
export function DI(cpu: Cpu) {
  cpu.ime = 0;

  return 0;
}

// (EI): Enable Interrupts by setting the IME flag.
export function EI(cpu: Cpu) {
  cpu.ime = 1;

  return 0;
}

// (HALT): TODO

// (CALL n16): This pushes the address of the instruction after the CALL on the stack, such that RET can pop it later; then, it executes an implicit JP n16.
export function CALL(cpu: Cpu) {
  const addr = cpu.bus.read16(cpu.getReg(R16.PC));
  cpu.incReg(R16.PC, 2);
  cpu.stack.push16(cpu.getReg(R16.PC));
  cpu.setReg(R16.PC, addr);
}

// (CALL cc,n16): TODO

// (JP HL): Jump to address in HL; effectively, copy the value in register HL into PC.
export function JP_HL(cpu: Cpu) {
  cpu.setReg(R16.PC, cpu.getReg(R16.HL));

  return 0;
}

// (JP n16): Jump to address n16; effectively, copy n16 into PC.
export function JP_n16(cpu: Cpu) {
  const addr = cpu.bus.read16(cpu.getReg(R16.PC));
  cpu.setReg(R16.PC, addr);

  return 0;
}

// (JP cc,n16):   TODO

// (JR n16):      TODO

// (JR cc,n16):   TODO

// (RET cc):      TODO

// (RET): Return from subroutine. This is basically a POP PC (if such an instruction existed). See POP r16 for an explanation of how POP works.
export function RET(cpu: Cpu) {
  cpu.setReg(R16.PC, cpu.stack.pop16());

  return 0;
}

// (RETI):        TODO

// (RST vec):     TODO

// (LD r8,r8): Copy the value in register on the right into the register on the left.
export function LD_r8_r8(cpu: Cpu, r8_1: R8, r8_2: R8): MCycles {
  cpu.setReg(r8_1, cpu.getReg(r8_2));

  return 0;
}

// (LD r8,n8): Copy the value n8 into register r8'.
export function LD_r8_n8(cpu: Cpu, r8: R8): MCycles {
  cpu.setReg(r8, cpu.bus.read(cpu.getReg(R16.PC)));
  cpu.incReg(R16.PC);

  return 2;
}

// (LD r16,n16): Copy the value n16 into register r16.
export function LD_r16_n16(cpu: Cpu, r16: R16): MCycles {
  cpu.setReg(r16, cpu.bus.read16(cpu.getReg(R16.PC)));
  cpu.incReg(R16.PC, 2);

  return 2;
}

// (LD [r16],A): Copy the value in register A into the byte pointed to by r16.
export function LD_r16_A(cpu: Cpu, r16: R16): MCycles {
  const addr = cpu.getReg(r16);
  cpu.bus.write(addr, cpu.getReg(R8.A));

  return 2;
}

// (LD [HL],r8): Copy the value in register r8 into the byte pointed to by HL.
export function LD_HL_r8(cpu: Cpu, r8: R8): MCycles {
  cpu.bus.write(cpu.getReg(R16.HL), cpu.getReg(r8));

  return 0;
}

// (LD [HL],n8): Copy the value n8 into the byte pointed to by HL.
export function LD_HL_n8(cpu: Cpu): MCycles {
  cpu.bus.write(cpu.getReg(R16.HL), cpu.bus.read(cpu.getReg(R16.PC)));
  cpu.incReg(R16.PC);

  return 1;
}

// (LD SP,n16): Copy the value n16 into register SP.
export function LD_SP_n16(cpu: Cpu): MCycles {
  cpu.setReg(R16.SP, cpu.bus.read16(cpu.getReg(R16.PC)));
  cpu.incReg(R16.PC, 2);

  return 2;
}

// (LD A,[r16]): Copy the byte pointed to by r16 into register A.
export function LD_A_r16(cpu: Cpu, r16: R16): MCycles {
  cpu.setReg(R8.A, cpu.bus.read(cpu.getReg(r16)));

  return 1;
}

// (LD r8,[HL]): Copy the value pointed to by HL into register r8.
export function LD_r8_HL(cpu: Cpu, r8: R8): MCycles {
  cpu.setReg(r8, cpu.bus.read(cpu.getReg(R16.HL)));

  return 1;
}

// (LD [HLI],A): Copy the value in register A into the byte pointed by HL and increment HL afterwards.
export function LD_HLI_A(cpu: Cpu): MCycles {
  cpu.bus.write(cpu.getReg(R16.HL), cpu.getReg(R8.A));
  cpu.incReg(R16.HL);

  return 1;
}

// (LD [HLD],A): Copy the value in register A into the byte pointed by HL and decrement HL afterwards.
export function LD_HLD_A(cpu: Cpu): MCycles {
  cpu.bus.write(cpu.getReg(R16.HL), cpu.getReg(R8.A));
  cpu.decReg(R16.HL);

  return 0;
}

// (LD A,[HLI]): Copy the byte pointed to by HL into register A, and increment HL afterwards.
export function LD_A_HLI(cpu: Cpu): MCycles {
  cpu.setReg(R8.A, cpu.bus.read(cpu.getReg(R16.HL)));
  cpu.incReg(R16.HL);

  return 1;
}

// (LD A,[HLD]): Copy the byte pointed to by HL into register A, and decrement HL afterwards.
export function LD_A_HLD(cpu: Cpu): MCycles {
  cpu.setReg(R8.A, cpu.bus.read(cpu.getReg(R16.HL)));
  cpu.decReg(R16.HL);

  return 1;
}

// (LD SP,HL): Copy register HL into register SP.
export function LD_SP_HL(cpu: Cpu): MCycles {
  cpu.setReg(R16.SP, cpu.getReg(R16.HL));

  return 0;
}

// (LD [n16],SP): Copy SP & $FF at address n16 and SP >> 8 at address n16 + 1.
export function LD_n16_SP(cpu: Cpu): MCycles {
  const addr = cpu.bus.read16(cpu.getReg(R16.PC));
  cpu.bus.write16(addr, cpu.SP);
  cpu.incReg(R16.PC, 2);

  return 2;
}

// (LD [n16],A): Copy the value in register A into the byte at address n16.
export function LD_n16_A(cpu: Cpu): MCycles {
  const addr = cpu.bus.read16(cpu.getReg(R16.PC));
  cpu.bus.write16(addr, cpu.getReg(R8.A));
  cpu.incReg(R16.PC, 2);

  return 2;
}

// (LD A,[n16]): Copy the byte at address n16 into register A.
export function LD_A_n16(cpu: Cpu): MCycles {
  const addr = cpu.bus.read16(cpu.getReg(R16.PC));
  cpu.incReg(R16.PC, 2);
  cpu.setReg(R8.A, cpu.bus.read(addr));

  return 2;
}

// (LD HL,SP+e8): Add the signed value e8 to SP and copy the result in HL.
export function LD_HL_SP_E8(cpu: Cpu): MCycles {
  const r8_val = (cpu.bus.read(cpu.getReg(R16.PC)) << 24) >> 24;
  const result = (cpu.SP + r8_val) & 0xffff;

  cpu.incReg(R16.PC);
  cpu.setReg(R16.HL, result);
  cpu.setFlag(F.Z, false);
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, (cpu.SP & 0xf) + (r8_val & 0xf) > 0xf);
  cpu.setFlag(F.C, (cpu.SP & 0xff) + (r8_val & 0xff) > 0xff);

  return 3;
}

// (LDH [n16],A): Copy the value in register A into the byte at address n16, provided the address is between $FF00 and $FFFF.
export function LDH_n16_A(cpu: Cpu): MCycles {
  const addr = 0xff00 + cpu.bus.read(cpu.getReg(R16.PC));

  cpu.incReg(R16.PC);
  cpu.bus.write(addr, cpu.getReg(R8.A));

  return 3;
}

// (LDH [C],A):   TODO

// (LDH A,[n16]): TODO

// (LDH A,[C]):   TODO

// (DAA):  TODO

// (NOP): No OPeration.
export function NOP() {
  return 0;
}

// (STOP): TODO

// (CCF): Complement Carry Flag.
export function CCF(cpu: Cpu) {
  cpu.setFlag(F.C, !cpu.getFlag(F.C));

  return 0;
}

// (SCF): Set Carry Flag.
export function SCF(cpu: Cpu) {
  cpu.setFlag(F.N, false);
  cpu.setFlag(F.H, false);
  cpu.setFlag(F.C, true);

  return 0;
}
