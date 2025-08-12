import { NewLicenseeCodes, OldLicenseeCodes, CartridgeTypes, ROMSizes, RAMSizes, DestinationCodes } from "./rom.types";

export class ROM {
  constructor(
    public checksum: number,
    public title: string,
    public logo: Uint8Array<ArrayBuffer>,
    public manufacturerCode: Uint8Array<ArrayBuffer>,
    public newLicenseeCode: string,
    public oldLicenseeCode: string,
    public CGBFlag: number,
    public SGBFlag: number,
    public cartridgeType: string,
    public ROMSize: { value: number; size: string; numberOfROMBanks: string },
    public RAMSize: { code: number; SRAMSize: string; comment: string },
    public destinationCode: string,
    public maskROMVersionNumber: number,
    public globalChecksum: Uint8Array<ArrayBuffer>,
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

    return new ROM(
      checksum,
      td.decode(file.slice(0x0134, 0x0143)).replace(/\0/g, ""),
      file.slice(0x0104, 0x0133),
      file.slice(0x013f, 0x0142),
      NewLicenseeCodes[String(file[0x0144]) + String(file[0x0145])],
      OldLicenseeCodes[file[0x014b]],
      file[0x0143],
      file[0x0146],
      CartridgeTypes[file[0x0147]],
      ROMSizes[file[0x0148]],
      RAMSizes[file[0x0149]],
      DestinationCodes[file[0x014a]],
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
