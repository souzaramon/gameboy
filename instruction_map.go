package sm83

var InstructionMap = map[byte]Instruction{
	0x00: {IK: IK_NOP, AM: AM_IMP},
	0x01: {IK: IK_LD, AM: AM_R_D16, R1: RK_BC},
	0xC2: {IK: IK_JP, AM: AM_D16, CK: CK_NZ},
	0xC3: {IK: IK_JP, AM: AM_D16, CK: CK_NONE},
	0xCA: {IK: IK_JP, AM: AM_D16, CK: CK_Z},
	0xD2: {IK: IK_JP, AM: AM_D16, CK: CK_NC},
	0xDA: {IK: IK_JP, AM: AM_D16, CK: CK_C},
	0xE9: {IK: IK_JP, AM: AM_R, R1: RK_HL, CK: CK_NONE},
}
