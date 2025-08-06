import { MCycles, TCycles, MemoryLike, R8, R16, F } from "./cpu.types";
import { INSTRUCTION_SET, PINSTRUCTION_SET } from "./instruction-set";

export class CPU {
  private currentOpcode: number;

  constructor(
    public memory: MemoryLike,
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
    public ime: 0 | 1
  ) {}

  step = (): TCycles => {
    this.currentOpcode = this.memory.read8(this.PC);
    this.setR(R16.PC, this.getR(R16.PC) + 1);

    switch (this.currentOpcode) {
      case 0xcb:
        this.currentOpcode = this.memory.read8(this.PC);
        this.setR(R16.PC, this.getR(R16.PC) + 1);

        return this.getProc(this.currentOpcode, PINSTRUCTION_SET)(this) * 4;
      default:
        return this.getProc(this.currentOpcode, INSTRUCTION_SET)(this) * 4;
    }
  };

  getProc(opcode: number, table: Record<number, (cpu: CPU) => MCycles>) {
    const proc = table[opcode];

    if (!proc) {
      throw new Error("Unknown opcode " + opcode);
    }

    return proc;
  }

  getF = (position: F) => {
    return (this.F & (1 << position)) !== 0;
  };

  setF = (position: F, val: boolean) => {
    if (val) {
      this.F |= 1 << position;
    } else {
      this.F &= ~(1 << position);
    }

    this.F &= 0xf0;
  };

  getR = (name: R8 | R16) => {
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

  setR = (name: R8 | R16, val: number) => {
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
        return 0;
    }
  };
}
