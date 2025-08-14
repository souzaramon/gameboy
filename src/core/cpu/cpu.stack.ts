import { Cpu } from "./cpu";
import { R16 } from "./cpu.types";

export class Stack {
  constructor(private cpu: Cpu) {}

  push(data: number) {
    this.cpu.decReg(R16.SP);
    this.cpu.bus.write(this.cpu.getReg(R16.SP), data);
  }

  pop() {
    const val = this.cpu.bus.read(this.cpu.getReg(R16.SP));
    this.cpu.incReg(R16.SP);

    return val;
  }

  push16(data: number) {
    const hi = (data >> 8) & 0xff;
    const lo = data & 0xff;

    this.cpu.stack.push(hi);
    this.cpu.stack.push(lo);
  }

  pop16() {
    const lo = this.pop();
    const hi = this.pop();

    return (hi << 8) | lo;
  }
}
