package sm83

type AddressingMode string

const (
	AM_IMP AddressingMode = "IMP"
	AM_A16 AddressingMode = "A16"
	AM_R   AddressingMode = "R"
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
