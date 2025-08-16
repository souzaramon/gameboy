import { Cpu } from "./cpu";
import { F, R8, R16, C, Vec } from "./cpu.types";

/**
 * r8  : Any of the 8-bit registers (A, B, C, D, E, H, L).
 * r16 : Any of the general-purpose 16-bit registers (BC, DE, HL).
 * n8  : 8-bit integer constant (signed or unsigned, -128 to 255).
 * n16 : 16-bit integer constant (signed or unsigned, -32768 to 65535).
 * e8  : 8-bit signed offset (-128 to 127).
 * u3  : 3-bit unsigned bit index (0 to 7, with 0 as the least significant bit).
 * cc  : A condition code:
 *     - Z  Execute if Z is set.
 *     - NZ Execute if Z is not set.
 *     - C  Execute if C is set.
 *     - NC Execute if C is not set.
 * vec: An RST vector (0x00, 0x08, 0x10, 0x18, 0x20, 0x28, 0x30, and 0x38).
 */

// (ADD A,r8): Add the val in r8 to A.
export function ADD_A_r8(cpu: Cpu, r8: R8) {
  const A_val = cpu.get_reg(R8.A);
  const r8_val = cpu.get_reg(r8);

  const result = (A_val + r8_val) & 0xff;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, (A_val & 0xf) + (r8_val & 0xf) > 0xf);
  cpu.set_flag(F.C, A_val + r8_val > 0xff);
}

// (ADD A,[HL]): Add the byte pointed to by HL to A.
export function ADD_A_HL(cpu: Cpu) {
  const A_val = cpu.get_reg(R8.A);
  const HL_val = cpu.bus.read(cpu.get_reg(R16.HL));

  const result = (A_val + HL_val) & 0xff;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, (A_val & 0xf) + (HL_val & 0xf) > 0xf);
  cpu.set_flag(F.C, A_val + HL_val > 0xff);
}

// (ADD A,n8): Add the val n8 to A.
export function ADD_A_n8(cpu: Cpu) {
  const A_val = cpu.get_reg(R8.A);

  const n8_val = cpu.bus.read(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC);

  const result = (A_val + n8_val) & 0xff;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, (A_val & 0xf) + (n8_val & 0xf) > 0xf);
  cpu.set_flag(F.C, A_val + n8_val > 0xff);
}

// (ADD HL,SP) / (ADD HL,r16): Add the val in r16 to HL.
export function ADD_HL_r16(cpu: Cpu, r16: R16) {
  const HL_val = cpu.get_reg(R16.HL);
  const r16_val = cpu.get_reg(r16);

  const result = (HL_val + r16_val) & 0xffff;
  cpu.set_reg(R16.HL, result);

  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, (HL_val & 0xfff) + (r16_val & 0xfff) > 0xfff);
  cpu.set_flag(F.C, HL_val + r16_val > 0xffff);
}

// (ADD SP,e8): Add the signed val e8 to SP.
export function ADD_SP_e8(cpu: Cpu) {
  const SP_val = cpu.get_reg(R16.SP);

  const e8_val = cpu.bus.read(cpu.get_reg(R16.PC));
  const e8_val_signed = e8_val < 0x80 ? e8_val : e8_val - 0x100;
  cpu.inc_reg(R16.PC);

  const result = (SP_val + e8_val_signed) & 0xffff;
  cpu.set_reg(R16.SP, result);

  cpu.set_flag(F.Z, false);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, (SP_val & 0xf) + (e8_val_signed & 0xf) > 0xf);
  cpu.set_flag(F.C, (SP_val & 0xff) + (e8_val_signed & 0xff) > 0xff);
}

// (SUB A,r8): Subtract the val in r8 from A.
export function SUB_A_r8(cpu: Cpu, r8: R8) {
  const A_val = cpu.get_reg(R8.A);
  const r8_val = cpu.get_reg(r8);

  const result = (A_val - r8_val) & 0xff;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, true);
  cpu.set_flag(F.H, (A_val & 0xf) < (r8_val & 0xf));
  cpu.set_flag(F.C, A_val < r8_val);
}

