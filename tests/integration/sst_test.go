package integration

import (
	"encoding/json"
	"fmt"
	"os"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/souzaramon/sm83"
	utils "github.com/souzaramon/sm83/tests"
)

type CPUState struct {
	Name string      `json:"name"`
	PC   uint16      `json:"pc"`
	SP   uint16      `json:"sp"`
	A    byte        `json:"a"`
	B    byte        `json:"b"`
	C    byte        `json:"c"`
	D    byte        `json:"d"`
	E    byte        `json:"e"`
	F    byte        `json:"f"`
	H    byte        `json:"h"`
	L    byte        `json:"l"`
	Ram  [][2]uint16 `json:"ram"`
	// IME  int      `json:"ime"`
	// IE   int      `json:"ie"`
}

type Case struct {
	Name    string   `json:"name"`
	Initial CPUState `json:"initial"`
	Final   CPUState `json:"final"`
}

func TestSingleStepTests(t *testing.T) {
	file_names := []string{
		"00.json",
		"01.json",
		"02.json",
		"06.json",
		"11.json",
		"16.json",
		"21.json",
		"26.json",
		"31.json",
		"40.json",
		"41.json",
		"42.json",
		"43.json",
		"44.json",
		"45.json",
		"47.json",
		"48.json",
		"49.json",
		"4a.json",
		"4b.json",
		"4c.json",
		"4d.json",
		"4f.json",
		"50.json",
		"51.json",
		"52.json",
		"53.json",
		"54.json",
		"55.json",
		"57.json",
		"58.json",
		"59.json",
		"5a.json",
		"5b.json",
		"5c.json",
		"5d.json",
		"5f.json",
		"60.json",
		"61.json",
		"62.json",
		"63.json",
		"64.json",
		"65.json",
		"67.json",
		"68.json",
		"69.json",
		"6a.json",
		"6b.json",
		"6c.json",
		"6d.json",
		"6f.json",
		"79.json",
		"7a.json",
		"7b.json",
		"7c.json",
		"7d.json",
		"78.json",
		"7f.json",
		"c2.json",
		"c3.json",
		"ca.json",
		"d2.json",
		"da.json",
		"e9.json",
	}

	for _, file_name := range file_names {
		file, _ := os.ReadFile(fmt.Sprintf("./sst/v1/%s", file_name))

		var cases []Case
		err := json.Unmarshal(file, &cases)

		if err != nil {
			t.Errorf("JSON unmarshal failed")
		}

		for _, c := range cases {
			t.Run(c.Name, func(t *testing.T) {
				memory := utils.DummyMemory{Data: make([]uint8, 65536)}

				for _, item := range c.Initial.Ram {
					memory.Write8(item[0], byte(item[1]))
				}

				sut := sm83.CPU{
					Memory: &memory,
					Registers: sm83.Registers{
						A:  c.Initial.A,
						F:  c.Initial.F,
						B:  c.Initial.B,
						C:  c.Initial.C,
						D:  c.Initial.D,
						E:  c.Initial.E,
						H:  c.Initial.H,
						L:  c.Initial.L,
						PC: c.Initial.PC,
						SP: c.Initial.SP,
					}}

				expect := sm83.Registers{
					A:  c.Final.A,
					F:  c.Final.F,
					B:  c.Final.B,
					C:  c.Final.C,
					D:  c.Final.D,
					E:  c.Final.E,
					H:  c.Final.H,
					L:  c.Final.L,
					PC: c.Final.PC,
					SP: c.Final.SP,
				}

				sut.Step()

				if !cmp.Equal(sut.Registers, expect) {
					t.Logf("CPU Data 0x%02X", sut.Data)
					// t.Errorf("Expected (B %b, C %b) Got: (B %b, C %b), Data %b", expect.B, expect.C, sut.Registers.B, sut.Registers.C, sut.Data)
					t.Errorf("Expected \n\t%+v\n\n Got \n\t %+v", expect, sut.Registers)
				}
			})
		}
	}

}
