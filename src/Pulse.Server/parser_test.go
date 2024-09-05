package main

import (
	"bytes"
	"encoding/binary"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestReadBytes(t *testing.T) {
	buffer := new(bytes.Buffer)
	binary.Write(buffer, binary.LittleEndian, int32(4))       // length
	binary.Write(buffer, binary.LittleEndian, []byte("test")) // data

	data, err := ReadBytes(buffer)

	assert.Nil(t, err)
	assert.Equal(t, []byte("test"), data)
}

func TestReadBytesInvalidLength(t *testing.T) {
	buffer := new(bytes.Buffer)
	binary.Write(buffer, binary.LittleEndian, int32(-1)) // invalid length

	_, err := ReadBytes(buffer)

	assert.NotNil(t, err)
}

func TestReadLongArray(t *testing.T) {
	buffer := new(bytes.Buffer)
	binary.Write(buffer, binary.LittleEndian, int32(3))   // length
	binary.Write(buffer, binary.LittleEndian, int64(100)) // value 1
	binary.Write(buffer, binary.LittleEndian, int64(200)) // value 2
	binary.Write(buffer, binary.LittleEndian, int64(300)) // value 3

	data, err := ReadLongArray(buffer)

	assert.Nil(t, err)
	assert.Equal(t, []int64{100, 200, 300}, data)
}

func TestReadLongArrayInvalidLength(t *testing.T) {
	buffer := new(bytes.Buffer)
	binary.Write(buffer, binary.LittleEndian, int32(-1)) // invalid length

	_, err := ReadLongArray(buffer)

	assert.NotNil(t, err)
}

func TestParsePulseSessionStart(t *testing.T) {

	buffer := new(bytes.Buffer)
	binary.Write(buffer, binary.LittleEndian, uint8(1))       // MsgType
	binary.Write(buffer, binary.LittleEndian, int32(4))       // Session length
	binary.Write(buffer, binary.LittleEndian, []byte("sess")) // Session
	binary.Write(buffer, binary.LittleEndian, int32(4))       // Identifier length
	binary.Write(buffer, binary.LittleEndian, []byte("idnt")) // Identifier
	binary.Write(buffer, binary.LittleEndian, int32(4))       // Version length
	binary.Write(buffer, binary.LittleEndian, []byte("vers")) // Version
	binary.Write(buffer, binary.LittleEndian, int32(4))       // Platform length
	binary.Write(buffer, binary.LittleEndian, []byte("plat")) // Platform
	binary.Write(buffer, binary.LittleEndian, int32(4))       // Device length
	binary.Write(buffer, binary.LittleEndian, []byte("devc")) // Device

	data := buffer.Bytes()
	session, err := ParsePulseSessionStart(data)

	assert.Nil(t, err)
	assert.Equal(t, uint8(1), session.MsgType)
	assert.Equal(t, []byte("sess"), session.Session)
	assert.Equal(t, []byte("idnt"), session.Identifier)
	assert.Equal(t, []byte("vers"), session.Version)
	assert.Equal(t, []byte("plat"), session.Platform)
	assert.Equal(t, []byte("devc"), session.Device)
}

func TestParsePulseData(t *testing.T) {
	buffer := new(bytes.Buffer)
	binary.Write(buffer, binary.LittleEndian, uint8(1))       // MsgType
	binary.Write(buffer, binary.LittleEndian, int32(4))       // Session length
	binary.Write(buffer, binary.LittleEndian, []byte("sess")) // Session
	binary.Write(buffer, binary.LittleEndian, int32(2))       // Array length
	binary.Write(buffer, binary.LittleEndian, int64(123))     // Array value 1
	binary.Write(buffer, binary.LittleEndian, int64(456))     // Array value 2

	data, err := ParsePulseData(buffer.Bytes())

	assert.Nil(t, err)
	assert.Equal(t, uint8(1), data.MsgType)
	assert.Equal(t, []byte("sess"), data.Session)
	assert.Equal(t, []int64{123, 456}, data.CollectedData)
}

func TestParsePulseCustomData(t *testing.T) {
	expectedMsgType := uint8(1)
	expectedSession := []byte("TestSession")
	expectedKey := []byte("TestKey")
	expectedValue := int64(12345)

	buffer := new(bytes.Buffer)

	binary.Write(buffer, binary.LittleEndian, expectedMsgType)

	sessionLength := int32(len(expectedSession))
	binary.Write(buffer, binary.LittleEndian, sessionLength)
	binary.Write(buffer, binary.LittleEndian, expectedSession)

	keyLength := int32(len(expectedKey))
	binary.Write(buffer, binary.LittleEndian, keyLength)
	binary.Write(buffer, binary.LittleEndian, expectedKey)

	binary.Write(buffer, binary.LittleEndian, expectedValue)

	data := buffer.Bytes()
	result, err := ParsePulseCustomData(data)

	assert.Nil(t, err)
	assert.Equal(t, expectedMsgType, result.MsgType)
	assert.Equal(t, expectedSession, result.Session)
	assert.Equal(t, expectedKey, result.Key)
	assert.Equal(t, expectedValue, result.Value)
}
