package LR35902

// LD r8,r8
// Copy (aka Load) the value in register on the right into the register on the left.
func (cpu *CPU) LD_r8_r8(r1 string, r2 string) {
	cpu.SetRegister8(r1, cpu.GetRegister8(r2))
}

// LD r8,n8
// Copy the value n8 into register r8.
func (cpu *CPU) LD_r8_n8(r1 string) {
	cpu.SetRegister8(r1, cpu.Memory.Read8(cpu.Registers.PC))
	cpu.Registers.PC += 1
	cpu.Cycles += 4
}

// LD r16,n16
// Copy the value n16 into register r16.
func (cpu *CPU) LD_r16_n16(r1 string) {
	cpu.SetRegister16(r1, cpu.Memory.Read16(cpu.Registers.PC))
	cpu.Registers.PC += 2
	cpu.Cycles += 8
}

// LD [r16],A
// Copy the value in register A into the byte pointed to by r16.
func (cpu *CPU) LD_r16_A(r1 string) {
	addr := cpu.GetRegister16(r1)

	if r1 == R_C {
		addr |= 0xFF00
	}

	cpu.Memory.Write8(addr, cpu.GetRegister8(R_A))
}

// LD [HL],r8
// Copy the value in register r8 into the byte pointed to by HL.
func (cpu *CPU) LD_HL_r8(r2 string) {
	cpu.Memory.Write8(cpu.GetRegister16(R_HL), cpu.GetRegister8(r2))
}

// LD [HL],n8
// Copy the value n8 into the byte pointed to by HL.
func (cpu *CPU) LD_HL_n8() {
	cpu.Memory.Write8(cpu.GetRegister16(R_HL), cpu.Memory.Read8(cpu.Registers.PC))
	cpu.Registers.PC += 1
}

// LD SP,n16
// Copy the value n16 into register SP.
func (cpu *CPU) LD_SP_n16() {
	cpu.SetRegister16(R_SP, cpu.Memory.Read16(cpu.Registers.PC))
	cpu.Registers.PC += 2
}

// LD A,[r16]
// Copy the byte pointed to by r16 into register A.
func (cpu *CPU) LD_A_r16(r2 string) {
	cpu.SetRegister8(R_A, cpu.Memory.Read8(cpu.GetRegister16(r2)))
}

// LD r8,[HL]
// Copy the value pointed to by HL into register r8.
func (cpu *CPU) LD_r8_HL(r1 string) {
	cpu.SetRegister8(r1, cpu.Memory.Read8(cpu.GetRegister16(R_HL)))
}

// LD [HLI],A
// Copy the value in register A into the byte pointed by HL and increment HL afterwards.
func (cpu *CPU) LD_HLI_A() {
	HL := cpu.GetRegister16(R_HL)

	cpu.Memory.Write8(HL, cpu.GetRegister8(R_A))
	cpu.SetRegister16(R_HL, HL+1)
}

// LD [HLD],A
// Copy the value in register A into the byte pointed by HL and decrement HL afterwards.
func (cpu *CPU) LD_HLD_A() {
	HL := cpu.GetRegister16(R_HL)

	cpu.Memory.Write8(HL, cpu.GetRegister8(R_A))
	cpu.SetRegister16(R_HL, HL-1)
}

// LD A,[HLI]
// Copy the byte pointed to by HL into register A, and increment HL afterwards.
func (cpu *CPU) LD_A_HLI() {
	HL := cpu.GetRegister16(R_HL)

	cpu.SetRegister8(R_A, cpu.Memory.Read8(HL))
	cpu.SetRegister16(R_HL, HL+1)
}

// LD A,[HLD]
// Copy the byte pointed to by HL into register A, and decrement HL afterwards.
func (cpu *CPU) LD_A_HLD() {
	HL := cpu.GetRegister16(R_HL)

	cpu.SetRegister8(R_A, cpu.Memory.Read8(HL))
	cpu.SetRegister16(R_HL, HL-1)
}

// LD SP,HL
// Copy register HL into register SP.
func (cpu *CPU) LD_SP_HL() {
	cpu.SetRegister16(R_SP, cpu.GetRegister16(R_HL))
}

// LD [n16],SP
// Copy SP & $FF at address n16 and SP >> 8 at address n16 + 1.
func (cpu *CPU) LD_n16_SP() {
	addr := cpu.Memory.Read16(cpu.Registers.PC)
	cpu.Memory.Write16(addr, cpu.GetRegister16(R_SP))
	cpu.Registers.PC += 2
}

// ADD A,r8
// Add the value in r8 to A.
func (cpu *CPU) ADD_A_r8(r2 string) {
	A := cpu.GetRegister8(R_A)
	r8 := cpu.GetRegister8(r2)

	result := A + r8

	z := Bool2Int((result & 0xFF) == 0)
	h := Bool2Int((A&0xF)+(r8&0xF) >= 0x10)
	c := Bool2Int(uint16(A) + uint16(r8) >= 0xFF)

	cpu.SetFlags([4]int{z, 0, h, c})
	cpu.SetRegister8(R_A, result)
}

// SUB A,r8
// Subtract the value in r8 from A.
func (cpu *CPU) SUB_A_r8(r2 string) {
	A := cpu.GetRegister8(R_A)
	r8 := cpu.GetRegister8(r2)

	result := A - r8

	z := Bool2Int((result & 0xFF) == 0)
	h := Bool2Int(int(A&0xF)-int(r8&0xF) < 0)
	c := Bool2Int(int(A)-int(r8) < 0)

	cpu.SetFlags([4]int{z, 1, h, c})
	cpu.SetRegister8(R_A, result)
}

// AND A,r8
// Set A to the bitwise AND between the value in r8 and A.
func (cpu *CPU) AND_A_r8(r2 string) {
	result := cpu.GetRegister8(R_A) & cpu.GetRegister8(r2)
	cpu.SetRegister8(R_A, result)
	cpu.SetFlags([4]int{Bool2Int(result == 0), 0, 1, 0})
}

// OR A,r8
// Set A to the bitwise OR between the value in r8 and A.
func (cpu *CPU) OR_A_r8(r2 string) {
	result := cpu.GetRegister8(R_A) | cpu.GetRegister8(r2)
	cpu.SetRegister8(R_A, result)
	cpu.SetFlags([4]int{Bool2Int(result == 0), 0, 0, 0})
}

// XOR A,r8
// Set A to the bitwise XOR between the value in r8 and A.
func (cpu *CPU) XOR_A_r8(r2 string) {
	result := cpu.GetRegister8(R_A) ^ cpu.GetRegister8(r2)
	cpu.SetRegister8(R_A, result)
	cpu.SetFlags([4]int{Bool2Int(result == 0), 0, 0, 0})
}

// CP A,r8
// ComPare the value in A with the value in r8.
func (cpu *CPU) CP_A_r8(r2 string) {
	A := cpu.GetRegister8(R_A)
	r8 :=  cpu.GetRegister8(r2)
	result := int(A) - int(r8)

	z := Bool2Int(result == 0)
	h := Bool2Int((int(A&0x0F) - int(r8&0x0f)) < 0)
	c := Bool2Int(result < 0)

	cpu.SetFlags([4]int{z, 1, h, c})
}