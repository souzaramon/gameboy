package LR35902

const (
	R_NONE = "NONE"
	R_A    = "R_A"
	R_F    = "R_F"
	R_B    = "R_B"
	R_C    = "R_C"
	R_D    = "R_D"
	R_E    = "R_E"
	R_H    = "R_H"
	R_L    = "R_L"
	R_AF   = "R_AF"
	R_BC   = "R_BC"
	R_DE   = "R_DE"
	R_HL   = "R_HL"
	R_SP   = "R_SP"
	R_PC   = "R_PC"
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

// bits: {z, n, h, c}
func (cpu *CPU) SetFlags(flags [4]int) {
	for index, value := range flags {
		if value != -1 {
			position := 7 - index
			cpu.Registers.F = SetNthBit(cpu.Registers.F, position, value > 0)
		}
	}
}

func (cpu *CPU) GetRegister8(reg string) byte {
	switch reg {
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

func (cpu *CPU) GetRegister16(reg string) uint16 {
	switch reg {
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

func (cpu *CPU) SetRegister8(reg string, value byte) {
	switch reg {
	case R_A:
		cpu.Registers.A = uint8(value & 0xFF)
	case R_F:
		cpu.Registers.F = uint8(value & 0xFF)
	case R_B:
		cpu.Registers.B = uint8(value & 0xFF)
	case R_C:
		cpu.Registers.C = uint8(value & 0xFF)
	case R_D:
		cpu.Registers.D = uint8(value & 0xFF)
	case R_E:
		cpu.Registers.E = uint8(value & 0xFF)
	case R_H:
		cpu.Registers.H = uint8(value & 0xFF)
	case R_L:
		cpu.Registers.L = uint8(value & 0xFF)
	}
}

func (cpu *CPU) SetRegister16(reg string, value uint16) {
	switch reg {
	case R_SP:
		cpu.Registers.SP = value
	case R_PC:
		cpu.Registers.PC = value
	case R_AF:
		cpu.Registers.A = uint8(value >> 8)
		cpu.Registers.F = uint8(value)
	case R_BC:
		cpu.Registers.B = uint8(value >> 8)
		cpu.Registers.C = uint8(value)
	case R_DE:
		cpu.Registers.D = uint8(value >> 8)
		cpu.Registers.E = uint8(value)
	case R_HL:
		cpu.Registers.H = uint8(value >> 8)
		cpu.Registers.L = uint8(value)
	}
}

func (cpu *CPU) Step() int {
	cpu.Cycles = 0

	currentOpcode := cpu.Memory.Read8(cpu.Registers.PC)
	cpu.Registers.PC += 1

	switch currentOpcode {
		case 0x00, 0x40, 0x49, 0x52, 0x5b, 0x64, 0x6d, 0x7f: break
		case 0x01: cpu.LD_r16_n16(R_BC)
		case 0x02: cpu.LD_r16_A(R_BC)
		case 0x06: cpu.LD_r8_n8(R_B)
		case 0x08: cpu.LD_n16_SP()
		case 0x0a: cpu.LD_A_r16(R_BC)
		case 0x0e: cpu.LD_r8_n8(R_C)
		case 0x11: cpu.LD_r16_n16(R_DE)
		case 0x12: cpu.LD_r16_A(R_DE)
		case 0x16: cpu.LD_r8_n8(R_D)
		case 0x1a: cpu.LD_A_r16(R_DE)
		case 0x1e: cpu.LD_r8_n8(R_E)
		case 0x21: cpu.LD_r16_n16(R_HL)
		case 0x22: cpu.LD_HLI_A()
		case 0x26: cpu.LD_r8_n8(R_H)
		case 0x2a: cpu.LD_A_HLI()
		case 0x2e: cpu.LD_r8_n8(R_L)
		case 0x31: cpu.LD_SP_n16()
		case 0x32: cpu.LD_HLD_A()
		case 0x36: cpu.LD_HL_n8()
		case 0x3a: cpu.LD_A_HLD()
		case 0x3e: cpu.LD_r8_n8(R_A)
		case 0x41: cpu.LD_r8_r8(R_B, R_C)
		case 0x42: cpu.LD_r8_r8(R_B, R_D)
		case 0x43: cpu.LD_r8_r8(R_B, R_E)
		case 0x44: cpu.LD_r8_r8(R_B, R_H)
		case 0x45: cpu.LD_r8_r8(R_B, R_L)
		case 0x46: cpu.LD_r8_HL(R_B)
		case 0x47: cpu.LD_r8_r8(R_B, R_A)
		case 0x48: cpu.LD_r8_r8(R_C, R_B)
		case 0x4a: cpu.LD_r8_r8(R_C, R_D)
		case 0x4b: cpu.LD_r8_r8(R_C, R_E)
		case 0x4c: cpu.LD_r8_r8(R_C, R_H)
		case 0x4d: cpu.LD_r8_r8(R_C, R_L)
		case 0x4e: cpu.LD_r8_HL(R_C)
		case 0x4f: cpu.LD_r8_r8(R_C, R_A)
		case 0x50: cpu.LD_r8_r8(R_D, R_B)
		case 0x51: cpu.LD_r8_r8(R_D, R_C)
		case 0x53: cpu.LD_r8_r8(R_D, R_E)
		case 0x54: cpu.LD_r8_r8(R_D, R_H)
		case 0x55: cpu.LD_r8_r8(R_D, R_L)
		case 0x56: cpu.LD_r8_HL(R_D)
		case 0x57: cpu.LD_r8_r8(R_D, R_A)
		case 0x58: cpu.LD_r8_r8(R_E, R_B)
		case 0x59: cpu.LD_r8_r8(R_E, R_C)
		case 0x5a: cpu.LD_r8_r8(R_E, R_D)
		case 0x5c: cpu.LD_r8_r8(R_E, R_H)
		case 0x5d: cpu.LD_r8_r8(R_E, R_L)
		case 0x5e: cpu.LD_r8_HL(R_E)
		case 0x5f: cpu.LD_r8_r8(R_E, R_A)
		case 0x60: cpu.LD_r8_r8(R_H, R_B)
		case 0x61: cpu.LD_r8_r8(R_H, R_C)
		case 0x62: cpu.LD_r8_r8(R_H, R_D)
		case 0x63: cpu.LD_r8_r8(R_H, R_E)
		case 0x65: cpu.LD_r8_r8(R_H, R_L)
		case 0x66: cpu.LD_r8_HL(R_H)
		case 0x67: cpu.LD_r8_r8(R_H, R_A)
		case 0x68: cpu.LD_r8_r8(R_L, R_B)
		case 0x69: cpu.LD_r8_r8(R_L, R_C)
		case 0x6a: cpu.LD_r8_r8(R_L, R_D)
		case 0x6b: cpu.LD_r8_r8(R_L, R_E)
		case 0x6c: cpu.LD_r8_r8(R_L, R_H)
		case 0x6e: cpu.LD_r8_HL(R_L)
		case 0x6f: cpu.LD_r8_r8(R_L, R_A)
		case 0x70: cpu.LD_HL_r8(R_B)
		case 0x71: cpu.LD_HL_r8(R_C)
		case 0x72: cpu.LD_HL_r8(R_D)
		case 0x73: cpu.LD_HL_r8(R_E)
		case 0x74: cpu.LD_HL_r8(R_H)
		case 0x75: cpu.LD_HL_r8(R_L)
		case 0x77: cpu.LD_HL_r8(R_A)
		case 0x78: cpu.LD_r8_r8(R_A, R_B)
		case 0x79: cpu.LD_r8_r8(R_A, R_C)
		case 0x7a: cpu.LD_r8_r8(R_A, R_D)
		case 0x7b: cpu.LD_r8_r8(R_A, R_E)
		case 0x7c: cpu.LD_r8_r8(R_A, R_H)
		case 0x7d: cpu.LD_r8_r8(R_A, R_L)
		case 0x7e: cpu.LD_r8_HL(R_A)
		case 0xf9: cpu.LD_SP_HL()
	}

	return cpu.Cycles
}
