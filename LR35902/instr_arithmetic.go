package LR35902

// (ADD A,r8): Add the value in r8 to A.
func ADD_A_r8(cpu *CPU, r8 RegisterName) m_cycles {
	A := cpu.R.GetByName8(R_A)
	r8_val := cpu.R.GetByName8(r8)

	result := A + r8_val

	cpu.R.SetByName8(R_A, result)
	cpu.R.SetFlag(F_Z, (result&0xFF) == 0)
	cpu.R.SetFlag(F_N, false)
	cpu.R.SetFlag(F_H, (A&0xF)+(r8_val&0xF) >= 0x10)
	cpu.R.SetFlag(F_C, uint16(A)+uint16(r8_val) > 0xFF)

	return 0
}

// (ADD A,[HL]): TODO

// (ADD A,n8):   TODO

// (ADD HL,r16): TODO

// (ADD HL,SP):   TODO

// (ADD SP,e8):   TODO

// (SUB A,r8): Subtract the value in r8 from A.
func SUB_A_r8(cpu *CPU, r8 RegisterName) m_cycles {
	A := cpu.R.GetByName8(R_A)
	r8_val := cpu.R.GetByName8(r8)

	result := A - r8_val

	cpu.R.SetByName8(R_A, result)
	cpu.R.SetFlag(F_Z, (result&0xFF) == 0)
	cpu.R.SetFlag(F_N, true)
	cpu.R.SetFlag(F_H, int(A&0xF)-int(r8_val&0xF) < 0)
	cpu.R.SetFlag(F_C, int(A)-int(r8_val) < 0)

	return 0
}

// (SUB A,[HL]): TODO

// (SUB A,n8):   TODO

// (CP A,r8): ComPare the value in A with the value in r8.
func CP_A_r8(cpu *CPU, r8 RegisterName) m_cycles {
	A := cpu.R.GetByName8(R_A)
	r8_val := cpu.R.GetByName8(r8)
	result := int(A) - int(r8_val)

	cpu.R.SetFlag(F_Z, result == 0)
	cpu.R.SetFlag(F_N, true)
	cpu.R.SetFlag(F_H, (int(A&0x0F)-int(r8_val&0x0f)) < 0)
	cpu.R.SetFlag(F_C, result < 0)

	return 0
}

// (CP A,[HL]):  TODO

// (CP A,n8):    TODO

// (ADC A,r8):   TODO

// (ADC A,[HL]): TODO

// (ADC A,n8):   TODO

// (DEC SP):      TODO

// (DEC r8):     TODO

// (DEC [HL]):   TODO

// (DEC r16):    TODO

// (INC r8):     TODO

// (INC [HL]):   TODO

// (INC r16):    TODO

// (INC SP):      TODO

// (SBC A,r8):   TODO

// (SBC A,[HL]): TODO

// (SBC A,n8):   TODO

// (POP AF):      TODO

// (POP r16):     TODO

// (PUSH AF):     TODO

// (PUSH r16):    TODO
