package sm83

type AddressingMode string

const (
	AM_IMP AddressingMode = "IMP"
)

type RegisterKind string

const (
	RK_NONE RegisterKind = "NONE"
)

type InstructionKind string

const (
	IK_NOP InstructionKind = "NOP"
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
