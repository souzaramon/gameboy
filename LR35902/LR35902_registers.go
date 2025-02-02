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

func (r *Registers) SetZ(v bool) {
	r.F = SetNthBit(r.F, 7, v)
}

func (r *Registers) SetN(v bool) {
	r.F = SetNthBit(r.F, 6, v)
}

func (r *Registers) SetH(v bool) {
	r.F = SetNthBit(r.F, 5, v)
}

func (r *Registers) SetC(v bool) {
	r.F = SetNthBit(r.F, 4, v)
}

func (r *Registers) GetByName8(reg string) byte {
	switch reg {
	case R_A:
		return r.A
	case R_F:
		return r.F
	case R_B:
		return r.B
	case R_C:
		return r.C
	case R_D:
		return r.D
	case R_E:
		return r.E
	case R_H:
		return r.H
	case R_L:
		return r.L
	default:
		return 0
	}
}

func (r *Registers) GetByName16(reg string) uint16 {
	switch reg {
	case R_SP:
		return r.SP
	case R_PC:
		return r.PC
	case R_AF:
		return (uint16(r.A) << 8) | uint16(r.F)
	case R_BC:
		return (uint16(r.B) << 8) | uint16(r.C)
	case R_DE:
		return (uint16(r.D) << 8) | uint16(r.E)
	case R_HL:
		return (uint16(r.H) << 8) | uint16(r.L)
	default:
		return 0
	}
}

func (r *Registers) SetByName8(reg string, value byte) {
	switch reg {
	case R_A:
		r.A = uint8(value & 0xFF)
	case R_F:
		r.F = uint8(value & 0xFF)
	case R_B:
		r.B = uint8(value & 0xFF)
	case R_C:
		r.C = uint8(value & 0xFF)
	case R_D:
		r.D = uint8(value & 0xFF)
	case R_E:
		r.E = uint8(value & 0xFF)
	case R_H:
		r.H = uint8(value & 0xFF)
	case R_L:
		r.L = uint8(value & 0xFF)
	}
}

func (r *Registers) SetByName16(reg string, value uint16) {
	switch reg {
	case R_SP:
		r.SP = value
	case R_PC:
		r.PC = value
	case R_AF:
		r.A = uint8(value >> 8)
		r.F = uint8(value)
	case R_BC:
		r.B = uint8(value >> 8)
		r.C = uint8(value)
	case R_DE:
		r.D = uint8(value >> 8)
		r.E = uint8(value)
	case R_HL:
		r.H = uint8(value >> 8)
		r.L = uint8(value)
	}
}