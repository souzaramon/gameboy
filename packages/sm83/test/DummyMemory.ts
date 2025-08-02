import { MemoryLike } from "../src/cpu";

export class DummyMemory implements MemoryLike {
  public data: Uint8Array;

  constructor(size: number) {
    this.data = new Uint8Array(size);
  }

  read8(addr: number): number {
    return this.data[addr];
  }

  write8(addr: number, value: number): void {
    this.data[addr] = value & 0xff;
  }

  read16(addr: number): number {
    const lo = this.data[addr];
    const hi = this.data[addr + 1];

    return lo | (hi << 8);
  }

  write16(addr: number, value: number): void {
    const lo = value & 0xff;
    const hi = (value >> 8) & 0xff;

    this.write8(addr, lo);
    this.write8(addr + 1, hi);
  }
}
