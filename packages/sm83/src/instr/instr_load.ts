import { CPU, R8, R16, F, MCycles } from "../CPU";

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
