package main

type DummyMemory struct {
	Data []uint8
}

func (m *DummyMemory) Read8(addr uint16) byte {
	return m.Data[addr]
}

func (m *DummyMemory) Write8(addr uint16, value byte) {
	m.Data[addr] = value
}

func (m *DummyMemory) Read16(addr uint16) uint16 {
	lo := m.Data[addr]
	hi := m.Data[addr+1]

	return uint16(lo) | (uint16(hi) << 8)
}

func (m *DummyMemory) Write16(addr uint16, value uint16) {
	m.Write8(addr+1, uint8((value>>8)&0xFF))
	m.Write8(addr, uint8(value&0xFF))
}
