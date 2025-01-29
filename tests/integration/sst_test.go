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
		"c3.json",
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
					t.Errorf("Expected \n\t%+v\n\n Got \n\t %+v", expect, sut.Registers)
				}
			})
		}
	}

}
