import { Bus } from "./core/bus";
import { Cpu } from "./core/cpu/cpu";
import { Rom } from "./core/rom";

(async () => {
  const rom = Rom.parse(await Rom.load("/tetris.gb"));
  const bus = new Bus(rom);
  const cpu = new Cpu(bus, 0x100, 0, 0x01);

  setInterval(() => {
    cpu.step();
  }, 100);
})();
