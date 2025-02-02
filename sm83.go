package sm83

import (
	"fmt"
	"os"
)

const (
	R_NONE = "NONE"
	R_A    = "RK_A"
	R_F    = "RK_F"
	R_B    = "RK_B"
	R_C    = "RK_C"
	R_D    = "RK_D"
	R_E    = "RK_E"
	R_H    = "RK_H"
	R_L    = "RK_L"
	R_AF   = "RK_AF"
	R_BC   = "RK_BC"
	R_DE   = "RK_DE"
	R_HL   = "RK_HL"
	R_SP   = "RK_SP"
	R_PC   = "RK_PC"
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

func (cpu *CPU) DD(message string, a ...any) {
	fmt.Printf("[PC 0x%04X] ", cpu.Registers.PC)
	fmt.Printf(message, a...)
	fmt.Printf("\n")
	os.Exit(1)
}

func (cpu *CPU) GetRegister8(rk string) byte {
	switch rk {
	case R_A:
		return cpu.Registers.A
	case R_F:
		return cpu.Registers.F
	case R_B:
		return cpu.Registers.B
	case R_C:
		return cpu.Registers.C
	case R_D:
		return cpu.Registers.D
	case R_E:
		return cpu.Registers.E
	case R_H:
		return cpu.Registers.H
	case R_L:
		return cpu.Registers.L
	default:
		return 0
	}
}

func (cpu *CPU) GetRegister16(rk string) uint16 {
	switch rk {
	case R_SP:
		return cpu.Registers.SP
	case R_PC:
		return cpu.Registers.PC
	case R_AF:
		return (uint16(cpu.Registers.A) << 8) | uint16(cpu.Registers.F)
	case R_BC:
		return (uint16(cpu.Registers.B) << 8) | uint16(cpu.Registers.C)
	case R_DE:
		return (uint16(cpu.Registers.D) << 8) | uint16(cpu.Registers.E)
	case R_HL:
		return (uint16(cpu.Registers.H) << 8) | uint16(cpu.Registers.L)
	default:
		return 0
	}
}

func (cpu *CPU) SetRegister8(rk string, value byte) {
	switch rk {
	case R_A:
		cpu.Registers.A = uint8(value & 0xFF)
		return
	case R_F:
		cpu.Registers.F = uint8(value & 0xFF)
		return
	case R_B:
		cpu.Registers.B = uint8(value & 0xFF)
		return
	case R_C:
		cpu.Registers.C = uint8(value & 0xFF)
		return
	case R_D:
		cpu.Registers.D = uint8(value & 0xFF)
		return
	case R_E:
		cpu.Registers.E = uint8(value & 0xFF)
		return
	case R_H:
		cpu.Registers.H = uint8(value & 0xFF)
		return
	case R_L:
		cpu.Registers.L = uint8(value & 0xFF)
		return
	}
}

func (cpu *CPU) SetRegister16(rk string, value uint16) {
	switch rk {
	case R_AF:
		cpu.Registers.A = uint8(value >> 8)
		cpu.Registers.F = uint8(value)
		return
	case R_BC:
		cpu.Registers.B = uint8(value >> 8)
		cpu.Registers.C = uint8(value)
		return
	case R_DE:
		cpu.Registers.D = uint8(value >> 8)
		cpu.Registers.E = uint8(value)
		return
	case R_HL:
		cpu.Registers.H = uint8(value >> 8)
		cpu.Registers.L = uint8(value)
		return
	}
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
		cpu.ld_r16_n16(R_BC)
	case 0x02:
		cpu.ld_r16_a(R_BC)
	case 0x06:
		cpu.ld_r8_n8(R_B)
	case 0x08:
		// TODO
	case 0x0a:
		cpu.ld_a_r16(R_BC)
	case 0x0e:
		cpu.ld_r8_n8(R_C)
	case 0x11:
		cpu.ld_r16_n16(R_DE)
	case 0x12:
		cpu.ld_r16_a(R_DE)
	case 0x16:
		cpu.ld_r8_n8(R_D)
	case 0x1a:
		cpu.ld_a_r16(R_DE)
	case 0x1e:
		cpu.ld_r8_n8(R_E)
	case 0x21:
		cpu.ld_r16_n16(R_HL)
	case 0x22:
		// TODO
	case 0x26:
		cpu.ld_r8_n8(R_H)
	case 0x2a:
		// TODO
	case 0x2e:
		cpu.ld_r8_n8(R_L)
	case 0x31:
		// TODO
	case 0x32:
		// TODO
	case 0x36:
		// TODO
	case 0x3a:
		// TODO
	case 0x3e:
		cpu.ld_r8_n8(R_A)
	case 0x41:
		cpu.ld_r8_r8(R_B, R_C)
	case 0x42:
		cpu.ld_r8_r8(R_B, R_D)
	case 0x43:
		cpu.ld_r8_r8(R_B, R_E)
	case 0x44:
		cpu.ld_r8_r8(R_B, R_H)
	case 0x45:
		cpu.ld_r8_r8(R_B, R_L)
	case 0x46:
		cpu.ld_r8_hl(R_B)
	case 0x47:
		cpu.ld_r8_r8(R_B, R_A)
	case 0x48:
		cpu.ld_r8_r8(R_C, R_B)
	case 0x4a:
		cpu.ld_r8_r8(R_C, R_D)
	case 0x4b:
		cpu.ld_r8_r8(R_C, R_E)
	case 0x4c:
		cpu.ld_r8_r8(R_C, R_H)
	case 0x4d:
		cpu.ld_r8_r8(R_C, R_L)
	case 0x4e:
		cpu.ld_r8_hl(R_C)
	case 0x4f:
		cpu.ld_r8_r8(R_C, R_A)
	case 0x50:
		cpu.ld_r8_r8(R_D, R_B)
	case 0x51:
		cpu.ld_r8_r8(R_D, R_C)
	case 0x53:
		cpu.ld_r8_r8(R_D, R_E)
	case 0x54:
		cpu.ld_r8_r8(R_D, R_H)
	case 0x55:
		cpu.ld_r8_r8(R_D, R_L)
	case 0x56:
		cpu.ld_r8_hl(R_D)
	case 0x57:
		cpu.ld_r8_r8(R_D, R_A)
	case 0x58:
		cpu.ld_r8_r8(R_E, R_B)
	case 0x59:
		cpu.ld_r8_r8(R_E, R_C)
	case 0x5a:
		cpu.ld_r8_r8(R_E, R_D)
	case 0x5c:
		cpu.ld_r8_r8(R_E, R_H)
	case 0x5d:
		cpu.ld_r8_r8(R_E, R_L)
	case 0x5e:
		cpu.ld_r8_hl(R_E)
	case 0x5f:
		cpu.ld_r8_r8(R_E, R_A)
	case 0x60:
		cpu.ld_r8_r8(R_H, R_B)
	case 0x61:
		cpu.ld_r8_r8(R_H, R_C)
	case 0x62:
		cpu.ld_r8_r8(R_H, R_D)
	case 0x63:
		cpu.ld_r8_r8(R_H, R_E)
	case 0x65:
		cpu.ld_r8_r8(R_H, R_L)
	case 0x66:
		cpu.ld_r8_hl(R_H)
	case 0x67:
		cpu.ld_r8_r8(R_H, R_A)
	case 0x68:
		cpu.ld_r8_r8(R_L, R_B)
	case 0x69:
		cpu.ld_r8_r8(R_L, R_C)
	case 0x6a:
		cpu.ld_r8_r8(R_L, R_D)
	case 0x6b:
		cpu.ld_r8_r8(R_L, R_E)
	case 0x6c:
		cpu.ld_r8_r8(R_L, R_H)
	case 0x6e:
		cpu.ld_r8_hl(R_L)
	case 0x6f:
		cpu.ld_r8_r8(R_L, R_A)
	case 0x70:
		cpu.ld_hl_n8(R_B)
	case 0x71:
		cpu.ld_hl_n8(R_C)
	case 0x72:
		cpu.ld_hl_n8(R_D)
	case 0x73:
		cpu.ld_hl_n8(R_E)
	case 0x74:
		cpu.ld_hl_n8(R_H)
	case 0x75:
		cpu.ld_hl_n8(R_L)
	case 0x77:
		cpu.ld_hl_n8(R_A)
	case 0x78:
		cpu.ld_r8_r8(R_A, R_B)
	case 0x79:
		cpu.ld_r8_r8(R_A, R_C)
	case 0x7a:
		cpu.ld_r8_r8(R_A, R_D)
	case 0x7b:
		cpu.ld_r8_r8(R_A, R_E)
	case 0x7c:
		cpu.ld_r8_r8(R_A, R_H)
	case 0x7d:
		cpu.ld_r8_r8(R_A, R_L)
	case 0x7e:
		cpu.ld_r8_hl(R_A)
	case 0xf9:
		cpu.ld_r16_r16(R_SP, R_HL)
	}

	return cpu.Cycles
}
