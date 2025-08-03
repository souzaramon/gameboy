import { expect, test, describe } from "vitest";
import * as path from "node:path";
import * as fs from "node:fs";
import { DummyMemory } from "../DummyMemory";
import { CPU } from "../../src/CPU";

interface CPUState {
  name: string;
  pc: number;
  sp: number;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  h: number;
  l: number;
  ram: number[][];
  ime: number;
  ie: number;
}

interface SM83Case {
  name: string;
  initial: CPUState;
  final: CPUState;
}

describe("SM83 - SST", () => {
  const opCodes = [
    "00", "01", "02", "06", "08", "0a", "0e",
    "11", "12", "16", "1a", "1e",
    "21", "22", "26", "2a", "2e",
    "31", "32", "36", "3a", "3e",
    "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f",
    "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5c", "5b", "5d", "5e", "5f",
    "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f",
    "70", "71", "72", "73", "74", "75", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f",
    "80", "81", "82", "83", "84", "85", "86", "87",
    "90", "91", "92", "93", "94", "95", "96", "97",
    "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af",
    "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "be", "b8", "b9", "ba", "bb", "bc", "bd", "bf",
    "c6",
    "d6",
    "ea", "e6", "ee",
    "f6", "f8", "f9", "fa", "fe",
  ];

  const cpu = new CPU(new DummyMemory(99999), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  
  for (const opCode of opCodes) {
    const fileName = path.join(__dirname, "sst_sm83", "v1", `${opCode}.json`);
    const file = fs.readFileSync(fileName, "utf-8");
    const sstCases = JSON.parse(file) as SM83Case[];

    for (const sstCase of sstCases) {
      test(sstCase.name, () => {
        cpu.PC = sstCase.initial.pc,
        cpu.SP = sstCase.initial.sp,
        cpu.A = sstCase.initial.a,
        cpu.F = sstCase.initial.f,
        cpu.B = sstCase.initial.b,
        cpu.C = sstCase.initial.c,
        cpu.D = sstCase.initial.d,
        cpu.E = sstCase.initial.e,
        cpu.H = sstCase.initial.h,
        cpu.L = sstCase.initial.l

        for (const [addr, val] of sstCase.initial.ram) {
          cpu.memory.write8(addr, val);
        }

        cpu.step();

        expect(cpu.PC).toBe(sstCase.final.pc);
        expect(cpu.SP).toBe(sstCase.final.sp);
        expect(cpu.A).toBe(sstCase.final.a);
        expect(cpu.F).toBe(sstCase.final.f);
        expect(cpu.B).toBe(sstCase.final.b);
        expect(cpu.C).toBe(sstCase.final.c);
        expect(cpu.D).toBe(sstCase.final.d);
        expect(cpu.E).toBe(sstCase.final.e);
        expect(cpu.H).toBe(sstCase.final.h);
        expect(cpu.L).toBe(sstCase.final.l);

        for (const [addr, val] of sstCase.final.ram) {
          expect(cpu.memory.read8(addr)).toBe(val);
        }
      });
    }
  }
});
