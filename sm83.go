package sm83

import (
	"fmt"
	"os"
)

type CPU struct {
	Cycles    int
	Registers Registers

	Memory interface {
		Read8(address uint16) byte
		Write8(address uint16, value byte)
		Read16(address uint16) uint16
		Write16(address uint16, value uint16)
	}
}

func (cpu *CPU) DD(message string, a ...any) {
	fmt.Printf("[PC 0x%04X] ", cpu.Registers.PC)
	fmt.Printf(message, a...)
	fmt.Printf("\n")
	os.Exit(1)
}

// bits: {z, n, h, c}
func (cpu *CPU) SetFlags(bits [4]int) {
	for i := 3; i >= 0; i-- {
		bit := bits[i]

		if bit != -1 {
			cpu.Registers.F = SetNthBit(cpu.Registers.F, 7-i, bit > 0)
		}

	}
}

func (cpu *CPU) Step() int {
	cpu.Cycles = 0

	currentOpcode := cpu.Memory.Read8(cpu.Registers.PC)
	cpu.Registers.PC += 1

	switch currentOpcode {
	case 0x00, 0x40, 0x49, 0x52, 0x5b, 0x64, 0x6d, 0x7f:
		break // NOP
	case 0x01:
		cpu.LD_r16_n16(R_BC)
	case 0x02:
		cpu.LD_r16_A(R_BC)
	case 0x06:
		cpu.LD_r8_n8(R_B)
	case 0x08:
		// TODO
	case 0x0a:
		cpu.LD_A_r16(R_BC)
	case 0x0e:
		cpu.LD_r8_n8(R_C)
	case 0x11:
		cpu.LD_r16_n16(R_DE)
	case 0x12:
		cpu.LD_r16_A(R_DE)
	case 0x16:
		cpu.LD_r8_n8(R_D)
	case 0x1a:
		cpu.LD_A_r16(R_DE)
	case 0x1e:
		cpu.LD_r8_n8(R_E)
	case 0x21:
		cpu.LD_r16_n16(R_HL)
	case 0x22:
		// TODO
	case 0x26:
		cpu.LD_r8_n8(R_H)
	case 0x2a:
		// TODO
	case 0x2e:
		cpu.LD_r8_n8(R_L)
	case 0x31:
		// TODO
	case 0x32:
		// TODO
	case 0x36:
		// TODO
	case 0x3a:
		// TODO
	case 0x3e:
		cpu.LD_r8_n8(R_A)
	case 0x41:
		cpu.LD_r8_r8(R_B, R_C)
	case 0x42:
		cpu.LD_r8_r8(R_B, R_D)
	case 0x43:
		cpu.LD_r8_r8(R_B, R_E)
	case 0x44:
		cpu.LD_r8_r8(R_B, R_H)
	case 0x45:
		cpu.LD_r8_r8(R_B, R_L)
	case 0x46:
		cpu.LD_r8_HL(R_B)
	case 0x47:
		cpu.LD_r8_r8(R_B, R_A)
	case 0x48:
		cpu.LD_r8_r8(R_C, R_B)
	case 0x4a:
		cpu.LD_r8_r8(R_C, R_D)
	case 0x4b:
		cpu.LD_r8_r8(R_C, R_E)
	case 0x4c:
		cpu.LD_r8_r8(R_C, R_H)
	case 0x4d:
		cpu.LD_r8_r8(R_C, R_L)
	case 0x4e:
		cpu.LD_r8_HL(R_C)
	case 0x4f:
		cpu.LD_r8_r8(R_C, R_A)
	case 0x50:
		cpu.LD_r8_r8(R_D, R_B)
	case 0x51:
		cpu.LD_r8_r8(R_D, R_C)
	case 0x53:
		cpu.LD_r8_r8(R_D, R_E)
	case 0x54:
		cpu.LD_r8_r8(R_D, R_H)
	case 0x55:
		cpu.LD_r8_r8(R_D, R_L)
	case 0x56:
		cpu.LD_r8_HL(R_D)
	case 0x57:
		cpu.LD_r8_r8(R_D, R_A)
	case 0x58:
		cpu.LD_r8_r8(R_E, R_B)
	case 0x59:
		cpu.LD_r8_r8(R_E, R_C)
	case 0x5a:
		cpu.LD_r8_r8(R_E, R_D)
	case 0x5c:
		cpu.LD_r8_r8(R_E, R_H)
	case 0x5d:
		cpu.LD_r8_r8(R_E, R_L)
	case 0x5e:
		cpu.LD_r8_HL(R_E)
	case 0x5f:
		cpu.LD_r8_r8(R_E, R_A)
	case 0x60:
		cpu.LD_r8_r8(R_H, R_B)
	case 0x61:
		cpu.LD_r8_r8(R_H, R_C)
	case 0x62:
		cpu.LD_r8_r8(R_H, R_D)
	case 0x63:
		cpu.LD_r8_r8(R_H, R_E)
	case 0x65:
		cpu.LD_r8_r8(R_H, R_L)
	case 0x66:
		cpu.LD_r8_HL(R_H)
	case 0x67:
		cpu.LD_r8_r8(R_H, R_A)
	case 0x68:
		cpu.LD_r8_r8(R_L, R_B)
	case 0x69:
		cpu.LD_r8_r8(R_L, R_C)
	case 0x6a:
		cpu.LD_r8_r8(R_L, R_D)
	case 0x6b:
		cpu.LD_r8_r8(R_L, R_E)
	case 0x6c:
		cpu.LD_r8_r8(R_L, R_H)
	case 0x6e:
		cpu.LD_r8_HL(R_L)
	case 0x6f:
		cpu.LD_r8_r8(R_L, R_A)
	case 0x70:
		cpu.LD_HL_n8(R_B)
	case 0x71:
		cpu.LD_HL_n8(R_C)
	case 0x72:
		cpu.LD_HL_n8(R_D)
	case 0x73:
		cpu.LD_HL_n8(R_E)
	case 0x74:
		cpu.LD_HL_n8(R_H)
	case 0x75:
		cpu.LD_HL_n8(R_L)
	case 0x77:
		cpu.LD_HL_n8(R_A)
	case 0x78:
		cpu.LD_r8_r8(R_A, R_B)
	case 0x79:
		cpu.LD_r8_r8(R_A, R_C)
	case 0x7a:
		cpu.LD_r8_r8(R_A, R_D)
	case 0x7b:
		cpu.LD_r8_r8(R_A, R_E)
	case 0x7c:
		cpu.LD_r8_r8(R_A, R_H)
	case 0x7d:
		cpu.LD_r8_r8(R_A, R_L)
	case 0x7e:
		cpu.LD_r8_HL(R_A)
	case 0xf9:
		// TODO
	}

	return cpu.Cycles
}
