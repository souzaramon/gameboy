package sm83

var InstructionMap = map[byte]Instruction{
	0x00: {IK: IK_NOP, AM: AM_IMP},
	0xC2: {IK: IK_JP, AM: AM_A16, CK: CK_NZ},
	0xC3: {IK: IK_JP, AM: AM_A16, CK: CK_NONE},
	0xCA: {IK: IK_JP, AM: AM_A16, CK: CK_Z},
	0xD2: {IK: IK_JP, AM: AM_A16, CK: CK_NC},
	0xDA: {IK: IK_JP, AM: AM_A16, CK: CK_C},
	0xE9: {IK: IK_JP, AM: AM_R, R1: RK_HL},
}
