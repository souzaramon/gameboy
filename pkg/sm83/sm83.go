package sm83

import (
	"fmt"
	"os"
)

type Registers struct {
	A  byte
	F  byte
	B  byte
	C  byte
	D  byte
	E  byte
	H  byte
	L  byte
	PC uint16
	SP uint16
}

type SM83 struct {
	Cycles int

	CurrentOpcode      byte
	CurrentInstruction Instruction

	Data         uint16
	DestData     uint16
	DestIsMemory bool

	Registers Registers

	Memory interface {
		Read8(address uint16) byte
		Write8(address uint16, value byte)
		Read16(address uint16) uint16
		Write16(address uint16, value uint16)
	}
}

func (sm83 *SM83) Print(message string, a ...any) {
	fmt.Printf("[PC 0x%04X] ", sm83.Registers.PC)
	fmt.Printf(message, a...)
	fmt.Printf("\n")
}

func (sm83 *SM83) PrintAndDie(message string, a ...any) {
	sm83.Print(message, a...)
	os.Exit(1)
}

func (sm83 *SM83) ReadRegister(rk RegisterKind) uint16 {
	switch rk {
	case RK_A:
		return uint16(sm83.Registers.A)
	case RK_F:
		return uint16(sm83.Registers.F)
	case RK_B:
		return uint16(sm83.Registers.B)
	case RK_C:
		return uint16(sm83.Registers.C)
	case RK_D:
		return uint16(sm83.Registers.D)
	case RK_E:
		return uint16(sm83.Registers.E)
	case RK_H:
		return uint16(sm83.Registers.H)
	case RK_L:
		return uint16(sm83.Registers.L)
	case RK_SP:
		return sm83.Registers.SP
	case RK_PC:
		return sm83.Registers.PC
	case RK_AF:
		return (uint16(sm83.Registers.A) << 8) | uint16(sm83.Registers.F)
	case RK_BC:
		return (uint16(sm83.Registers.B) << 8) | uint16(sm83.Registers.C)
	case RK_DE:
		return (uint16(sm83.Registers.D) << 8) | uint16(sm83.Registers.E)
	case RK_HL:
		return (uint16(sm83.Registers.H) << 8) | uint16(sm83.Registers.L)
	default:
		sm83.PrintAndDie("Unknown register (%s)", rk)
		return 0
	}
}

func (sm83 *SM83) SetRegister(rk RegisterKind, value uint16) {
	switch rk {
	case RK_A:
		sm83.Registers.A = uint8(value & 0xFF)
		return
	case RK_F:
		sm83.Registers.F = uint8(value & 0xFF)
		return
	case RK_B:
		sm83.Registers.B = uint8(value & 0xFF)
		return
	case RK_C:
		sm83.Registers.C = uint8(value & 0xFF)
		return
	case RK_D:
		sm83.Registers.D = uint8(value & 0xFF)
		return
	case RK_E:
		sm83.Registers.E = uint8(value & 0xFF)
		return
	case RK_H:
		sm83.Registers.H = uint8(value & 0xFF)
		return
	case RK_L:
		sm83.Registers.L = uint8(value & 0xFF)
		return
	case RK_SP:
		sm83.Registers.SP = value
		return
	case RK_PC:
		sm83.Registers.PC = value
		return
	case RK_AF:
		sm83.Registers.A = uint8(value)
		sm83.Registers.F = uint8(value >> 8)
		return
	case RK_BC:
		sm83.Registers.B = uint8(value)
		sm83.Registers.C = uint8(value >> 8)
		return
	case RK_DE:
		sm83.Registers.D = uint8(value)
		sm83.Registers.E = uint8(value >> 8)
		return
	case RK_HL:
		sm83.Registers.H = uint8(value)
		sm83.Registers.L = uint8(value >> 8)
		return
	default:
		sm83.PrintAndDie("Unknown register (%s)", rk)
		return
	}
}

// bits: {z, n, h, c}
func (sm83 *SM83) WriteFlags(bits [4]int) {
	for i := 3; i >= 0; i-- {
		bit := bits[i]

		if bit != -1 {
			sm83.Registers.F = SetNthBit(sm83.Registers.F, 7-i, bit > 0)
		}

	}
}

