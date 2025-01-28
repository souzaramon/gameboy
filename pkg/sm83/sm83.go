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

	Data uint16

	Registers Registers

	Memory interface {
		Read8(address uint16) byte
		Write8(address uint16, value byte)
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

func (sm83 *SM83) ReadRegister(name string) uint16 {
	switch name {
	case "A":
		return uint16(sm83.Registers.A)
	case "F":
		return uint16(sm83.Registers.F)
	case "B":
		return uint16(sm83.Registers.B)
	case "C":
		return uint16(sm83.Registers.C)
	case "D":
		return uint16(sm83.Registers.D)
	case "E":
		return uint16(sm83.Registers.E)
	case "H":
		return uint16(sm83.Registers.H)
	case "L":
		return uint16(sm83.Registers.L)
	case "SP":
		return sm83.Registers.SP
	case "PC":
		return sm83.Registers.PC
	case "AF":
		return (uint16(sm83.Registers.F) << 8) | uint16(sm83.Registers.A)
	case "BC":
		return (uint16(sm83.Registers.C) << 8) | uint16(sm83.Registers.B)
	case "DE":
		return (uint16(sm83.Registers.E) << 8) | uint16(sm83.Registers.D)
	case "HL":
		return (uint16(sm83.Registers.L) << 8) | uint16(sm83.Registers.H)
	default:
		sm83.PrintAndDie("Unknown register (%s)", name)
		return 0
	}
}

func (sm83 *SM83) WriteRegister() {
	// TODO
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
	case AM_A16:
		lo := uint16(sm83.Memory.Read8(sm83.Registers.PC + 1))
		hi := uint16(sm83.Memory.Read8(sm83.Registers.PC + 2))

		sm83.Data = lo | (hi << 8)
		sm83.Registers.PC += 2
		return
	case AM_R:
		sm83.Data = sm83.ReadRegister(string(sm83.CurrentInstruction.R1))
		return
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
