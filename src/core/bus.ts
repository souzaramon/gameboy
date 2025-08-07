/**
 * NOTE: Read/Write Ranges
 *  0x0000 - 0x3FFF: ROM Bank 0
 *  0x4000 - 0x7FFF: ROM Bank 1 - Switchable
 *  0x8000 - 0x97FF: CHR RAM
 *  0x9800 - 0x9BFF: BG Map 1
 *  0x9C00 - 0x9FFF: BG Map 2
 *  0xA000 - 0xBFFF: Cartridge RAM
 *  0xC000 - 0xCFFF: RAM Bank 0
 *  0xD000 - 0xDFFF: RAM Bank 1-7 - switchable - Color only
 *  0xE000 - 0xFDFF: Reserved - Echo RAM
 *  0xFE00 - 0xFE9F: Object Attribute Memory
 *  0xFEA0 - 0xFEFF: Reserved - Unusable
 *  0xFF00 - 0xFF7F: I/O Registers
 *  0xFF80 - 0xFFFE: Zero Page
 */

import { ROM } from "./rom";

export class Bus {
  constructor(private rom: ROM) {}

  read(addr: number): number {
    if (addr < 0x8000) {
      return this.rom.read(addr);
    }

    console.warn(`[Bus] Out of bounds read ${addr}`);
    return 0;
  }

  write(addr: number, value: number): void {
    if (addr < 0x8000) {
      this.rom.write(addr, value);
    }

    console.warn(`[Bus] Out of bounds write ${addr}, ${value}`);
  }

  read16(addr: number): number {
    const lo = this.read(addr);
    const hi = this.read(addr + 1);

    return lo | (hi << 8);
  }

  write16(addr: number, value: number): void {
    const lo = value & 0xff;
    const hi = (value >> 8) & 0xff;

    this.write(addr, lo);
    this.write(addr + 1, hi);
  }
}
