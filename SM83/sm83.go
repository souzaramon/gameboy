package SM83

type m_cycles int
type t_cycles int

type MemoryLike interface {
	Read8(address uint16) byte
	Write8(address uint16, value byte)
	Read16(address uint16) uint16
	Write16(address uint16, value uint16)
}

type CPU struct {
	CurrentInstruction byte
	R                  Registers
	M                  MemoryLike
}

func (cpu *CPU) ExecInstruction(opcode byte) m_cycles {
	switch opcode {
	case 0x00, 0x40, 0x49, 0x52, 0x5b, 0x64, 0x6d, 0x7f:
		return 0
	case 0x01:
		return LD_r16_n16(cpu, R_BC)
	case 0x02:
		return LD_r16_A(cpu, R_BC)
	case 0x06:
		return LD_r8_n8(cpu, R_B)
	case 0x08:
		return LD_n16_SP(cpu)
	case 0x0a:
		return LD_A_r16(cpu, R_BC)
	case 0x0e:
		return LD_r8_n8(cpu, R_C)
	case 0x11:
		return LD_r16_n16(cpu, R_DE)
	case 0x12:
		return LD_r16_A(cpu, R_DE)
	case 0x16:
		return LD_r8_n8(cpu, R_D)
	case 0x1a:
		return LD_A_r16(cpu, R_DE)
	case 0x1e:
		return LD_r8_n8(cpu, R_E)
	case 0x21:
		return LD_r16_n16(cpu, R_HL)
	case 0x22:
		return LD_HLI_A(cpu)
	case 0x26:
		return LD_r8_n8(cpu, R_H)
	case 0x2a:
		return LD_A_HLI(cpu)
	case 0x2e:
		return LD_r8_n8(cpu, R_L)
	case 0x31:
		return LD_SP_n16(cpu)
	case 0x32:
		return LD_HLD_A(cpu)
	case 0x36:
		return LD_HL_n8(cpu)
	case 0x3a:
		return LD_A_HLD(cpu)
	case 0x3e:
		return LD_r8_n8(cpu, R_A)
	case 0x41:
		return LD_r8_r8(cpu, R_B, R_C)
	case 0x42:
		return LD_r8_r8(cpu, R_B, R_D)
	case 0x43:
		return LD_r8_r8(cpu, R_B, R_E)
	case 0x44:
		return LD_r8_r8(cpu, R_B, R_H)
	case 0x45:
		return LD_r8_r8(cpu, R_B, R_L)
	case 0x46:
		return LD_r8_HL(cpu, R_B)
	case 0x47:
		return LD_r8_r8(cpu, R_B, R_A)
	case 0x48:
		return LD_r8_r8(cpu, R_C, R_B)
	case 0x4a:
		return LD_r8_r8(cpu, R_C, R_D)
	case 0x4b:
		return LD_r8_r8(cpu, R_C, R_E)
	case 0x4c:
		return LD_r8_r8(cpu, R_C, R_H)
	case 0x4d:
		return LD_r8_r8(cpu, R_C, R_L)
	case 0x4e:
		return LD_r8_HL(cpu, R_C)
	case 0x4f:
		return LD_r8_r8(cpu, R_C, R_A)
	case 0x50:
		return LD_r8_r8(cpu, R_D, R_B)
	case 0x51:
		return LD_r8_r8(cpu, R_D, R_C)
	case 0x53:
		return LD_r8_r8(cpu, R_D, R_E)
	case 0x54:
		return LD_r8_r8(cpu, R_D, R_H)
	case 0x55:
		return LD_r8_r8(cpu, R_D, R_L)
	case 0x56:
		return LD_r8_HL(cpu, R_D)
	case 0x57:
		return LD_r8_r8(cpu, R_D, R_A)
	case 0x58:
		return LD_r8_r8(cpu, R_E, R_B)
	case 0x59:
		return LD_r8_r8(cpu, R_E, R_C)
	case 0x5a:
		return LD_r8_r8(cpu, R_E, R_D)
	case 0x5c:
		return LD_r8_r8(cpu, R_E, R_H)
	case 0x5d:
		return LD_r8_r8(cpu, R_E, R_L)
	case 0x5e:
		return LD_r8_HL(cpu, R_E)
	case 0x5f:
		return LD_r8_r8(cpu, R_E, R_A)
	case 0x60:
		return LD_r8_r8(cpu, R_H, R_B)
	case 0x61:
		return LD_r8_r8(cpu, R_H, R_C)
	case 0x62:
		return LD_r8_r8(cpu, R_H, R_D)
	case 0x63:
		return LD_r8_r8(cpu, R_H, R_E)
	case 0x65:
		return LD_r8_r8(cpu, R_H, R_L)
	case 0x66:
		return LD_r8_HL(cpu, R_H)
	case 0x67:
		return LD_r8_r8(cpu, R_H, R_A)
	case 0x68:
		return LD_r8_r8(cpu, R_L, R_B)
	case 0x69:
		return LD_r8_r8(cpu, R_L, R_C)
	case 0x6a:
		return LD_r8_r8(cpu, R_L, R_D)
	case 0x6b:
		return LD_r8_r8(cpu, R_L, R_E)
	case 0x6c:
		return LD_r8_r8(cpu, R_L, R_H)
	case 0x6e:
		return LD_r8_HL(cpu, R_L)
	case 0x6f:
		return LD_r8_r8(cpu, R_L, R_A)
	case 0x70:
		return LD_HL_r8(cpu, R_B)
	case 0x71:
		return LD_HL_r8(cpu, R_C)
	case 0x72:
		return LD_HL_r8(cpu, R_D)
	case 0x73:
		return LD_HL_r8(cpu, R_E)
	case 0x74:
		return LD_HL_r8(cpu, R_H)
	case 0x75:
		return LD_HL_r8(cpu, R_L)
	case 0x77:
		return LD_HL_r8(cpu, R_A)
	case 0x78:
		return LD_r8_r8(cpu, R_A, R_B)
	case 0x79:
		return LD_r8_r8(cpu, R_A, R_C)
	case 0x7a:
		return LD_r8_r8(cpu, R_A, R_D)
	case 0x7b:
		return LD_r8_r8(cpu, R_A, R_E)
	case 0x7c:
		return LD_r8_r8(cpu, R_A, R_H)
	case 0x7d:
		return LD_r8_r8(cpu, R_A, R_L)
	case 0x7e:
		return LD_r8_HL(cpu, R_A)
	case 0x80:
		return ADD_A_r8(cpu, R_B)
	case 0x81:
		return ADD_A_r8(cpu, R_C)
	case 0x82:
		return ADD_A_r8(cpu, R_D)
	case 0x83:
		return ADD_A_r8(cpu, R_E)
	case 0x84:
		return ADD_A_r8(cpu, R_H)
	case 0x85:
		return ADD_A_r8(cpu, R_L)
	case 0x87:
		return ADD_A_r8(cpu, R_A)
	case 0x90:
		return SUB_A_r8(cpu, R_B)
	case 0x91:
		return SUB_A_r8(cpu, R_C)
	case 0x92:
		return SUB_A_r8(cpu, R_D)
	case 0x93:
		return SUB_A_r8(cpu, R_E)
	case 0x94:
		return SUB_A_r8(cpu, R_H)
	case 0x95:
		return SUB_A_r8(cpu, R_L)
	case 0x97:
		return SUB_A_r8(cpu, R_A)
	case 0xa0:
		return AND_A_r8(cpu, R_B)
	case 0xa1:
		return AND_A_r8(cpu, R_C)
	case 0xa2:
		return AND_A_r8(cpu, R_D)
	case 0xa3:
		return AND_A_r8(cpu, R_E)
	case 0xa4:
		return AND_A_r8(cpu, R_H)
	case 0xa5:
		return AND_A_r8(cpu, R_L)
	case 0xa7:
		return AND_A_r8(cpu, R_A)
	case 0xa8:
		return XOR_A_r8(cpu, R_B)
	case 0xa9:
		return XOR_A_r8(cpu, R_C)
	case 0xaa:
		return XOR_A_r8(cpu, R_D)
	case 0xab:
		return XOR_A_r8(cpu, R_E)
	case 0xac:
		return XOR_A_r8(cpu, R_H)
	case 0xad:
		return XOR_A_r8(cpu, R_L)
	case 0xaf:
		return XOR_A_r8(cpu, R_A)
	case 0xb0:
		return OR_A_r8(cpu, R_B)
	case 0xb1:
		return OR_A_r8(cpu, R_C)
	case 0xb2:
		return OR_A_r8(cpu, R_D)
	case 0xb3:
		return OR_A_r8(cpu, R_E)
	case 0xb4:
		return OR_A_r8(cpu, R_H)
	case 0xb5:
		return OR_A_r8(cpu, R_L)
	case 0xb7:
		return OR_A_r8(cpu, R_A)
	case 0xb8:
		return CP_A_r8(cpu, R_B)
	case 0xb9:
		return CP_A_r8(cpu, R_C)
	case 0xba:
		return CP_A_r8(cpu, R_D)
	case 0xbb:
		return CP_A_r8(cpu, R_E)
	case 0xbc:
		return CP_A_r8(cpu, R_H)
	case 0xbd:
		return CP_A_r8(cpu, R_L)
	case 0xbf:
		return CP_A_r8(cpu, R_A)
	case 0xea:
		return LD_n16_A(cpu)
	case 0xf9:
		return LD_SP_HL(cpu)
	case 0xfa:
		return LD_A_n16(cpu)
	default:
		return 0
	}
}

func (cpu *CPU) ExecPInstruction(opcode byte) m_cycles {
	switch opcode {
	case 0x00:
		return 0
	default:
		return 0
	}
}

func (cpu *CPU) Step() t_cycles {
	cpu.CurrentInstruction = cpu.M.Read8(cpu.R.PC)
	cpu.R.PC += 1

	switch cpu.CurrentInstruction {
	case 0xcb:
		cpu.CurrentInstruction = cpu.M.Read8(cpu.R.PC)
		cpu.R.PC += 1
		mcycles := cpu.ExecPInstruction(cpu.CurrentInstruction)

		return t_cycles(mcycles * 4)
	default:
		mcycles := cpu.ExecInstruction(cpu.CurrentInstruction)

		return t_cycles(mcycles * 4)
	}
}
