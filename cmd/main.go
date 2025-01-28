package main

import (
	"fmt"
	"os"

	"github.com/souzaramon/sm83"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Error: go run ./cmd/main.go <path>")
		os.Exit(1)
	}

	rom_data, err := os.ReadFile(os.Args[1])

	if err != nil {
		fmt.Println("Error: unable to open file")
		os.Exit(1)
	}

	memory := DummyMemory{Data: rom_data}

	cpu := sm83.CPU{
		Registers: sm83.Registers{
			A:  0x00,
			F:  0x00,
			B:  0x00,
			C:  0x00,
			D:  0x00,
			E:  0x00,
			H:  0x00,
			L:  0x00,
			PC: 0x100,
			SP: 0x00,
		},
		Memory: &memory,
	}

	for {
		cpu.Step()
	}
}
