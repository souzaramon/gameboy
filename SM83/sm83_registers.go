package SM83

type RegisterName string

const (
	R_NONE RegisterName = "NONE"
	R_A    RegisterName = "R_A"
	R_F    RegisterName = "R_F"
	R_B    RegisterName = "R_B"
	R_C    RegisterName = "R_C"
	R_D    RegisterName = "R_D"
	R_E    RegisterName = "R_E"
	R_H    RegisterName = "R_H"
	R_L    RegisterName = "R_L"
	R_AF   RegisterName = "R_AF"
	R_BC   RegisterName = "R_BC"
	R_DE   RegisterName = "R_DE"
	R_HL   RegisterName = "R_HL"
)

type Flag int

const (
	F_Z Flag = 7
	F_N Flag = 6
	F_H Flag = 5
	F_C Flag = 4
)

type Registers struct {
	PC uint16
	SP uint16
	A  byte
	F  byte
	B  byte
	C  byte
	D  byte
	E  byte
	H  byte
	L  byte
}

func (r *Registers) GetFlag(flag Flag) bool {
	return r.F&(byte(1)<<flag) != 0
}

func (r *Registers) SetFlag(flag Flag, v bool) {
	if v {
		r.F = r.F | (byte(1) << flag)
	} else {
		r.F = r.F & ^(byte(1) << flag)
	}
}

func (r *Registers) GetByName8(reg RegisterName) byte {
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

func (r *Registers) GetByName16(reg RegisterName) uint16 {
	switch reg {
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

func (r *Registers) SetByName8(reg RegisterName, value byte) {
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

func (r *Registers) SetByName16(reg RegisterName, value uint16) {
	switch reg {
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
