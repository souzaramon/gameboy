package LR35902

// (ADD A,r8): Add the value in r8 to A.
func ADD_A_r8(cpu *CPU, r2 string) {
	A := cpu.R.GetByName8(R_A)
	r8 := cpu.R.GetByName8(r2)

	result := A + r8

	cpu.R.SetByName8(R_A, result)
	cpu.R.SetZ((result & 0xFF) == 0)
	cpu.R.SetN(false)
	cpu.R.SetH((A&0xF)+(r8&0xF) >= 0x10)
	cpu.R.SetC(uint16(A)+uint16(r8) > 0xFF)
}

// (SUB A,r8): Subtract the value in r8 from A.
func SUB_A_r8(cpu *CPU, r2 string) {
	A := cpu.R.GetByName8(R_A)
	r8 := cpu.R.GetByName8(r2)

	result := A - r8
	
	cpu.R.SetByName8(R_A, result)
	cpu.R.SetZ((result & 0xFF) == 0)
	cpu.R.SetN(true)
	cpu.R.SetH(int(A&0xF)-int(r8&0xF) < 0)
	cpu.R.SetC(int(A)-int(r8) < 0)
}

// (AND A,r8): Set A to the bitwise AND between the value in r8 and A.
func AND_A_r8(cpu *CPU, r8 string) {
	result := cpu.R.GetByName8(R_A) & cpu.R.GetByName8(r8)

	cpu.R.SetByName8(R_A, result)
	cpu.R.SetZ(result == 0)
	cpu.R.SetN(false)
	cpu.R.SetH(true)
	cpu.R.SetC(false)
}

// (OR A,r8): Set A to the bitwise OR between the value in r8 and A.
func OR_A_r8(cpu *CPU, r8 string) {
	result := cpu.R.GetByName8(R_A) | cpu.R.GetByName8(r8)

	cpu.R.SetByName8(R_A, result)
	cpu.R.SetZ(result == 0)
	cpu.R.SetN(false)
	cpu.R.SetH(false)
	cpu.R.SetC(false)
}

// (XOR A,r8): Set A to the bitwise XOR between the value in r8 and A.
func XOR_A_r8(cpu *CPU, r8 string) {
	result := cpu.R.GetByName8(R_A) ^ cpu.R.GetByName8(r8)

	cpu.R.SetByName8(R_A, result)
	cpu.R.SetZ(result == 0)
	cpu.R.SetN(false)
	cpu.R.SetH(false)
	cpu.R.SetC(false)
}

// (CP A,r8): ComPare the value in A with the value in r8.
func CP_A_r8(cpu *CPU, r8 string) {
	A := cpu.R.GetByName8(R_A)
	r8_val := cpu.R.GetByName8(r8)
	result := int(A) - int(r8_val)

	cpu.R.SetZ(result == 0)
	cpu.R.SetN(true)
	cpu.R.SetH((int(A&0x0F) - int(r8_val&0x0f)) < 0)
	cpu.R.SetC(result < 0)
}