// (SUB A,[HL]): Subtract the byte pointed to by HL from A.
export function SUB_A_HL(cpu: Cpu) {
  const A_val = cpu.get_reg(R8.A);
  const n8_val = cpu.bus.read(cpu.get_reg(R16.HL));

  const result = (A_val - n8_val) & 0xff;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, true);
  cpu.set_flag(F.H, (A_val & 0xf) < (n8_val & 0xf));
  cpu.set_flag(F.C, A_val < n8_val);
}

// (SUB A,n8): Subtract the val n8 from A.
export function SUB_A_n8(cpu: Cpu) {
  const A_val = cpu.get_reg(R8.A);

  const n8_val = cpu.bus.read(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC);

  const result = (A_val - n8_val) & 0xff;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, true);
  cpu.set_flag(F.H, (A_val & 0xf) < (n8_val & 0xf));
  cpu.set_flag(F.C, A_val < n8_val);
}

// (CP A, r8): ComPare the val in A with the val in r8.
export function CP_A_r8(cpu: Cpu, r8: R8) {
  const A_val = cpu.get_reg(R8.A);
  const r8_val = cpu.get_reg(r8);

  cpu.set_flag(F.Z, ((A_val - r8_val) & 0xff) === 0);
  cpu.set_flag(F.N, true);
  cpu.set_flag(F.H, (A_val & 0x0f) < (r8_val & 0x0f));
  cpu.set_flag(F.C, A_val < r8_val);
}

// (CP A,[HL]): ComPare the val in A with the byte pointed to by HL.
export function CP_A_HL(cpu: Cpu) {
  const A_val = cpu.get_reg(R8.A);
  const n8_val = cpu.bus.read(cpu.get_reg(R16.HL));

  cpu.set_flag(F.Z, ((A_val - n8_val) & 0xff) === 0);
  cpu.set_flag(F.N, true);
  cpu.set_flag(F.H, (A_val & 0x0f) < (n8_val & 0x0f));
  cpu.set_flag(F.C, A_val < n8_val);
}

// (CP A,n8): ComPare the val in A with the val n8.
export function CP_A_n8(cpu: Cpu) {
  const A_val = cpu.get_reg(R8.A);

  const n8_val = cpu.bus.read(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC);

  cpu.set_flag(F.Z, ((A_val - n8_val) & 0xff) === 0);
  cpu.set_flag(F.N, true);
  cpu.set_flag(F.H, (A_val & 0x0f) < (n8_val & 0x0f));
  cpu.set_flag(F.C, A_val < n8_val);
}

// (ADC A,r8): Add the value in r8 plus the carry flag to A.
export function ADC_A_r8(cpu: Cpu, r8: R8) {
  const A_val = cpu.get_reg(R8.A);
  const C_val = Number(cpu.get_flag(F.C));
  const r8_val = cpu.get_reg(r8);

  const result = (A_val + r8_val + C_val) & 0xff;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, (A_val & 0xf) + (r8_val & 0xf) + C_val > 0xf);
  cpu.set_flag(F.C, A_val + r8_val + C_val > 0xff);
}

// (ADC A,[HL]): Add the byte pointed to by HL plus the carry flag to A.
export function ADC_A_HL(cpu: Cpu) {
  const A_val = cpu.get_reg(R8.A);
  const r16_val = cpu.bus.read(cpu.get_reg(R16.HL));
  const C_val = Number(cpu.get_flag(F.C));

  const result = (A_val + r16_val + C_val) & 0xff;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, (A_val & 0xf) + (r16_val & 0xf) + C_val > 0xf);
  cpu.set_flag(F.C, A_val + r16_val + C_val > 0xff);
}

// (ADC A,n8): Add the value n8 plus the carry flag to A.
export function ADC_A_n8(cpu: Cpu) {
  const A_val = cpu.get_reg(R8.A);
  const C_val = Number(cpu.get_flag(F.C));

  const n8_val = cpu.bus.read(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC);

  const result = (A_val + n8_val + C_val) & 0xff;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, (A_val & 0xf) + (n8_val & 0xf) + C_val > 0xf);
  cpu.set_flag(F.C, A_val + n8_val + C_val > 0xff);
}

