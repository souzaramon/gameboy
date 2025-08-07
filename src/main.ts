import { Bus } from "./core/bus";
import { CPU } from "./core/cpu";
import { ROM } from "./core/rom";

(async () => {
  const rom_file = await ROM.load("/cpu_instrs.gb");
  const rom = ROM.parse(rom_file);

  const bus = new Bus(rom);
  const cpu = new CPU(bus, 0x100, 0, 0x01, 0, 0, 0, 0, 0, 0, 0, 0);

  while (true) {
    cpu.step();
  }
})();