func (sm83 *SM83) CheckCondition() bool {
	flag_z := GetNthBit(sm83.Registers.F, 7)
	flag_c := GetNthBit(sm83.Registers.F, 4)

	switch sm83.CurrentInstruction.CK {
	case CK_NONE:
		return true
	case CK_C:
		return flag_c
	case CK_NC:
		return !flag_c
	case CK_Z:
		return flag_z
	case CK_NZ:
		return !flag_z
	default:
		return false
	}
}

func (sm83 *SM83) FetchInstruction() {
	currentOpcode := sm83.Memory.Read8(sm83.Registers.PC)
	currentInstruction, exists := InstructionMap[currentOpcode]

	if !exists {
		sm83.PrintAndDie("unknown instruction (0x%02X)", currentOpcode)
	} else {
		sm83.Print(
			"opcode (0x%02X), kind (%s), am (%s)",
			currentOpcode,
			currentInstruction.IK,
			currentInstruction.AM,
		)
	}

	sm83.CurrentOpcode = currentOpcode
	sm83.CurrentInstruction = currentInstruction
}

func (sm83 *SM83) FetchData() {
	switch sm83.CurrentInstruction.AM {
	case AM_IMP:
		return
	case AM_R:
		sm83.Data = sm83.ReadRegister(sm83.CurrentInstruction.R1)
		return
	case AM_R_R:
		sm83.Data = sm83.ReadRegister(sm83.CurrentInstruction.R2)
		return
	case AM_R_D8:
		sm83.Data = uint16(sm83.Memory.Read8(sm83.Registers.PC))
		sm83.Cycles += 4
		sm83.Registers.PC += 1
		return
	case AM_R_D16, AM_D16:
		lo := uint16(sm83.Memory.Read8(sm83.Registers.PC))
		hi := uint16(sm83.Memory.Read8(sm83.Registers.PC + 1))

		sm83.Data = lo | (hi << 8)
		sm83.Registers.PC += 2
		sm83.Cycles += 8
		return
	case AM_MR_R:
		sm83.Data = sm83.ReadRegister(sm83.CurrentInstruction.R2)
		sm83.DestData = sm83.ReadRegister(sm83.CurrentInstruction.R1)
		sm83.DestIsMemory = true

		if sm83.CurrentInstruction.R1 == RK_C {
			sm83.DestData |= 0xFF00
		}
		return
	case AM_R_MR:
		address := sm83.ReadRegister(sm83.CurrentInstruction.R2)

		if sm83.CurrentInstruction.R1 == RK_C {
			address |= 0xFF00
		}

		sm83.Data = uint16(sm83.Memory.Read8(address))
		sm83.Cycles += 4
		return
	case AM_R_HLI:
		sm83.Data = sm83.ReadRegister(sm83.CurrentInstruction.R2)
		sm83.SetRegister(RK_HL, sm83.ReadRegister(RK_HL)+1)
		sm83.Cycles += 4
		return
	case AM_R_HLD:
		sm83.Data = sm83.ReadRegister(sm83.CurrentInstruction.R2)
		sm83.SetRegister(RK_HL, sm83.ReadRegister(RK_HL)-1)
		sm83.Cycles += 4
		return
	case AM_HLI_R:
		// TODO
	case AM_HLD_R:
		// TODO
	case AM_R_A8:
		// TODO
	case AM_A8_R:
		// TODO
	case AM_HL_SPR:
		// TODO
	case AM_D8:
		// TODO
	case AM_A16_R:
		// TODO
	case AM_D16_R:
		// TODO
	case AM_MR_D8:
		// TODO
	case AM_MR:
		// TODO
	case AM_R_A16:
		// TODO
	default:
		sm83.PrintAndDie("unknown addressing mode (%s)", sm83.CurrentInstruction.AM)
	}
}

func (sm83 *SM83) Execute() {
	switch sm83.CurrentInstruction.IK {
	case IK_NOP:
		sm83.Registers.PC++
		sm83.Cycles += 4
		return
	case IK_JP:
		if sm83.CheckCondition() {
			sm83.Registers.PC = sm83.Data
			sm83.Cycles += 4
			return
		}
		sm83.Registers.PC++
		return
	default:
		sm83.PrintAndDie("instruction kind (%s) not implemented", sm83.CurrentInstruction.IK)
	}
}

func (sm83 *SM83) Step() int {
	sm83.Cycles = 0

	sm83.FetchInstruction()
	sm83.FetchData()
	sm83.Execute()

	return sm83.Cycles
}
