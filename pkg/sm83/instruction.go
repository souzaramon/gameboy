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

type Instruction struct {
	AM AddressingMode
	IK InstructionKind
	R1 RegisterKind
	R2 RegisterKind
}