// (DEC r8): Decrement the value in register r8 by 1.
export function DEC_r8(cpu: Cpu, r8: R8) {
  const r8_val = cpu.get_reg(r8);

  const result = (r8_val - 1) & 0xff;
  cpu.set_reg(r8, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, true);
  cpu.set_flag(F.H, (r8_val & 0x0f) === 0);
}

// (DEC [HL]): Decrement the byte pointed to by HL by 1.
export function DEC_HL(cpu: Cpu) {
  const HL_val = cpu.get_reg(R16.HL);
  const n8_val = cpu.bus.read(HL_val);

  const result = (n8_val - 1) & 0xff;
  cpu.bus.write(HL_val, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, true);
  cpu.set_flag(F.H, (n8_val & 0x0f) === 0);
}

// (DEC SP) / (DEC r16): Decrement the value in register r16 by 1.
export function DEC_r16(cpu: Cpu, r16: R16) {
  cpu.dec_reg(r16);
}

// (INC r8): Increment the val in register r8 by 1.
export function INC_r8(cpu: Cpu, r8: R8) {
  const r8_val = cpu.get_reg(r8);

  const result = (r8_val + 1) & 0xff;
  cpu.set_reg(r8, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, (r8_val & 0x0f) + 1 > 0x0f);
}

// (INC [HL]): Increment the byte pointed to by HL by 1.
export function INC_HL(cpu: Cpu) {
  const HL_val = cpu.get_reg(R16.HL);
  const n8_val = cpu.bus.read(HL_val);

  const result = (n8_val + 1) & 0xff;
  cpu.bus.write(HL_val, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, (n8_val & 0x0f) + 1 > 0x0f);
}

// (INC SP) / (INC r16): Increment the val in register r16 by 1.
export function INC_r16(cpu: Cpu, r16: R16) {
  cpu.inc_reg(r16);
}

// (SBC A,r8): Subtract the value in r8 and the carry flag from A.
export function SBC_A_r8(cpu: Cpu, r8: R8) {
  const A_val = cpu.get_reg(R8.A);
  const C_val = Number(cpu.get_flag(F.C));
  const r8_val = cpu.get_reg(r8);

  const result = (A_val - r8_val - C_val) & 0xff;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, true);
  cpu.set_flag(F.H, (A_val & 0xf) - (r8_val & 0xf) - C_val < 0);
  cpu.set_flag(F.C, A_val < r8_val + C_val);
}

// (SBC A,[HL]): Subtract the byte pointed to by HL and the carry flag from A.
export function SBC_A_HL(cpu: Cpu) {
  const A_val = cpu.get_reg(R8.A);
  const C_val = Number(cpu.get_flag(F.C));
  const n8_val = cpu.bus.read(cpu.get_reg(R16.HL));

  const result = (A_val - n8_val - C_val) & 0xff;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, true);
  cpu.set_flag(F.H, (A_val & 0xf) - (n8_val & 0xf) - C_val < 0);
  cpu.set_flag(F.C, A_val < n8_val + C_val);
}

// (SBC A,n8): Subtract the value n8 and the carry flag from A.
export function SBC_A_n8(cpu: Cpu) {
  const A_val = cpu.get_reg(R8.A);
  const C_val = Number(cpu.get_flag(F.C));

  const n8_val = cpu.bus.read(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC);

  const result = (A_val - n8_val - C_val) & 0xff;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, true);
  cpu.set_flag(F.H, (A_val & 0xf) - (n8_val & 0xf) - C_val < 0);
  cpu.set_flag(F.C, A_val < n8_val + C_val);
}

// (POP AF): Pop register AF from the stack.
export function POP_AF(cpu: Cpu) {
  const lo = cpu.stack.pop();
  const hi = cpu.stack.pop();

  cpu.set_reg(R8.A, hi);
  cpu.set_reg(R8.F, lo & 0xf0);
}

// (POP r16): Pop register r16 from the stack.
export function POP_r16(cpu: Cpu, r16: R16) {
  cpu.set_reg(r16, cpu.stack.pop16());
}

// (PUSH AF) / (PUSH r16): Push register r16 into the stack.
export function PUSH_r16(cpu: Cpu, r16: R16) {
  cpu.stack.push16(cpu.get_reg(r16));
}

