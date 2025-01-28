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
	RK_HL   RegisterKind = "HL"
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
