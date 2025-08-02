import { expect, test, describe } from "vitest";
import * as path from "node:path";
import * as fs from "node:fs";
import { DummyMemory } from "../DummyMemory";
import { CPU } from "../../src/cpu";
import { CPURegisters } from "../../src/cpu_registers";

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
  const opCodes = ["00"];

  for (const opCode of opCodes) {
    const file = fs.readFileSync(path.join(__dirname, "sst_sm83", "v1", `${opCode}.json`), "utf-8");
    const sstCases = JSON.parse(file) as SM83Case[];

    for (const sstCase of sstCases) {
      test(sstCase.name, () => {
        const memory = new DummyMemory(65536);
        for (const [addr, val] of sstCase.initial.ram) {
          memory.write8(addr, val);
        }

        const cpu = new CPU(
          memory,
          new CPURegisters(
            sstCase.initial.pc,
            sstCase.initial.sp,
            sstCase.initial.a,
            sstCase.initial.f,
            sstCase.initial.b,
            sstCase.initial.c,
            sstCase.initial.d,
            sstCase.initial.e,
            sstCase.initial.h,
            sstCase.initial.l
          )
        );

        cpu.step();

        expect(cpu.r.PC).toBe(sstCase.final.pc);
        expect(cpu.r.SP).toBe(sstCase.final.sp);
        expect(cpu.r.A).toBe(sstCase.final.a);
        expect(cpu.r.F).toBe(sstCase.final.f);
        expect(cpu.r.B).toBe(sstCase.final.b);
        expect(cpu.r.C).toBe(sstCase.final.c);
        expect(cpu.r.D).toBe(sstCase.final.d);
        expect(cpu.r.E).toBe(sstCase.final.e);
        expect(cpu.r.H).toBe(sstCase.final.h);
        expect(cpu.r.L).toBe(sstCase.final.l);

        for (const [addr, val] of sstCase.final.ram) {
          expect(memory.read8(addr)).toBe(val);
        }
      });
    }
  }
});
