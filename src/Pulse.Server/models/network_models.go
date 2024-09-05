package models

type PulseSessionStart struct {
	MsgType    byte
	Session    []byte
	Identifier []byte
	Version    []byte
	Platform   []byte
	Device     []byte
}

type PulseSessionStop struct {
	MsgType byte
	Session []byte
}

type PulseData struct {
	MsgType       byte
	Session       []byte
	CollectedData []int64
}

type PulseCustomData struct {
	MsgType byte
	Session []byte
	Key     []byte
	Value   int64
	Time    int64
}
