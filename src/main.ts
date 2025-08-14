import { Bus } from "./core/bus";
import { Cpu } from "./core/cpu/cpu";
import { Rom } from "./core/rom";

(async () => {
  const rom = Rom.parse(await Rom.load("/cpu_instrs.gb"));
  const bus = new Bus(rom);
  const cpu = new Cpu(bus, 0x100, 0, 0x01);

  while (true) {
    cpu.step();
  }
})();