// (AND A, r8): Set A to the bitwise AND between the val in r8 and A.
export function AND_A_r8(cpu: Cpu, r8: R8) {
  const result = cpu.get_reg(R8.A) & cpu.get_reg(r8);
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, true);
  cpu.set_flag(F.C, false);
}

// (AND A,[HL]): Set A to the bitwise AND between the byte pointed to by HL and A.
export function AND_A_HL(cpu: Cpu) {
  const result = cpu.get_reg(R8.A) & cpu.bus.read(cpu.get_reg(R16.HL));
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, true);
  cpu.set_flag(F.C, false);
}

// (AND A,n8): Set A to the bitwise AND between the val n8 and A.
export function AND_A_n8(cpu: Cpu) {
  const n8_val = cpu.bus.read(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC);

  const result = cpu.get_reg(R8.A) & n8_val;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, true);
  cpu.set_flag(F.C, false);
}

// (OR A, r8): Set A to the bitwise OR between the val in r8 and A.
export function OR_A_r8(cpu: Cpu, r8: R8) {
  const result = cpu.get_reg(R8.A) | cpu.get_reg(r8);
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, false);
}

// (OR A,[HL]): Set A to the bitwise OR between the byte pointed to by HL and A.
export function OR_A_HL(cpu: Cpu) {
  const result = cpu.get_reg(R8.A) | cpu.bus.read(cpu.get_reg(R16.HL));
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, false);
}

// (OR A,n8): Set A to the bitwise OR between the val n8 and A.
export function OR_A_n8(cpu: Cpu) {
  const n8_val = cpu.bus.read(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC);

  const result = cpu.get_reg(R8.A) | n8_val;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, false);
}

// (XOR A, r8): Set A to the bitwise XOR between the val in r8 and A.
export function XOR_A_r8(cpu: Cpu, r8: R8) {
  const result = cpu.get_reg(R8.A) ^ cpu.get_reg(r8);
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, false);
}

// (XOR A,[HL]): Set A to the bitwise XOR between the byte pointed to by HL and A.
export function XOR_A_HL(cpu: Cpu) {
  const result = cpu.get_reg(R8.A) ^ cpu.bus.read(cpu.get_reg(R16.HL));
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, false);
}

// (XOR A,n8): Set A to the bitwise XOR between the val n8 and A.
export function XOR_A_n8(cpu: Cpu) {
  const n8_val = cpu.bus.read(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC);

  const result = cpu.get_reg(R8.A) ^ n8_val;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, false);
}

// (CPL): ComPLement accumulator (A = ~A); also called bitwise NOT.
export function CPL(cpu: Cpu) {
  cpu.set_reg(R8.A, ~cpu.get_reg(R8.A));
  cpu.set_flag(F.N, true);
  cpu.set_flag(F.H, true);
}

// (BIT u3,r8): Test bit u3 in register r8, set the zero flag if bit not set.
export function BIT_u3_r8(cpu: Cpu, u3: number, r8: R8) {
  const result = cpu.get_reg(r8) & (1 << u3);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, true);
}

// (BIT u3,[HL]): Test bit u3 in the byte pointed by HL, set the zero flag if bit not set.
export function BIT_u3_HL(cpu: Cpu, u3: number) {
  const result = cpu.bus.read(cpu.get_reg(R16.HL)) & (1 << u3);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, true);
}

// (RES u3,r8): Set bit u3 in register r8 to 0. Bit 0 is the rightmost one, bit 7 the leftmost one.
export function RES_u3_r8(cpu: Cpu, u3: number, r8: R8) {
  const r8_val = cpu.get_reg(r8);
  const mask = ~(1 << u3);

  cpu.set_reg(r8, r8_val & mask);
}

// (RES u3,[HL]): Set bit u3 in the byte pointed by HL to 0. Bit 0 is the rightmost one, bit 7 the leftmost one.
export function RES_u3_HL(cpu: Cpu, u3: number) {
  const HL_val = cpu.get_reg(R16.HL);
  const mask = ~(1 << u3);

  cpu.bus.write(HL_val, cpu.bus.read(HL_val) & mask);
}

