import { expect, test, describe } from "vitest";
import * as path from "node:path";
import * as fs from "node:fs";
import { DummyMemory } from "../DummyMemory";
import { CPU } from "../../src/core/cpu";
import { INSTRUCTION_SET, PINSTRUCTION_SET } from "../../src/core/instruction-set";

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
  ime: 0 | 1;
  ie: number;
}

interface SM83Case {
  name: string;
  initial: CPUState;
  final: CPUState;
}

describe("SM83 - SST", () => {
  const opCodes = [
    ...Object.keys(INSTRUCTION_SET).map((i) => Number(i).toString(16).padStart(2, "0")),
    ...Object.keys(PINSTRUCTION_SET).map((i) => "cb " + Number(i).toString(16).padStart(2, "0")),
  ];

  const cpu = new CPU(new DummyMemory(99999) as any, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

  for (const opCode of opCodes) {
    const fileName = path.join(__dirname, "sst_sm83", "v1", `${opCode}.json`);
    const file = fs.readFileSync(fileName, "utf-8");
    const sstCases = JSON.parse(file) as SM83Case[];

    for (const sstCase of process.env.CI ? sstCases : sstCases.slice(100, 101)) {
      test(sstCase.name, () => {
        cpu.PC = sstCase.initial.pc;
        cpu.SP = sstCase.initial.sp;
        cpu.A = sstCase.initial.a;
        cpu.F = sstCase.initial.f;
        cpu.B = sstCase.initial.b;
        cpu.C = sstCase.initial.c;
        cpu.D = sstCase.initial.d;
        cpu.E = sstCase.initial.e;
        cpu.H = sstCase.initial.h;
        cpu.L = sstCase.initial.l;
        cpu.ime = sstCase.initial.ime;

        for (const [addr, val] of sstCase.initial.ram) {
          cpu.bus.write(addr, val);
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
        expect(cpu.ime).toBe(sstCase.final.ime);

        for (const [addr, val] of sstCase.final.ram) {
          expect(cpu.bus.read(addr)).toBe(val);
        }
      });
    }
  }
});
