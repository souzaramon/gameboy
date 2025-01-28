package sm83

type AddressingMode string

// NOTE: A (Address), D (Data), R (Register), MR (Memory Region), HLI (HL Increment), HLD (HL Decrement)
const (
	AM_IMP    AddressingMode = "IMP"
	AM_R      AddressingMode = "R"
	AM_R_D8   AddressingMode = "R_D8"
	AM_R_D16  AddressingMode = "R_D16"
	AM_R_A8   AddressingMode = "R_A8"
	AM_R_A16  AddressingMode = "R_A16"
	AM_R_MR   AddressingMode = "R_MR"
	AM_R_R    AddressingMode = "R_R"
	AM_R_HLI  AddressingMode = "R_HLI"
	AM_R_HLD  AddressingMode = "R_HLD"
	AM_MR     AddressingMode = "MR"
	AM_MR_R   AddressingMode = "MR_R"
	AM_MR_D8  AddressingMode = "MR_D8"
	AM_D16    AddressingMode = "D16"
	AM_D8     AddressingMode = "D8"
	AM_D16_R  AddressingMode = "D16_R"
	AM_HL_SPR AddressingMode = "HL_SPR"
	AM_HLI_R  AddressingMode = "HLI_R"
	AM_HLD_R  AddressingMode = "HLD_R"
	AM_A8_R   AddressingMode = "A8_R"
	AM_A16_R  AddressingMode = "A16_R"
)

type RegisterKind string

const (
	RK_NONE RegisterKind = "NONE"
	RK_A    RegisterKind = "RK_A"
	RK_F    RegisterKind = "RK_F"
	RK_B    RegisterKind = "RK_B"
	RK_C    RegisterKind = "RK_C"
	RK_D    RegisterKind = "RK_D"
	RK_E    RegisterKind = "RK_E"
	RK_H    RegisterKind = "RK_H"
	RK_L    RegisterKind = "RK_L"
	RK_AF   RegisterKind = "RK_AF"
	RK_BC   RegisterKind = "RK_BC"
	RK_DE   RegisterKind = "RK_DE"
	RK_HL   RegisterKind = "RK_HL"
	RK_SP   RegisterKind = "RK_SP"
	RK_PC   RegisterKind = "RK_PC"
)

type InstructionKind string

const (
	IK_NOP InstructionKind = "NOP"
	IK_JP  InstructionKind = "JP"
)

type ConditionKind string

const (
	CK_NONE ConditionKind = "NONE"
	CK_NZ   ConditionKind = "NZ"
	CK_Z    ConditionKind = "Z"
	CK_NC   ConditionKind = "NC"
	CK_C    ConditionKind = "C"
)

type Instruction struct {
	AM AddressingMode
	IK InstructionKind
	R1 RegisterKind
	R2 RegisterKind
	CK ConditionKind
}
