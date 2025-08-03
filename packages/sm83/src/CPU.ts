import * as instr from "./instr";
import { MCycles, TCycles, MemoryLike, R8, R16, F } from "./CPU.types";

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
    public L: number
  ) {}

  step = (): TCycles => {
    this.currentOpcode = this.memory.read8(this.PC);
    this.setR(R16.PC, this.getR(R16.PC) + 1);

    switch (this.currentOpcode) {
      case 0xcb:
        this.currentOpcode = this.memory.read8(this.PC);
        this.setR(R16.PC, this.getR(R16.PC) + 1);

        return this.execPInstruction(this.currentOpcode) * 4;
      default:
        return this.execInstruction(this.currentOpcode) * 4;
    }
  };

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
        return instr.NOP();
      case 0x01:
        return instr.LD_r16_n16(this, R16.BC);
      case 0x02:
        return instr.LD_r16_A(this, R16.BC);
      case 0x06:
        return instr.LD_r8_n8(this, R8.B);
      case 0x08:
        return instr.LD_n16_SP(this);
      case 0x0a:
        return instr.LD_A_r16(this, R16.BC);
      case 0x0e:
        return instr.LD_r8_n8(this, R8.C);
      case 0x11:
        return instr.LD_r16_n16(this, R16.DE);
      case 0x12:
        return instr.LD_r16_A(this, R16.DE);
      case 0x16:
        return instr.LD_r8_n8(this, R8.D);
      case 0x1a:
        return instr.LD_A_r16(this, R16.DE);
      case 0x1e:
        return instr.LD_r8_n8(this, R8.E);
      case 0x21:
        return instr.LD_r16_n16(this, R16.HL);
      case 0x22:
        return instr.LD_HLI_A(this);
      case 0x26:
        return instr.LD_r8_n8(this, R8.H);
      case 0x2a:
        return instr.LD_A_HLI(this);
      case 0x2e:
        return instr.LD_r8_n8(this, R8.L);
      case 0x31:
        return instr.LD_SP_n16(this);
      case 0x32:
        return instr.LD_HLD_A(this);
      case 0x36:
        return instr.LD_HL_n8(this);
      case 0x3a:
        return instr.LD_A_HLD(this);
      case 0x3e:
        return instr.LD_r8_n8(this, R8.A);
      case 0x41:
        return instr.LD_r8_r8(this, R8.B, R8.C);
      case 0x42:
        return instr.LD_r8_r8(this, R8.B, R8.D);
      case 0x43:
        return instr.LD_r8_r8(this, R8.B, R8.E);
      case 0x44:
        return instr.LD_r8_r8(this, R8.B, R8.H);
      case 0x45:
        return instr.LD_r8_r8(this, R8.B, R8.L);
      case 0x46:
        return instr.LD_r8_HL(this, R8.B);
      case 0x47:
        return instr.LD_r8_r8(this, R8.B, R8.A);
      case 0x48:
        return instr.LD_r8_r8(this, R8.C, R8.B);
      case 0x4a:
        return instr.LD_r8_r8(this, R8.C, R8.D);
      case 0x4b:
        return instr.LD_r8_r8(this, R8.C, R8.E);
      case 0x4c:
        return instr.LD_r8_r8(this, R8.C, R8.H);
      case 0x4d:
        return instr.LD_r8_r8(this, R8.C, R8.L);
      case 0x4e:
        return instr.LD_r8_HL(this, R8.C);
      case 0x4f:
        return instr.LD_r8_r8(this, R8.C, R8.A);
      case 0x50:
        return instr.LD_r8_r8(this, R8.D, R8.B);
      case 0x51:
        return instr.LD_r8_r8(this, R8.D, R8.C);
      case 0x53:
        return instr.LD_r8_r8(this, R8.D, R8.E);
      case 0x54:
        return instr.LD_r8_r8(this, R8.D, R8.H);
      case 0x55:
        return instr.LD_r8_r8(this, R8.D, R8.L);
      case 0x56:
        return instr.LD_r8_HL(this, R8.D);
      case 0x57:
        return instr.LD_r8_r8(this, R8.D, R8.A);
      case 0x58:
        return instr.LD_r8_r8(this, R8.E, R8.B);
      case 0x59:
        return instr.LD_r8_r8(this, R8.E, R8.C);
      case 0x5a:
        return instr.LD_r8_r8(this, R8.E, R8.D);
      case 0x5c:
        return instr.LD_r8_r8(this, R8.E, R8.H);
      case 0x5d:
        return instr.LD_r8_r8(this, R8.E, R8.L);
      case 0x5e:
        return instr.LD_r8_HL(this, R8.E);
      case 0x5f:
        return instr.LD_r8_r8(this, R8.E, R8.A);
      case 0x60:
        return instr.LD_r8_r8(this, R8.H, R8.B);
      case 0x61:
        return instr.LD_r8_r8(this, R8.H, R8.C);
      case 0x62:
        return instr.LD_r8_r8(this, R8.H, R8.D);
      case 0x63:
        return instr.LD_r8_r8(this, R8.H, R8.E);
      case 0x65:
        return instr.LD_r8_r8(this, R8.H, R8.L);
      case 0x66:
        return instr.LD_r8_HL(this, R8.H);
      case 0x67:
        return instr.LD_r8_r8(this, R8.H, R8.A);
      case 0x68:
        return instr.LD_r8_r8(this, R8.L, R8.B);
      case 0x69:
        return instr.LD_r8_r8(this, R8.L, R8.C);
      case 0x6a:
        return instr.LD_r8_r8(this, R8.L, R8.D);
      case 0x6b:
        return instr.LD_r8_r8(this, R8.L, R8.E);
      case 0x6c:
        return instr.LD_r8_r8(this, R8.L, R8.H);
      case 0x6e:
        return instr.LD_r8_HL(this, R8.L);
      case 0x6f:
        return instr.LD_r8_r8(this, R8.L, R8.A);
      case 0x70:
        return instr.LD_HL_r8(this, R8.B);
      case 0x71:
        return instr.LD_HL_r8(this, R8.C);
      case 0x72:
        return instr.LD_HL_r8(this, R8.D);
      case 0x73:
        return instr.LD_HL_r8(this, R8.E);
      case 0x74:
        return instr.LD_HL_r8(this, R8.H);
      case 0x75:
        return instr.LD_HL_r8(this, R8.L);
      case 0x77:
        return instr.LD_HL_r8(this, R8.A);
      case 0x78:
        return instr.LD_r8_r8(this, R8.A, R8.B);
      case 0x79:
        return instr.LD_r8_r8(this, R8.A, R8.C);
      case 0x7a:
        return instr.LD_r8_r8(this, R8.A, R8.D);
      case 0x7b:
        return instr.LD_r8_r8(this, R8.A, R8.E);
      case 0x7c:
        return instr.LD_r8_r8(this, R8.A, R8.H);
      case 0x7d:
        return instr.LD_r8_r8(this, R8.A, R8.L);
      case 0x7e:
        return instr.LD_r8_HL(this, R8.A);
      case 0x80:
        return instr.ADD_A_r8(this, R8.B);
      case 0x81:
        return instr.ADD_A_r8(this, R8.C);
      case 0x82:
        return instr.ADD_A_r8(this, R8.D);
      case 0x83:
        return instr.ADD_A_r8(this, R8.E);
      case 0x84:
        return instr.ADD_A_r8(this, R8.H);
      case 0x85:
        return instr.ADD_A_r8(this, R8.L);
      case 0x86:
        return instr.ADD_A_HL(this);
      case 0x87:
        return instr.ADD_A_r8(this, R8.A);
      case 0x90:
        return instr.SUB_A_r8(this, R8.B);
      case 0x91:
        return instr.SUB_A_r8(this, R8.C);
      case 0x92:
        return instr.SUB_A_r8(this, R8.D);
      case 0x93:
        return instr.SUB_A_r8(this, R8.E);
      case 0x94:
        return instr.SUB_A_r8(this, R8.H);
      case 0x95:
        return instr.SUB_A_r8(this, R8.L);
      case 0x96:
        return instr.SUB_A_HL(this);
      case 0x97:
        return instr.SUB_A_r8(this, R8.A);
      case 0xa0:
        return instr.AND_A_r8(this, R8.B);
      case 0xa1:
        return instr.AND_A_r8(this, R8.C);
      case 0xa2:
        return instr.AND_A_r8(this, R8.D);
      case 0xa3:
        return instr.AND_A_r8(this, R8.E);
      case 0xa4:
        return instr.AND_A_r8(this, R8.H);
      case 0xa5:
        return instr.AND_A_r8(this, R8.L);
      case 0xa6:
        return instr.AND_A_HL(this);
      case 0xa7:
        return instr.AND_A_r8(this, R8.A);
      case 0xa8:
        return instr.XOR_A_r8(this, R8.B);
      case 0xa9:
        return instr.XOR_A_r8(this, R8.C);
      case 0xaa:
        return instr.XOR_A_r8(this, R8.D);
      case 0xab:
        return instr.XOR_A_r8(this, R8.E);
      case 0xac:
        return instr.XOR_A_r8(this, R8.H);
      case 0xad:
        return instr.XOR_A_r8(this, R8.L);
      case 0xae:
        return instr.XOR_A_HL(this);
      case 0xaf:
        return instr.XOR_A_r8(this, R8.A);
      case 0xb0:
        return instr.OR_A_r8(this, R8.B);
      case 0xb1:
        return instr.OR_A_r8(this, R8.C);
      case 0xb2:
        return instr.OR_A_r8(this, R8.D);
      case 0xb3:
        return instr.OR_A_r8(this, R8.E);
      case 0xb4:
        return instr.OR_A_r8(this, R8.H);
      case 0xb5:
        return instr.OR_A_r8(this, R8.L);
      case 0xb6:
        return instr.OR_A_HL(this);
      case 0xb7:
        return instr.OR_A_r8(this, R8.A);
      case 0xb8:
        return instr.CP_A_r8(this, R8.B);
      case 0xb9:
        return instr.CP_A_r8(this, R8.C);
      case 0xba:
        return instr.CP_A_r8(this, R8.D);
      case 0xbb:
        return instr.CP_A_r8(this, R8.E);
      case 0xbc:
        return instr.CP_A_r8(this, R8.H);
      case 0xbd:
        return instr.CP_A_r8(this, R8.L);
      case 0xbe:
        return instr.CP_A_HL(this);
      case 0xbf:
        return instr.CP_A_r8(this, R8.A);
      case 0xc6:
        return instr.ADD_A_n8(this);
      case 0xd6:
        return instr.SUB_A_n8(this);
      case 0xe6:
        return instr.AND_A_n8(this);
      case 0xea:
        return instr.LD_n16_A(this);
      case 0xee:
        return instr.XOR_A_n8(this);
      case 0xf6:
        return instr.OR_A_n8(this);
      case 0xf8:
        return instr.LD_HL_SP_E8(this);
      case 0xf9:
        return instr.LD_SP_HL(this);
      case 0xfa:
        return instr.LD_A_n16(this);
      case 0xfe:
        return instr.CP_A_n8(this);
      default:
        throw new Error("Unknown opcode");
    }
  };

  execPInstruction = (opcode: number): MCycles => {
    switch (opcode) {
      default:
        return 0;
    }
  };
}