// (SET u3,r8): Set bit u3 in register r8 to 1. Bit 0 is the rightmost one, bit 7 the leftmost one.
export function SET_u3_r8(cpu: Cpu, u3: number, r8: R8) {
  const r8_val = cpu.get_reg(r8);
  const mask = 1 << u3;

  cpu.set_reg(r8, r8_val | mask);
}

// (SET u3,[HL]): Set bit u3 in the byte pointed by HL to 1. Bit 0 is the rightmost one, bit 7 the leftmost one.
export function SET_u3_HL(cpu: Cpu, u3: number) {
  const HL_val = cpu.get_reg(R16.HL);
  const mask = 1 << u3;

  cpu.bus.write(HL_val, cpu.bus.read(HL_val) | mask);
}

// (RL r8):         TODO

// (RL [HL]):       TODO

// (RLA):           TODO

// (RLC r8):        TODO

// (RLC [HL]):      TODO

// (RLCA):          TODO

// (RR r8):         TODO

// (RR [HL]):       TODO

// (RRA): Rotate register A right, through the carry flag.
export function RRA(cpu: Cpu) {
  const A_val = cpu.get_reg(R8.A);
  const C_val = cpu.get_flag(F.C);
  const carry = A_val & 1;

  const result = (Number(C_val) << 7) | (A_val >> 1);
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, false);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, carry);
}

// (RRC r8): Rotate register r8 right.
export function RRC_r8(cpu: Cpu, r8: R8) {
  const r8_val = cpu.get_reg(r8);
  const carry = r8_val & 1;

  const result = (carry << 7) | (r8_val >> 1);
  cpu.set_reg(r8, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, carry);
}

// (RRC [HL]): Rotate the byte pointed to by HL right.
export function RRC_HL(cpu: Cpu) {
  const HL_val = cpu.get_reg(R16.HL);
  const n8_val = cpu.bus.read(HL_val);
  const carry = n8_val & 1;

  const result = (carry << 7) | (n8_val >> 1);
  cpu.bus.write(HL_val, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, carry);
}

// (RRCA): Rotate register A right.
export function RRCA(cpu: Cpu) {
  const A_val = cpu.get_reg(R8.A);
  const carry = A_val & 1;

  const result = (carry << 7) | (A_val >> 1);
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, false);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, carry);
}

// (SLA r8): Shift Left Arithmetically register r8.
export function SLA(cpu: Cpu, r8: R8) {
  const r8_val = cpu.get_reg(r8);
  const carry = (r8_val >> 7) & 1;

  const result = (r8_val << 1) & 0xff;
  cpu.set_reg(r8, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, carry);
}

// (SLA [HL]): Shift Left Arithmetically the byte pointed to by HL.
export function SLA_HL(cpu: Cpu) {
  const HL_val = cpu.get_reg(R16.HL);
  const n8_val = cpu.bus.read(HL_val);
  const carry = (n8_val >> 7) & 1;

  const result = (n8_val << 1) & 0xff;
  cpu.bus.write(HL_val, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, carry);
}

// (SRA r8): Shift Right Arithmetically register r8 (bit 7 of r8 is unchanged).
export function SRA(cpu: Cpu, r8: R8) {
  const r8_val = cpu.get_reg(r8);
  const lsb = r8_val & 0x01;
  const msb = r8_val & 0x80;

  const result = (r8_val >> 1) | msb;
  cpu.set_reg(r8, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, lsb);
}

// (SRA [HL]): Shift Right Arithmetically the byte pointed to by HL (bit 7 of the byte pointed to by HL is unchanged).
export function SRA_HL(cpu: Cpu) {
  const HL_val = cpu.get_reg(R16.HL);
  const n8_val = cpu.bus.read(HL_val);
  const lsb = n8_val & 0x01;
  const msb = n8_val & 0x80;

  const result = (n8_val >> 1) | msb;
  cpu.bus.write(HL_val, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, lsb);
}

// (SRL r8): Shift Right Logically register r8.
export function SRL(cpu: Cpu, r8: R8) {
  const r8_val = cpu.get_reg(r8);
  const carry = r8_val & 1;

  const result = r8_val >> 1;
  cpu.set_reg(r8, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, carry);
}

