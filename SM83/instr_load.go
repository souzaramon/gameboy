package SM83

// (LD r8,r8): Copy (aka Load) the value in register on the right into the register on the left.
func LD_r8_r8(cpu *CPU, r8_1 RegisterName, r8_2 RegisterName) m_cycles {
	cpu.R.SetByName8(r8_1, cpu.R.GetByName8(r8_2))
	return 0
}

// (LD r8,n8): Copy the value n8 into register r8.
func LD_r8_n8(cpu *CPU, r8 RegisterName) m_cycles {
	cpu.R.SetByName8(r8, cpu.M.Read8(cpu.R.PC))
	cpu.R.PC += 1
	return 2
}

// (LD r16,n16): Copy the value n16 into register r16.
func LD_r16_n16(cpu *CPU, r16 RegisterName) m_cycles {
	cpu.R.SetByName16(r16, cpu.M.Read16(cpu.R.PC))
	cpu.R.PC += 2
	return 2
}

// (LD [r16],A): Copy the value in register A into the byte pointed to by r16.
func LD_r16_A(cpu *CPU, r16 RegisterName) m_cycles {
	addr := cpu.R.GetByName16(r16)
	cpu.M.Write8(addr, cpu.R.GetByName8(R_A))
	return 2
}

// (LD [HL],r8): Copy the value in register r8 into the byte pointed to by HL.
func LD_HL_r8(cpu *CPU, r8 RegisterName) m_cycles {
	cpu.M.Write8(cpu.R.GetByName16(R_HL), cpu.R.GetByName8(r8))
	return 0
}

// (LD [HL],n8): Copy the value n8 into the byte pointed to by HL.
func LD_HL_n8(cpu *CPU) m_cycles {
	cpu.M.Write8(cpu.R.GetByName16(R_HL), cpu.M.Read8(cpu.R.PC))
	cpu.R.PC += 1
	return 1
}

// (LD SP,n16): Copy the value n16 into register SP.
func LD_SP_n16(cpu *CPU) m_cycles {
	cpu.R.SP = cpu.M.Read16(cpu.R.PC)
	cpu.R.PC += 2
	return 2
}

// (LD A,[r16]): Copy the byte pointed to by r16 into register A.
func LD_A_r16(cpu *CPU, r16 RegisterName) m_cycles {
	cpu.R.SetByName8(R_A, cpu.M.Read8(cpu.R.GetByName16(r16)))
	return 1
}

// (LD r8,[HL]): Copy the value pointed to by HL into register r8.
func LD_r8_HL(cpu *CPU, r8 RegisterName) m_cycles {
	cpu.R.SetByName8(r8, cpu.M.Read8(cpu.R.GetByName16(R_HL)))
	return 1
}

// (LD [HLI],A): Copy the value in register A into the byte pointed by HL and increment HL afterwards.
func LD_HLI_A(cpu *CPU) m_cycles {
	HL := cpu.R.GetByName16(R_HL)
	cpu.M.Write8(HL, cpu.R.GetByName8(R_A))
	cpu.R.SetByName16(R_HL, HL+1)
	return 1
}

// (LD [HLD],A): Copy the value in register A into the byte pointed by HL and decrement HL afterwards.
func LD_HLD_A(cpu *CPU) m_cycles {
	HL := cpu.R.GetByName16(R_HL)
	cpu.M.Write8(HL, cpu.R.GetByName8(R_A))
	cpu.R.SetByName16(R_HL, HL-1)
	return 0
}

// (LD A,[HLI]): Copy the byte pointed to by HL into register A, and increment HL afterwards.
func LD_A_HLI(cpu *CPU) m_cycles {
	HL := cpu.R.GetByName16(R_HL)
	cpu.R.SetByName8(R_A, cpu.M.Read8(HL))
	cpu.R.SetByName16(R_HL, HL+1)
	return 1
}

// (LD A,[HLD]): Copy the byte pointed to by HL into register A, and decrement HL afterwards.
func LD_A_HLD(cpu *CPU) m_cycles {
	HL := cpu.R.GetByName16(R_HL)
	cpu.R.SetByName8(R_A, cpu.M.Read8(HL))
	cpu.R.SetByName16(R_HL, HL-1)
	return 1
}

// (LD SP,HL): Copy register HL into register SP.
func LD_SP_HL(cpu *CPU) m_cycles {
	cpu.R.SP = cpu.R.GetByName16(R_HL)
	return 0
}

// (LD [n16],SP): Copy SP & $FF at address n16 and SP >> 8 at address n16 + 1.
func LD_n16_SP(cpu *CPU) m_cycles {
	addr := cpu.M.Read16(cpu.R.PC)
	cpu.M.Write16(addr, cpu.R.SP)
	cpu.R.PC += 2
	return 2
}

// (LD [n16],A): Copy the value in register A into the byte at address n16.
func LD_n16_A(cpu *CPU) m_cycles {
	addr := cpu.M.Read16(cpu.R.PC)
	cpu.M.Write16(addr, cpu.R.GetByName16(R_A))
	cpu.R.PC += 2
	return 2
}

// (LD A,[n16]): Copy the byte at address n16 into register A.
func LD_A_n16(cpu *CPU) m_cycles {
	addr := cpu.M.Read16(cpu.R.PC)
	cpu.R.PC += 2
	cpu.R.SetByName8(R_A, cpu.M.Read8(addr))
	return 2
}

// (LD HL,SP+e8): TODO

// (LDH [n16],A): TODO

// (LDH [C],A):   TODO

// (LDH A,[n16]): TODO

// (LDH A,[C]):   TODO
