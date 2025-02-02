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

// TODO:
// bits: {z, n, h, c}
func (cpu *CPU) SetFlags(bits [4]int) {
	for i := 3; i >= 0; i-- {
		bit := bits[i]

		if bit != -1 {
			cpu.Registers.F = SetNthBit(cpu.Registers.F, 7-i, bit > 0)
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

func (cpu *CPU) SetRegister16(reg string, value uint16) {
	switch reg {
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
