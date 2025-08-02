import { CPURegisters } from "./cpu_registers";

export type MCycles = number;

export type TCycles = number;

export interface MemoryLike {
  read8(address: number): number;
  write8(address: number, value: number): void;
  read16(address: number): number;
  write16(address: number, value: number): void;
}

export class CPU {
  private currentInstruction: number;

  constructor(public m: MemoryLike, public r: CPURegisters) {}

  execInstruction = (opcode: number): MCycles => {
    switch (opcode) {
      case 0x00:
      case 0x40:
      case 0x49:
      case 0x52:
      case 0x5b:
      case 0x64:
      case 0x6d:
      case 0x7f:
      default:
        return 0;
    }
  };

  execPInstruction = (opcode: number): MCycles => {
    switch (opcode) {
      default:
        return 0;
    }
  };

  step = (): TCycles => {
    this.currentInstruction = this.m.read8(this.r.PC);
    this.r.PC += 1;

    switch (this.currentInstruction) {
      default:
        const mCycles = this.execInstruction(this.currentInstruction);
        return mCycles * 4;
    }
  };
}
