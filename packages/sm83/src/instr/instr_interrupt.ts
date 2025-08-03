import { CPU } from "../CPU";

// (DI): Disable Interrupts by clearing the IME flag.
export function DI(cpu: CPU) {
  cpu.ime = 0;

  return 0;
}

// (EI):   TODO

// (HALT): TODO
