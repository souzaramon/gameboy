import { CPU } from "../CPU";
import { R16 } from "../CPU.types";

// (CALL n16):    TODO

// (CALL cc,n16): TODO

// (JP HL): Jump to address in HL; effectively, copy the value in register HL into PC.
export function JP_HL(cpu: CPU) {
  cpu.setR(R16.PC, cpu.getR(R16.HL));

  return 0;
}

// (JP n16):      TODO

// (JP cc,n16):   TODO

// (JR n16):      TODO

// (JR cc,n16):   TODO

// (RET cc):      TODO

// (RET):         TODO

// (RETI):        TODO

// (RST vec):     TODO
