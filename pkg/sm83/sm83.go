package sm83

import (
	"fmt"
	"os"
)

type SM83 struct {
	Cycles int

	Pc                 uint16
	CurrentOpcode      byte
	CurrentInstruction Instruction

	Data uint16

	Registers struct {
		a  byte
		f  byte
		b  byte
		c  byte
		d  byte
		e  byte
		h  byte
		l  byte
		sp uint16
	}

	Memory interface {
		Read8(address uint16) byte
		Write8(address uint16, value byte)
	}
}

func (sm83 *SM83) ReadRegister() {
	// TODO
}

func (sm83 *SM83) WriteRegister() {
	// TODO
}

func (sm83 *SM83) WriteFlags() {
	// TODO: z, n, h, c
}

func (sm83 *SM83) FetchInstruction() {
	currentOpcode := sm83.Memory.Read8(sm83.Pc)
	currentInstruction, exists := InstructionSet[currentOpcode]

	if !exists {
		fmt.Printf("unknown instruction (0x%02X) encountered at PC: 0x%04X\n", currentOpcode, sm83.Pc)
		os.Exit(1)
	}

	sm83.CurrentOpcode = currentOpcode
	sm83.CurrentInstruction = currentInstruction
}

func (sm83 *SM83) FetchData() {
	switch sm83.CurrentInstruction.AM {
	case AM_IMP:
		return
	}
}

func (sm83 *SM83) Execute() {
	switch sm83.CurrentInstruction.IK {
	case IK_NOP:
		sm83.Pc++
		sm83.Cycles += 4
		return
	}
}

func (sm83 *SM83) Step() int {
	sm83.Cycles = 0

	sm83.FetchInstruction()
	sm83.FetchData()
	sm83.Execute()

	return sm83.Cycles
}
