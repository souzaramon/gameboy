package sm83

func (cpu *CPU) ld_r8_r8(r1 string, r2 string) {
	cpu.SetRegister8(r1, cpu.GetRegister8(r2))
}

func (cpu *CPU) ld_r16_r16(r1 string, r2 string) {
	cpu.SetRegister16(r1, cpu.GetRegister16(r2))
}

func (cpu *CPU) ld_r8_n8(r1 string) {
	cpu.SetRegister8(r1, cpu.Memory.Read8(cpu.Registers.PC))
	cpu.Registers.PC += 1
	cpu.Cycles += 4
}

func (cpu *CPU) ld_r16_n16(r1 string) {
	cpu.SetRegister16(r1, cpu.Memory.Read16(cpu.Registers.PC))
	cpu.Registers.PC += 2
	cpu.Cycles += 8
}

func (cpu *CPU) ld_r16_a(r1 string) {
	addr := cpu.GetRegister16(r1)

	if r1 == R_C {
		addr |= 0xFF00
	}

	cpu.Memory.Write8(addr, cpu.GetRegister8(R_A))
}

func (cpu *CPU) ld_hl_n8(r2 string) {
	cpu.Memory.Write8(cpu.GetRegister16(R_HL), cpu.GetRegister8(r2))
}

func (cpu *CPU) ld_sp_n16() {
	cpu.SetRegister16(R_SP, cpu.Memory.Read16(cpu.Registers.PC))
	cpu.Registers.PC += 2
}

func (cpu *CPU) ld_a_r16(r2 string) {
	cpu.SetRegister8(R_A, cpu.Memory.Read8(cpu.GetRegister16(r2)))
}

func (cpu *CPU) ld_r8_hl(r1 string) {
	cpu.SetRegister8(r1, cpu.Memory.Read8(cpu.GetRegister16(R_HL)))
}
