package sm83

import (
	"testing"
)

func TestGetNth(t *testing.T) {
	cases := []struct {
		name     string
		i        int
		value    byte
		expected bool
	}{
		{
			name:     "Get bit at 7",
			i:        7,
			value:    0b10000000,
			expected: true,
		},
		{

			name:     "Get bit at 6",
			i:        6,
			value:    0b10000000,
			expected: false,
		},
	}

	for _, c := range cases {
		data := GetNthBit(c.value, c.i)

		if data != c.expected {
			t.Fatalf(`GetNthBit(%b, %d) = %t, want %t`, c.value, c.i, data, c.expected)
		}
	}
}

func TestSetNth(t *testing.T) {
	cases := []struct {
		name     string
		i        int
		v        bool
		value    byte
		expected byte
	}{
		{
			name:     "Set bit at 0",
			i:        0,
			v:        true,
			value:    0b10000000,
			expected: 0b10000001,
		},
		{

			name:     "Set bit at 1",
			i:        1,
			v:        false,
			value:    0b10000010,
			expected: 0b10000000,
		},
	}

	for _, c := range cases {
		data := SetNthBit(c.value, c.i, c.v)

		if data != c.expected {
			t.Fatalf(`SetNthBit(%b, %d, %t) = %b, want %b`, c.value, c.i, c.v, data, c.expected)
		}
	}
}
