import {
  NEW_LICENSEE_CODES,
  OLD_LICENSEE_CODES,
  CARTRIDGE_TYPES,
  ROM_SIZES,
  RAM_SIZES,
  DESTINATION_CODES,
} from "./rom.types";

export class Rom {
  constructor(
    public checksum: number,
    public title: string,
    public logo: Uint8Array<ArrayBuffer>,
    public manufacturer_code: Uint8Array<ArrayBuffer>,
    public new_licensee_code: string,
    public old_licensee_code: string,
    public cgb_flag: number,
    public sgb_flag: number,
    public cartridge_type: string,
    public rom_size: { value: number; size: string; number_of_rom_banks: string },
    public ram_size: { code: number; sram_size: string; comment: string },
    public destination_code: string,
    public mask_rom_version_number: number,
    public global_checksum: Uint8Array<ArrayBuffer>,
    public data: Uint8Array<ArrayBuffer>
  ) {}

  static async load(url: string) {
    return new Uint8Array(await (await fetch(url)).arrayBuffer());
  }

  static parse(file: Uint8Array<ArrayBuffer>) {
    const td = new TextDecoder();

    const checksum = file[0x014d];
    let checksum_acc = 0;
    for (let address = 0x0134; address <= 0x014c; address++) {
      checksum_acc = checksum_acc - file[address] - 1;
    }
    if ((checksum & 0xff) !== (checksum_acc & 0xff)) {
      throw new Error(`Checksum missmatch, expected ${checksum} got ${checksum_acc}`);
    }

    return new Rom(
      checksum,
      td.decode(file.slice(0x0134, 0x0143)).replace(/\0/g, ""),
      file.slice(0x0104, 0x0133),
      file.slice(0x013f, 0x0142),
      NEW_LICENSEE_CODES[String(file[0x0144]) + String(file[0x0145])],
      OLD_LICENSEE_CODES[file[0x014b]],
      file[0x0143],
      file[0x0146],
      CARTRIDGE_TYPES[file[0x0147]],
      ROM_SIZES[file[0x0148]],
      RAM_SIZES[file[0x0149]],
      DESTINATION_CODES[file[0x014a]],
      file[0x014c],
      file.slice(0x014e, 0x014f),
      file
    );
  }

  read(addr: number): number {
    return this.data[addr];
  }

  write(addr: number, value: number): void {}
}
