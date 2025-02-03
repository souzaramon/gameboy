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

// (AND A,r8): Set A to the bitwise AND between the value in r8 and A.
func AND_A_r8(cpu *CPU, r8 RegisterName) m_cycles {
	result := cpu.R.GetByName8(R_A) & cpu.R.GetByName8(r8)

	cpu.R.SetByName8(R_A, result)
	cpu.R.SetFlag(F_Z, result == 0)
	cpu.R.SetFlag(F_N, false)
	cpu.R.SetFlag(F_H, true)
	cpu.R.SetFlag(F_C, false)

	return 0
}

// (OR A,r8): Set A to the bitwise OR between the value in r8 and A.
func OR_A_r8(cpu *CPU, r8 RegisterName) m_cycles {
	result := cpu.R.GetByName8(R_A) | cpu.R.GetByName8(r8)

	cpu.R.SetByName8(R_A, result)
	cpu.R.SetFlag(F_Z, result == 0)
	cpu.R.SetFlag(F_N, false)
	cpu.R.SetFlag(F_H, false)
	cpu.R.SetFlag(F_C, false)

	return 0
}

// (XOR A,r8): Set A to the bitwise XOR between the value in r8 and A.
func XOR_A_r8(cpu *CPU, r8 RegisterName) m_cycles {
	result := cpu.R.GetByName8(R_A) ^ cpu.R.GetByName8(r8)

	cpu.R.SetByName8(R_A, result)
	cpu.R.SetFlag(F_Z, result == 0)
	cpu.R.SetFlag(F_N, false)
	cpu.R.SetFlag(F_H, false)
	cpu.R.SetFlag(F_C, false)

	return 0
}

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
