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
	IK_NOP = "NOP"
)

type ConditionKind string

const (
	CK_NONE ConditionKind = "NONE"
	CK_NZ                 = "NZ"
	CK_Z                  = "Z"
	CK_NC                 = "NC"
	CK_C                  = "C"
)

type Instruction struct {
	AM AddressingMode
	IK InstructionKind
	R1 RegisterKind
	R2 RegisterKind
	CK ConditionKind
}
