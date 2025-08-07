import { ROM } from "./core/rom";

(async () => {
  const rom_file = await ROM.load("/cpu_instrs.gb");
  const rom = ROM.parse(rom_file);

  console.log(rom);
})();
