package main

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
