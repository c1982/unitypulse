package main

import (
	"bytes"
	"encoding/binary"
)

func ReadBytes(buffer *bytes.Buffer) ([]byte, error) {
	var length int32
	err := binary.Read(buffer, binary.LittleEndian, &length)
	if err != nil {
		return nil, err
	}
	data := make([]byte, length)
	err = binary.Read(buffer, binary.LittleEndian, &data)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func ReadLongArray(buffer *bytes.Buffer) ([]int64, error) {
	var length int32
	err := binary.Read(buffer, binary.LittleEndian, &length)
	if err != nil {
		return nil, err
	}
	data := make([]int64, length)
	err = binary.Read(buffer, binary.LittleEndian, &data)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func ParsePulseSessionStart(data []byte) (*PulseSessionStart, error) {
	var err error
	buffer := bytes.NewBuffer(data)
	session := PulseSessionStart{}

	if err := binary.Read(buffer, binary.LittleEndian, &session.MsgType); err != nil {
		return nil, err
	}

	session.Session, err = ReadBytes(buffer)
	if err != nil {
		return nil, err
	}

	session.Identifier, err = ReadBytes(buffer)
	if err != nil {
		return nil, err
	}

	session.Version, err = ReadBytes(buffer)
	if err != nil {
		return nil, err
	}

	session.Platform, err = ReadBytes(buffer)
	if err != nil {
		return nil, err
	}

	session.Device, err = ReadBytes(buffer)
	if err != nil {
		return nil, err
	}

	return &session, nil
}

func ParsePulseSessionStop(data []byte) (*PulseSessionStop, error) {
	var err error
	buffer := bytes.NewBuffer(data)

	session := PulseSessionStop{}

	if err := binary.Read(buffer, binary.LittleEndian, &session.MsgType); err != nil {
		return nil, err
	}

	session.Session, err = ReadBytes(buffer)
	if err != nil {
		return nil, err
	}

	return &session, nil
}

func ParsePulseData(data []byte) (*PulseData, error) {
	buffer := bytes.NewBuffer(data)

	session := PulseData{}

	if err := binary.Read(buffer, binary.LittleEndian, &session.MsgType); err != nil {
		return nil, err
	}

	var err error
	session.Session, err = ReadBytes(buffer)
	if err != nil {
		return nil, err
	}

	session.CollectedData, err = ReadLongArray(buffer)
	if err != nil {
		return nil, err
	}

	return &session, nil
}
