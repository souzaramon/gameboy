import { Bus } from "../bus";
import * as proc from "./instruction-proc";
import { INSTRUCTION_SET, PINSTRUCTION_SET } from "./instruction-set";
import { Stack } from "./cpu.stack";
import { F, R8, R16, TCycles } from "./cpu.types";

export class CPU {
  constructor(
    public bus: Bus,
    public PC: number,
    public SP: number,
    public A: number,
    public F: number,
    public B: number,
    public C: number,
    public D: number,
    public E: number,
    public H: number,
    public L: number,
    public ime: 0 | 1,
    public stack = new Stack(this)
  ) {}

  step = (): TCycles => {
    let opcode = this.bus.read(this.PC);
    this.incReg(R16.PC);

    switch (opcode) {
      case 0xcb:
        opcode = this.bus.read(this.PC);
        this.incReg(R16.PC);

        return this.getProc(opcode, PINSTRUCTION_SET)(this) * 4;
      default:
        return this.getProc(opcode, INSTRUCTION_SET)(this) * 4;
    }
  };

  getProc(opcode: number, table: typeof PINSTRUCTION_SET | typeof INSTRUCTION_SET) {
    const entry = table[opcode];

    if (!entry) {
      throw new Error(`Entry not found: 0x${opcode.toString(16).padStart(2, "0")}`);
    }

    console.log(
      `%cPC_${String(this.PC).padStart(6, "0")} %c0x${opcode.toString(16).padStart(2, "0")}%c ${
        entry.name
      }, [${entry.operands.join(",")}]`,
      "color: lightgray",
      "color: yellow",
      "color: inherit"
    );

    return proc[entry.name].bind(this, this, ...entry.operands);
  }

  getFlag = (position: F) => {
    return (this.F & (1 << position)) !== 0;
  };

  setFlag = (position: F, val: boolean) => {
    if (val) {
      this.F |= 1 << position;
    } else {
      this.F &= ~(1 << position);
    }

    this.F &= 0xf0;
  };

  getReg = (name: R8 | R16) => {
    switch (name) {
      case R8.A:
      case R8.F:
      case R8.B:
      case R8.C:
      case R8.D:
      case R8.E:
      case R8.H:
      case R8.L:
      case R16.PC:
      case R16.SP:
        return this[name];
      case R16.AF:
      case R16.BC:
      case R16.DE:
      case R16.HL:
        const [n1, n2] = (name as unknown as string).split("");

        return ((this[n1] & 0xff) << 8) | (this[n2] & 0xff);
      default:
        return 0;
    }
  };

  setReg = (name: R8 | R16, val: number) => {
    switch (name) {
      case R8.A:
      case R8.F:
      case R8.B:
      case R8.C:
      case R8.D:
      case R8.E:
      case R8.H:
      case R8.L:
        this[name] = val & 0xff;
        return;
      case R16.SP:
        this.SP = val & 0xffff;
        return;
      case R16.PC:
        this.PC = val & 0xffff;
        return;
      case R16.AF:
      case R16.BC:
      case R16.DE:
      case R16.HL:
        const [n1, n2] = (name as unknown as string).split("");

        const hi = (val >> 8) & 0xff;
        const lo = val & 0xff;

        this[n1] = hi;
        this[n2] = lo;
        return;
      default:
        return;
    }
  };

  incReg = (name: R8 | R16, amount = 1) => {
    this.setReg(name, this.getReg(name) + amount);
  };

  decReg = (name: R8 | R16, amount = 1) => {
    this.setReg(name, this.getReg(name) - amount);
  };
}