// (SRL [HL]): Shift Right Logically the byte pointed to by HL.
export function SRL_HL(cpu: Cpu) {
  const HL_val = cpu.get_reg(R16.HL);
  const n8_val = cpu.bus.read(HL_val);
  const carry = n8_val & 1;

  const result = n8_val >> 1;
  cpu.bus.write(HL_val, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, carry);
}

// (SWAP r8): Swap the upper 4 bits in register r8 and the lower 4 ones.
export function SWAP(cpu: Cpu, r8: R8) {
  const r8_val = cpu.get_reg(r8);
  const lo = r8_val & 0xf;
  const hi = r8_val >> 4;

  const result = (lo << 4) | hi;
  cpu.set_reg(r8, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, false);
}

// (SWAP [HL]): Swap the upper 4 bits in the byte pointed by HL and the lower 4 ones.
export function SWAP_HL(cpu: Cpu) {
  const HL_val = cpu.get_reg(R16.HL);
  const n8_val = cpu.bus.read(HL_val);
  const hi = n8_val >> 4;
  const lo = n8_val & 0xf;

  const result = (lo << 4) | hi;
  cpu.bus.write(HL_val, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, false);
}

// (DI): Disable Interrupts by clearing the IME flag.
export function DI(cpu: Cpu) {
  cpu.ime = 0;
}

// (EI): Enable Interrupts by setting the IME flag.
export function EI(cpu: Cpu) {
  cpu.ei = 1;
}

// (HALT): Enter CPU low-power consumption mode until an interrupt occurs.
export function HALT() {}

// (CALL n16): This pushes the address of the instruction after the CALL on the stack, such that RET can pop it later; then, it executes an implicit JP n16.
export function CALL_n16(cpu: Cpu) {
  const n16_val = cpu.bus.read16(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC, 2);

  cpu.stack.push16(cpu.get_reg(R16.PC));
  cpu.set_reg(R16.PC, n16_val);
}

// (CALL cc,n16): Call address n16 if condition cc is met.
export function CALL_cc_n16(cpu: Cpu, condition: C) {
  const n16_val = cpu.bus.read16(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC, 2);

  if (cpu.check_condition(condition)) {
    cpu.stack.push16(cpu.get_reg(R16.PC));
    cpu.set_reg(R16.PC, n16_val);
  }
}

// (JP HL): Jump to address in HL; effectively, copy the val in register HL into PC.
export function JP_HL(cpu: Cpu) {
  cpu.set_reg(R16.PC, cpu.get_reg(R16.HL));
}

// (JP n16): Jump to address n16; effectively, copy n16 into PC.
export function JP_n16(cpu: Cpu) {
  const n16_val = cpu.bus.read16(cpu.get_reg(R16.PC));
  cpu.set_reg(R16.PC, n16_val);
}

// (JP cc,n16): Jump to address n16 if condition cc is met.
export function JP_cc_n16(cpu: Cpu, condition: C) {
  const n16_val = cpu.bus.read16(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC, 2);

  if (cpu.check_condition(condition)) {
    cpu.set_reg(R16.PC, n16_val);
  }
}

// (JR n16): Relative Jump to address n16.
export function JR_n16(cpu: Cpu) {
  const n16_val = cpu.bus.read(cpu.get_reg(R16.PC));
  const n16_val_signed = n16_val < 0x80 ? n16_val : n16_val - 0x100;

  cpu.inc_reg(R16.PC, n16_val_signed + 1);
}

// (JR cc,n16): Relative Jump to address n16 if condition cc is met.
export function JR_cc_n16(cpu: Cpu, condition: C) {
  const n16_val = cpu.bus.read(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC);

  if (cpu.check_condition(condition)) {
    const n16_val_signed = n16_val < 0x80 ? n16_val : n16_val - 0x100;
    cpu.inc_reg(R16.PC, n16_val_signed);
  }
}

// (RET cc): Return from subroutine if condition cc is met.
export function RET_cc(cpu: Cpu, condition: C) {
  if (cpu.check_condition(condition)) {
    cpu.set_reg(R16.PC, cpu.stack.pop16());
  }
}

// (RET): Return from subroutine. This is basically a POP PC (if such an instruction existed). See POP r16 for an explanation of how POP works.
export function RET(cpu: Cpu) {
  cpu.set_reg(R16.PC, cpu.stack.pop16());
}

