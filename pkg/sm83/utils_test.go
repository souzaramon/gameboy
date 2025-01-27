package sm83

import "testing"

func TestGetNth(t *testing.T) {
	cases := [][3]interface{}{
		// byte, nth, expected
		{byte(0xFF), 1, true},
		{byte(0x00), 1, false},
	}

	for _, c := range cases {
		data := GetNthBit(c[0].(byte), c[1].(int))
		expected := c[2].(bool)

		if data != expected {
			t.Fatalf(`GetNthBit(%#v, %d) = %t, want %t`, c[0], c[1], data, expected)
		}
	}
}

func TestSetNth(t *testing.T) {
	cases := [][4]interface{}{
		// byte, nth, value, expected
		{byte(0x00), 7, true, byte(0x80)},
		{byte(0x80), 7, false, byte(0x00)},
	}

	for _, c := range cases {
		data := SetNthBit(c[0].(byte), c[1].(int), c[2].(bool))
		expected := c[3].(byte)

		if data != expected {
			t.Fatalf(`SetNthBit(%#v, %d, %t) = %#v, want %#v`, c[0], c[1], c[2], data, expected)
		}
	}
}
