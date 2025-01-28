package sm83test

import (
	"testing"

	"github.com/souzaramon/SM83/pkg/sm83"
)

func TestSetFlags(t *testing.T) {
	cases := []struct {
		name     string
		z        int
		n        int
		h        int
		c        int
		initial  uint8
		expected uint8
	}{
		{
			name:     "Set all flags to 1",
			z:        1,
			n:        1,
			h:        1,
			c:        1,
			initial:  0b00000000,
			expected: 0b11110000,
		},
		{
			name:     "Leave flags unchanged",
			z:        -1,
			n:        -1,
			h:        -1,
			c:        -1,
			initial:  0b10100000,
			expected: 0b10100000,
		},
		{
			name:     "Mixed flags",
			z:        0,
			n:        -1,
			h:        1,
			c:        0,
			initial:  0b11110000,
			expected: 0b01100000,
		},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			sut := sm83.SM83{Registers: sm83.Registers{F: c.initial}}
			sut.WriteFlags([4]int{c.z, c.n, c.h, c.c})

			if sut.Registers.F != c.expected {
				t.Errorf(
					"F register incorrect\nGot:  0b%08b\nWant: 0b%08b",
					sut.Registers.F,
					c.expected,
				)
			}
		})
	}
}
