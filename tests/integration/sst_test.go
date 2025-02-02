package integration

import (
	"encoding/json"
	"fmt"
	"os"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/souzaramon/LR35902"
	test_utils "github.com/souzaramon/LR35902/tests"
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
	op_codes := []string{
		"00", "01", "02", "06", "0a", "0e",
		"11", "12", "16", "1a", "1e",
		"21", "26", "2e",
		"3e",
		"40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f",
		"50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f",
		"60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f",
		"70", "71", "72", "73", "74", "75", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f",
	}

	for _, op_code := range op_codes {
		file, _ := os.ReadFile(fmt.Sprintf("./sst/v1/%s.json", op_code))

		var cases []Case
		err := json.Unmarshal(file, &cases)

		if err != nil {
			t.Errorf("JSON unmarshal failed")
		}

		for _, c := range cases[:1] {
			t.Run(c.Name, func(t *testing.T) {
				memory := test_utils.DummyMemory{Data: make([]uint8, 65536)}

				for _, item := range c.Initial.Ram {
					memory.Write8(item[0], byte(item[1]))
				}

				sut := LR35902.CPU{
					Memory: &memory,
					Registers: LR35902.Registers{
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

				expect := LR35902.Registers{
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
					t.Errorf("Expected \n\t%+v\n\n Got \n\t %+v", expect, sut.Registers)
				}
			})
		}
	}

}