// (RETI): Return from subroutine and enable interrupts. This is basically equivalent to executing EI then RET, meaning that IME is set right after this instruction.
export function RETI(cpu: Cpu) {
  cpu.ime = 1;
  cpu.set_reg(R16.PC, cpu.stack.pop16());
}

// (RST vec): Call address vec
export function RST_vec(cpu: Cpu, vec: Vec) {
  cpu.stack.push16(cpu.get_reg(R16.PC));
  cpu.set_reg(R16.PC, vec);
}

// (LD r8,r8): Copy the val in register on the right into the register on the left.
export function LD_r8_r8(cpu: Cpu, r8_1: R8, r8_2: R8) {
  cpu.set_reg(r8_1, cpu.get_reg(r8_2));
}

// (LD r8,n8): Copy the val n8 into register r8'.
export function LD_r8_n8(cpu: Cpu, r8: R8) {
  const n8_val = cpu.bus.read(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC);

  cpu.set_reg(r8, n8_val);
}

// (LD r16,n16): Copy the val n16 into register r16.
export function LD_r16_n16(cpu: Cpu, r16: R16) {
  const n16_val = cpu.bus.read16(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC, 2);

  cpu.set_reg(r16, n16_val);
}

// (LD [r16],A): Copy the val in register A into the byte pointed to by r16.
export function LD_r16_A(cpu: Cpu, r16: R16) {
  const r16_val = cpu.get_reg(r16);
  cpu.bus.write(r16_val, cpu.get_reg(R8.A));
}

// (LD [HL],r8): Copy the val in register r8 into the byte pointed to by HL.
export function LD_HL_r8(cpu: Cpu, r8: R8) {
  cpu.bus.write(cpu.get_reg(R16.HL), cpu.get_reg(r8));
}

// (LD [HL],n8): Copy the val n8 into the byte pointed to by HL.
export function LD_HL_n8(cpu: Cpu) {
  const n8_val = cpu.bus.read(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC);

  cpu.bus.write(cpu.get_reg(R16.HL), n8_val);
}

// (LD SP,n16): Copy the val n16 into register SP.
export function LD_SP_n16(cpu: Cpu) {
  const n16_val = cpu.bus.read16(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC, 2);

  cpu.set_reg(R16.SP, n16_val);
}

// (LD A,[r16]): Copy the byte pointed to by r16 into register A.
export function LD_A_r16(cpu: Cpu, r16: R16) {
  cpu.set_reg(R8.A, cpu.bus.read(cpu.get_reg(r16)));
}

// (LD r8,[HL]): Copy the val pointed to by HL into register r8.
export function LD_r8_HL(cpu: Cpu, r8: R8) {
  cpu.set_reg(r8, cpu.bus.read(cpu.get_reg(R16.HL)));
}

// (LD [HLI],A): Copy the val in register A into the byte pointed by HL and increment HL afterwards.
export function LD_HLI_A(cpu: Cpu) {
  cpu.bus.write(cpu.get_reg(R16.HL), cpu.get_reg(R8.A));
  cpu.inc_reg(R16.HL);
}

// (LD [HLD],A): Copy the val in register A into the byte pointed by HL and decrement HL afterwards.
export function LD_HLD_A(cpu: Cpu) {
  cpu.bus.write(cpu.get_reg(R16.HL), cpu.get_reg(R8.A));
  cpu.dec_reg(R16.HL);
}

// (LD A,[HLI]): Copy the byte pointed to by HL into register A, and increment HL afterwards.
export function LD_A_HLI(cpu: Cpu) {
  const n8_val = cpu.bus.read(cpu.get_reg(R16.HL));
  cpu.inc_reg(R16.HL);

  cpu.set_reg(R8.A, n8_val);
}

// (LD A,[HLD]): Copy the byte pointed to by HL into register A, and decrement HL afterwards.
export function LD_A_HLD(cpu: Cpu) {
  cpu.set_reg(R8.A, cpu.bus.read(cpu.get_reg(R16.HL)));
  cpu.dec_reg(R16.HL);
}

// (LD SP,HL): Copy register HL into register SP.
export function LD_SP_HL(cpu: Cpu) {
  cpu.set_reg(R16.SP, cpu.get_reg(R16.HL));
}

