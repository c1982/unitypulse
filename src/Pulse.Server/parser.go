package main

import (
	"bytes"
	"encoding/binary"
	"fmt"

	"Pulse.Server/models"
)

func ReadBytes(buffer *bytes.Buffer) ([]byte, error) {
	var length int32
	err := binary.Read(buffer, binary.LittleEndian, &length)
	if err != nil {
		return nil, err
	}

	if length < 0 {
		return nil, fmt.Errorf("invalid length: %d", length)
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
	if length < 0 {
		return nil, fmt.Errorf("invalid length: %d", length)
	}
	data := make([]int64, length)
	err = binary.Read(buffer, binary.LittleEndian, &data)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func ParsePulseSessionStart(data []byte) (*models.PulseSessionStart, error) {
	var err error
	buffer := bytes.NewBuffer(data)
	session := models.PulseSessionStart{}

	if err = binary.Read(buffer, binary.LittleEndian, &session.MsgType); err != nil {
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

func ParsePulseSessionStop(data []byte) (*models.PulseSessionStop, error) {
	var err error
	buffer := bytes.NewBuffer(data)

	session := models.PulseSessionStop{}

	if err = binary.Read(buffer, binary.LittleEndian, &session.MsgType); err != nil {
		return nil, err
	}

	session.Session, err = ReadBytes(buffer)
	if err != nil {
		return nil, err
	}

	return &session, nil
}

func ParsePulseData(data []byte) (*models.PulseData, error) {
	var err error
	buffer := bytes.NewBuffer(data)
	session := models.PulseData{}

	if err = binary.Read(buffer, binary.LittleEndian, &session.MsgType); err != nil {
		return nil, err
	}

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

func ParsePulseCustomData(data []byte) (*models.PulseCustomData, error) {
	buffer := bytes.NewReader(data)

	customData := models.PulseCustomData{}

	if err := binary.Read(buffer, binary.LittleEndian, &customData.MsgType); err != nil {
		return nil, err
	}

	var sessionLength int32
	if err := binary.Read(buffer, binary.LittleEndian, &sessionLength); err != nil {
		return nil, err
	}

	customData.Session = make([]byte, sessionLength)
	if err := binary.Read(buffer, binary.LittleEndian, &customData.Session); err != nil {
		return nil, err
	}

	var keyLength int32
	if err := binary.Read(buffer, binary.LittleEndian, &keyLength); err != nil {
		return nil, err
	}

	customData.Key = make([]byte, keyLength)
	if err := binary.Read(buffer, binary.LittleEndian, &customData.Key); err != nil {
		return nil, err
	}

	if err := binary.Read(buffer, binary.LittleEndian, &customData.Value); err != nil {
		return nil, err
	}

	return &customData, nil
}
