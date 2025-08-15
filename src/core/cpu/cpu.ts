import { Bus } from "../bus";
import * as proc from "./instruction-proc";
import { INSTRUCTION_SET, PINSTRUCTION_SET } from "./instruction-set";
import { Stack } from "./cpu.stack";
import { F, R8, R16, C } from "./cpu.types";

export class Cpu {
  public stack = new Stack(this);

  public ime: 0 | 1 = 0;
  public ei: 0 | 1 = 0;

  constructor(
    public bus: Bus,
    public PC: number,
    public SP: number,
    public A = 0,
    public F = 0,
    public B = 0,
    public C = 0,
    public D = 0,
    public E = 0,
    public H = 0,
    public L = 0
  ) {}

  step = () => {
    let opcode = this.bus.read(this.PC);
    this.inc_reg(R16.PC);

    switch (opcode) {
      case 0xcb:
        opcode = this.bus.read(this.PC);
        this.inc_reg(R16.PC);

        return this.get_proc(opcode, PINSTRUCTION_SET)(this);
      default:
        return this.get_proc(opcode, INSTRUCTION_SET)(this);
    }
  };

  get_proc = (opcode: number, table: typeof PINSTRUCTION_SET | typeof INSTRUCTION_SET) => {
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
  };

  get_flag = (position: F) => {
    return (this.F & (1 << position)) !== 0;
  };

  set_flag = (position: F, val: boolean) => {
    if (val) {
      this.F |= 1 << position;
    } else {
      this.F &= ~(1 << position);
    }

    this.F &= 0xf0;
  };

  get_reg = (name: R8 | R16) => {
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

  set_reg = (name: R8 | R16, val: number) => {
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

  inc_reg = (name: R8 | R16, amount = 1) => {
    this.set_reg(name, this.get_reg(name) + amount);
  };

  dec_reg = (name: R8 | R16, amount = 1) => {
    this.set_reg(name, this.get_reg(name) - amount);
  };

  check_condition = (condition: C) => {
    const c = this.get_flag(F.C);
    const z = this.get_flag(F.Z);

    switch (condition) {
      case C.C:
        return c;
      case C.Z:
        return z;
      case C.NC:
        return !c;
      case C.NZ:
        return !z;
      default:
        return false;
    }
  };
}
