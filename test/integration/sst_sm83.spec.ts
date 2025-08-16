import { expect, test, describe } from "vitest";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import { DummyMemory } from "../DummyMemory";
import { Cpu } from "../../src/core/cpu/cpu";

export type Cycle = [address: number | null, data: number | null, flags: string];

export interface CPUState {
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
  ei: 0 | 1;
}

export interface SM83Case {
  name: string;
  initial: CPUState;
  final: CPUState;
  cycles: Cycle[];
}

describe("SM83 - SST", { concurrent: true }, async () => {
  const op_codes = await fs.readdir(path.join(__dirname, "sst_sm83", "v1"));

  for (const op_code of op_codes) {
    test(op_code, async () => {
      const file = await fs.readFile(path.join(__dirname, "sst_sm83", "v1", op_code), "utf-8");
      const sst_cases = JSON.parse(file) as SM83Case[];

      const cpu = new Cpu(new DummyMemory(99999) as any, 0, 0);

      for (const sst_case of process.env.CI ? sst_cases : sst_cases.slice(100, 101)) {
        cpu.PC = sst_case.initial.pc;
        cpu.SP = sst_case.initial.sp;
        cpu.A = sst_case.initial.a;
        cpu.F = sst_case.initial.f;
        cpu.B = sst_case.initial.b;
        cpu.C = sst_case.initial.c;
        cpu.D = sst_case.initial.d;
        cpu.E = sst_case.initial.e;
        cpu.H = sst_case.initial.h;
        cpu.L = sst_case.initial.l;
        cpu.ime = sst_case.initial.ime;
        cpu.ei = sst_case.initial.ei;

        for (const [addr, val] of sst_case.initial.ram) {
          cpu.bus.write(addr, val);
        }

        cpu.step();

        expect(cpu.PC).toBe(sst_case.final.pc);
        expect(cpu.SP).toBe(sst_case.final.sp);
        expect(cpu.A).toBe(sst_case.final.a);
        expect(cpu.F).toBe(sst_case.final.f);
        expect(cpu.B).toBe(sst_case.final.b);
        expect(cpu.C).toBe(sst_case.final.c);
        expect(cpu.D).toBe(sst_case.final.d);
        expect(cpu.E).toBe(sst_case.final.e);
        expect(cpu.H).toBe(sst_case.final.h);
        expect(cpu.L).toBe(sst_case.final.l);
        expect(cpu.ime).toBe(sst_case.final.ime);
        expect(cpu.ei).toBe(sst_case.final.ei);

        for (const [addr, val] of sst_case.final.ram) {
          expect(cpu.bus.read(addr)).toBe(val);
        }
      }
    });
  }
});
