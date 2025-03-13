package SM83

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

// (AND A,[HL]):    TODO

// (AND A,n8):      TODO

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

// (OR A,[HL]):     TODO

// (OR A,n8):       TODO

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

// (XOR A,[HL]):    TODO

// (XOR A,n8):      TODO

// (CPL):           TODO

// (BIT u3,r8):     TODO

// (BIT u3,[HL]):   TODO

// (RES u3,r8):     TODO

// (RES u3,[HL]):   TODO

// (SET u3,r8):     TODO

// (SET u3,[HL]):   TODO

// (RL r8):         TODO

// (RL [HL]):       TODO

// (RLA):           TODO

// (RLC r8):        TODO

// (RLC [HL]):      TODO

// (RLCA):          TODO

// (RR r8):         TODO

// (RR [HL]):       TODO

// (RRA):           TODO

// (RRC r8):        TODO

// (RRC [HL]):      TODO

// (RRCA):          TODO

// (SLA r8):        TODO

// (SLA [HL]):      TODO

// (SRA r8):        TODO

// (SRA [HL]):      TODO

// (SRL r8):        TODO

// (SRL [HL]):      TODO

// (SWAP r8):       TODO

// (SWAP [HL]):     TODO