// (LD [n16],SP): Copy SP & $FF at address n16 and SP >> 8 at address n16 + 1.
export function LD_n16_SP(cpu: Cpu) {
  const n16_val = cpu.bus.read16(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC, 2);

  cpu.bus.write16(n16_val, cpu.SP);
}

// (LD [n16],A): Copy the val in register A into the byte at address n16.
export function LD_n16_A(cpu: Cpu) {
  const n16_val = cpu.bus.read16(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC, 2);

  cpu.bus.write16(n16_val, cpu.get_reg(R8.A));
}

// (LD A,[n16]): Copy the byte at address n16 into register A.
export function LD_A_n16(cpu: Cpu) {
  const n16_val = cpu.bus.read16(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC, 2);

  cpu.set_reg(R8.A, cpu.bus.read(n16_val));
}

// (LD HL,SP+e8): Add the signed val e8 to SP and copy the result in HL.
export function LD_HL_SP_E8(cpu: Cpu) {
  const r8_val = (cpu.bus.read(cpu.get_reg(R16.PC)) << 24) >> 24;
  cpu.inc_reg(R16.PC);

  const result = (cpu.SP + r8_val) & 0xffff;
  cpu.set_reg(R16.HL, result);

  cpu.set_flag(F.Z, false);
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, (cpu.SP & 0xf) + (r8_val & 0xf) > 0xf);
  cpu.set_flag(F.C, (cpu.SP & 0xff) + (r8_val & 0xff) > 0xff);
}

// (LDH [n16],A): Copy the val in register A into the byte at address n16, provided the address is between $FF00 and $FFFF.
export function LDH_n16_A(cpu: Cpu) {
  const n8_val = cpu.bus.read(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC);

  cpu.bus.write(0xff00 + n8_val, cpu.get_reg(R8.A));
}

// (LDH [C],A): Copy the value in register A into the byte at address $FF00+C.
export function LDH_C_A(cpu: Cpu) {
  const A_val = cpu.get_reg(R8.A);
  const C_val = cpu.get_reg(R8.C);

  cpu.bus.write(0xff00 + C_val, A_val);
}

// (LDH A,[n16]): Copy the byte at address n16 into register A, provided the address is between $FF00 and $FFFF.
export function LDH_A_n16(cpu: Cpu) {
  const n16_val = cpu.bus.read(cpu.get_reg(R16.PC));
  cpu.inc_reg(R16.PC, 1);

  cpu.set_reg(R8.A, cpu.bus.read(0xff00 + n16_val));
}

// (LDH A,[C]): Copy the byte at address $FF00+C into register A.
export function LDH_A_C(cpu: Cpu) {
  const C_val = cpu.get_reg(R8.C);
  cpu.set_reg(R8.A, cpu.bus.read(0xff00 + C_val));
}

// (DAA): Decimal Adjust Accumulator.
export function DAA(cpu: Cpu) {
  const N_val = cpu.get_flag(F.N);
  const H_val = cpu.get_flag(F.H);
  const C_val = cpu.get_flag(F.C);
  const A_val = cpu.get_reg(R8.A);

  let adjustment = 0;

  if (!N_val) {
    if (H_val || (A_val & 0xf) > 9) {
      adjustment += 0x6;
    }

    if (C_val || A_val > 0x99) {
      adjustment += 0x60;
      cpu.set_flag(F.C, true);
    }
  } else {
    if (H_val) {
      adjustment -= 0x6;
    }
    if (C_val) {
      adjustment -= 0x60;
    }
  }

  const result = (A_val + adjustment) & 0xff;
  cpu.set_reg(R8.A, result);

  cpu.set_flag(F.Z, result === 0);
  cpu.set_flag(F.H, false);
}

// (NOP): No OPeration.
export function NOP() {}

// (STOP): Enter CPU very low power mode.
export function STOP() {}

// (CCF): Complement Carry Flag.
export function CCF(cpu: Cpu) {
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, !cpu.get_flag(F.C));
}

// (SCF): Set Carry Flag.
export function SCF(cpu: Cpu) {
  cpu.set_flag(F.N, false);
  cpu.set_flag(F.H, false);
  cpu.set_flag(F.C, true);
}
