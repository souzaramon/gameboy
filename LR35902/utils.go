package LR35902

func GetNthBit(b byte, n int) bool {
	return b&(byte(1)<<n) != 0
}

func SetNthBit(b byte, n int, v bool) byte {
	if v {
		return b | (byte(1) << n)
	} else {
		return b & ^(byte(1) << n)
	}
}

func Bool2Int(b bool) int {
	// ISSUE 6011: The compiler currently only optimizes this form.
	var i int
	if b {
		i = 1
	} else {
		i = 0
	}
	return i
}
