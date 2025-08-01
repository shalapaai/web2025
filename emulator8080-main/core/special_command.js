const SpecialCommands = {
  0x09: { // DAD B
    cycles: 10,
    execute: (cpu, bytes) => {
      const rp = (bytes[0] >> 4) & 0x03; // Определяем регистровую пару (B=0, D=1, H=2, SP=3)
      
      switch(cpu.currentCycle) {
        case 1:
          handleHighlighting(executionState.currentCycle, executionState.currentCommandRow, executionState.commandLength);
          cpu.setPC(executionState.nextCommandRow);
          break;
              
        case 2:
          updateAddressBuffer(cpu.registers.PC);
          break;
            
        case 3:
          updateDataBuffer(toHex(bytes[0], 2));
          break;
            
        case 4:
          currentCommandHex.textContent = `Рег. команд: ${toHex(bytes[0], 2)}`;
          currentCommandText.textContent = `Д/Ш команд: ${getCommandText(bytes[0])}`;
          break;
              
        case 5:
          // Загрузка младшего байта регистровой пары в буферный регистр 1 (C для DAD B)
          if (rp === 0) cpu.setBufReg1(cpu.registers.C);      // DAD B
          else if (rp === 1) cpu.setBufReg1(cpu.registers.E); // DAD D
          else if (rp === 2) cpu.setBufReg1(cpu.registers.L); // DAD H
          else if (rp === 3) cpu.setBufReg1(cpu.registers.SP & 0xFF); // DAD SP
          break;
              
        case 6:
          // Загрузка младшего байта HL (L) в буферный регистр 2
          cpu.setBufReg2(cpu.registers.L);
          break;
              
        case 7:
          // Сложение младших байтов: L = L + src_low (C для DAD B)
          const sumLow = cpu.bufReg2 + cpu.bufReg1;
          cpu.registers.L = sumLow & 0xFF;
          cpu.flags.C = sumLow > 0xFF ? 1 : 0;
          break;
              
        case 8:
          // Загрузка старшего байта регистровой пары в буферный регистр 1 (B для DAD B)
          if (rp === 0) cpu.setBufReg1(cpu.registers.B);      // DAD B
          else if (rp === 1) cpu.setBufReg1(cpu.registers.D); // DAD D
          else if (rp === 2) cpu.setBufReg1(cpu.registers.H); // DAD H
          else if (rp === 3) cpu.setBufReg1((cpu.registers.SP >> 8) & 0xFF); // DAD SP
          break;
              
        case 9:
          // Загрузка старшего байта HL (H) в буферный регистр 2
          cpu.setBufReg2(cpu.registers.H);
          break;
              
        case 10:
          // Сложение старших байтов: H = H + src_high + carry (B для DAD B)
          const sumHigh = cpu.bufReg2 + cpu.bufReg1 + (cpu.flags.C ? 1 : 0);
          cpu.registers.H = sumHigh & 0xFF;
          cpu.flags.C = sumHigh > 0xFF ? 1 : cpu.flags.C;
          break;
      }
    }
  },
  0x19: { // DAD D
    cycles: 10,
    execute: (cpu, bytes) => SpecialCommands[0x09].execute(cpu, bytes)
  },
  0x29: { // DAD H
    cycles: 10,
    execute: (cpu, bytes) => {
      switch(cpu.currentCycle) {
        case 1:
          handleHighlighting(executionState.currentCycle, executionState.currentCommandRow, executionState.commandLength);
          cpu.setPC(executionState.nextCommandRow);
          break;
        
        case 2:
          updateAddressBuffer(cpu.registers.PC);
          break;
            
        case 3:
          updateDataBuffer(toHex(bytes[0], 2));
          break;
            
        case 4:
          currentCommandHex.textContent = `Рег. команд: ${toHex(bytes[0], 2)}`;
          currentCommandText.textContent = `Д/Ш команд: ${getCommandText(bytes[0])}`;
          break;
              
        case 5:
          // Загрузка L в буферный регистр 1
          cpu.setBufReg1(cpu.registers.L);
          break;
              
        case 6:
          // Загрузка L в буферный регистр 2
          cpu.setBufReg2(cpu.registers.L);
          break;
              
        case 7:
          // Удвоение младшего байта: L = L + L
          const sumLow = cpu.bufReg1 + cpu.bufReg2;
          cpu.registers.L = sumLow & 0xFF;
          cpu.flags.C = sumLow > 0xFF ? 1 : 0;
          break;
              
        case 8:
          // Загрузка H в буферный регистр 1
          cpu.setBufReg1(cpu.registers.H);
          break;
              
        case 9:
          // Загрузка H в буферный регистр 2
          cpu.setBufReg2(cpu.registers.H);
          break;
              
        case 10:
          // Удвоение старшего байта: H = H + H + carry
          const sumHigh = cpu.bufReg1 + cpu.bufReg2 + (cpu.flags.C ? 1 : 0);
          cpu.registers.H = sumHigh & 0xFF;
          cpu.flags.C = sumHigh > 0xFF ? 1 : cpu.flags.C;
          break;
      }
    }
  },
  0x39: { // DAD SP
    cycles: 10,
    execute: (cpu, bytes) => SpecialCommands[0x09].execute(cpu, bytes)
  },
  0x12: { // STAX D
    cycles: 7,
    execute: (cpu, bytes) => {
      switch(cpu.currentCycle) {
        case 1:
          handleHighlighting(executionState.currentCycle, executionState.currentCommandRow, executionState.commandLength);
          cpu.setPC(executionState.nextCommandRow);
          break;
        
        case 2:
          updateAddressBuffer(cpu.registers.PC);
          break;
            
        case 3:
          updateDataBuffer(toHex(bytes[0], 2));
          break;
            
        case 4:
          currentCommandHex.textContent = `Рег. команд: ${toHex(bytes[0], 2)}`;
          currentCommandText.textContent = `Д/Ш команд: ${getCommandText(bytes[0])}`;
          break;
              
        case 5:
          // Формируем адрес из пары DE
          const addrDE = (cpu.registers.D << 8) | cpu.registers.E;
          updateAddressBuffer(addrDE);
          break;
              
        case 6:
          // Помещаем значение A в буфер данных
          updateDataBuffer(toHex(cpu.registers.A, 2));
          break;
              
        case 7:
          // Записываем A по адресу из DE
          const address = (cpu.registers.D << 8) | cpu.registers.E;
          cpu.writeMemory(address, cpu.registers.A);
          break;
      }
    }
  },
  0x22: { // SHLD a16
    cycles: 15,
    execute: (cpu, bytes) => {
      switch(cpu.currentCycle) {
        case 1:
          handleHighlighting(executionState.currentCycle, executionState.currentCommandRow, executionState.commandLength);
          cpu.setPC(executionState.nextCommandRow);
          break;
        
        case 2:
          updateAddressBuffer(cpu.registers.PC);
          break;
            
        case 3:
          updateDataBuffer(toHex(bytes[0], 2));
          break;
            
        case 4:
          currentCommandHex.textContent = `Рег. команд: ${toHex(bytes[0], 2)}`;
          currentCommandText.textContent = `Д/Ш команд: ${getCommandText(bytes[0])}`;
          break;
              
        case 5:
          executionState.nextCommandRow++;
          updateProgramCounter(executionState.nextCommandRow);
          break;
              
        case 6:
          updateAddressBuffer(cpu.registers.PC);
          break;
              
        case 7:
          const lowAddr = bytes[1];
          updateDataBuffer(toHex(lowAddr, 2));
          cpu.registers.Z = lowAddr;
          break;
              
        case 8:
          executionState.nextCommandRow++;
          updateProgramCounter(executionState.nextCommandRow);
          break;
              
        case 9:
          updateAddressBuffer(cpu.registers.PC);
          break;
              
        case 10:
          const highAddr = bytes[2];
          updateDataBuffer(toHex(highAddr, 2));
          cpu.registers.W = highAddr;
          break;
              
        case 11:
          // Формируем адрес из WZ
          const address = (cpu.registers.W << 8) | cpu.registers.Z;
          updateAddressBuffer(address);
          break;
              
        case 12:
          // Используем адрес из WZ
          const currentAddr = (cpu.registers.W << 8) | cpu.registers.Z;
          updateDataBuffer(toHex(cpu.registers.L, 2));
          cpu.writeMemory(currentAddr, cpu.registers.L);
          break;
              
        case 13:
          // Инкремент WZ
          cpu.registers.Z = (cpu.registers.Z + 1) & 0xFF;
          if (cpu.registers.Z === 0) {
            cpu.registers.W = (cpu.registers.W + 1) & 0xFF;
          }
          const nextAddr = (cpu.registers.W << 8) | cpu.registers.Z;
          updateAddressBuffer(nextAddr);
          break;
              
        case 14:
          // Используем новый адрес после инкремента
          const updatedAddr = (cpu.registers.W << 8) | cpu.registers.Z;
          updateAddressBuffer(updatedAddr);
          break;
              
        case 15:
          // Записываем H по новому адресу
          const finalAddr = (cpu.registers.W << 8) | cpu.registers.Z;
          updateDataBuffer(toHex(cpu.registers.H, 2));
          cpu.writeMemory(finalAddr, cpu.registers.H);
          break;
      }
    }
  },
  0x32: { // STA a16
    cycles: 12,
    execute: (cpu, bytes) => {
      switch(cpu.currentCycle) {
        case 1:
          handleHighlighting(executionState.currentCycle, executionState.currentCommandRow, executionState.commandLength);
          cpu.setPC(executionState.nextCommandRow);
          break;
        
        case 2:
          updateAddressBuffer(cpu.registers.PC);
          break;
            
        case 3:
          updateDataBuffer(toHex(bytes[0], 2));
          break;
            
        case 4:
          currentCommandHex.textContent = `Рег. команд: ${toHex(bytes[0], 2)}`;
          currentCommandText.textContent = `Д/Ш команд: ${getCommandText(bytes[0])}`;
          break;
              
        case 5:
          // Инкремент PC и обновление UI
          executionState.nextCommandRow++;
          updateProgramCounter(executionState.nextCommandRow);
          break;
              
        case 6:
          updateAddressBuffer(cpu.registers.PC);
          break;
              
        case 7:
          const lowAddr = bytes[1];
          updateDataBuffer(toHex(lowAddr, 2));
          cpu.registers.Z = lowAddr;
          break;
              
        case 8:
          // Инкремент PC и обновление UI
          executionState.nextCommandRow++;
          updateProgramCounter(executionState.nextCommandRow);
          break;
              
        case 9:
          updateAddressBuffer(cpu.registers.PC);
          break;
              
        case 10:
          const highAddr = bytes[2];
          updateDataBuffer(toHex(highAddr, 2));
          cpu.registers.W = highAddr;
          break;
              
        case 11:
          // Формируем адрес из WZ
          const addr = (cpu.registers.W << 8) | cpu.registers.Z;
          updateAddressBuffer(addr);
          break;
              
        case 12:
          // Вычисляем адрес заново для гарантии актуальности
          const writeAddr = (cpu.registers.W << 8) | cpu.registers.Z;
          updateDataBuffer(toHex(cpu.registers.A, 2));
          cpu.writeMemory(writeAddr, cpu.registers.A);
          break;
      }
    }
  },
  0x0A: { // LDAX B
    cycles: 6,
    execute: (cpu, bytes) => {
      switch(cpu.currentCycle) {
        case 1:
          handleHighlighting(executionState.currentCycle, executionState.currentCommandRow, executionState.commandLength);
          cpu.setPC(executionState.nextCommandRow);
          break;

        case 2:
          updateAddressBuffer(cpu.registers.PC);
          break;

        case 3:
          updateDataBuffer(toHex(bytes[0], 2));
          break;

        case 4:
          currentCommandHex.textContent = `Рег. команд: ${toHex(bytes[0], 2)}`;
          currentCommandText.textContent = `Д/Ш команд: ${getCommandText(bytes[0])}`;
          break;

        case 5:
          // Формируем адрес из регистра B и C (BC)
          const addrBC = (cpu.registers.B << 8) | cpu.registers.C;
          updateAddressBuffer(addrBC);
          break;

        case 6:
          // Читаем память по адресу из BC и заносим в регистр A
          const valueBC = cpu.readMemory((cpu.registers.B << 8) | cpu.registers.C);
          updateDataBuffer(toHex(valueBC, 2));
          cpu.registers.A = valueBC;
          break;
      }
    }
  },

  0x1A: { // LDAX D
    cycles: 6,
    execute: (cpu, bytes) => {
      switch(cpu.currentCycle) {
        case 1:
          handleHighlighting(executionState.currentCycle, executionState.currentCommandRow, executionState.commandLength);
          cpu.setPC(executionState.nextCommandRow);
          break;

        case 2:
          updateAddressBuffer(cpu.registers.PC);
          break;

        case 3:
          updateDataBuffer(toHex(bytes[0], 2));
          break;

        case 4:
          currentCommandHex.textContent = `Рег. команд: ${toHex(bytes[0], 2)}`;
          currentCommandText.textContent = `Д/Ш команд: ${getCommandText(bytes[0])}`;
          break;

        case 5:
          // Формируем адрес из регистра D и E (DE)
          const addrDE = (cpu.registers.D << 8) | cpu.registers.E;
          updateAddressBuffer(addrDE);
          break;

        case 6:
          // Читаем память по адресу из DE и заносим в регистр A
          const valueDE = cpu.readMemory((cpu.registers.D << 8) | cpu.registers.E);
          updateDataBuffer(toHex(valueDE, 2));
          cpu.registers.A = valueDE;
          break;
      }
    }
  },
  0x2A: { // LHLD a16
    cycles: 15,
    execute: (cpu, bytes) => {
      switch(cpu.currentCycle) {
        case 1:
          handleHighlighting(executionState.currentCycle, executionState.currentCommandRow, executionState.commandLength);
          cpu.setPC(executionState.nextCommandRow);
          break;

        case 2:
          updateAddressBuffer(cpu.registers.PC);
          break;

        case 3:
          updateDataBuffer(toHex(bytes[0], 2));
          break;

        case 4:
          currentCommandHex.textContent = `Рег. команд: ${toHex(bytes[0], 2)}`;
          currentCommandText.textContent = `Д/Ш команд: ${getCommandText(bytes[0])}`;
          break;

        case 5:
          executionState.nextCommandRow++;
          updateProgramCounter(executionState.nextCommandRow);
          break;

        case 6:
          updateAddressBuffer(cpu.registers.PC);
          break;

        case 7:
          const lowAddr = bytes[1];
          updateDataBuffer(toHex(lowAddr, 2));
          cpu.registers.Z = lowAddr;
          break;

        case 8:
          executionState.nextCommandRow++;
          updateProgramCounter(executionState.nextCommandRow);
          break;

        case 9:
          updateAddressBuffer(cpu.registers.PC);
          break;

        case 10:
          const highAddr = bytes[2];
          updateDataBuffer(toHex(highAddr, 2));
          cpu.registers.W = highAddr;
          break;

        case 11:
          updateAddressBuffer((cpu.registers.W << 8) | cpu.registers.Z);
          break;

        case 12:
          // Читаем младший байт из памяти по адресу WZ в регистр L
          const lowByte = cpu.readMemory((cpu.registers.W << 8) | cpu.registers.Z);
          updateDataBuffer(toHex(lowByte, 2));
          cpu.registers.L = lowByte;
          break;

        case 13:
          // Инкремент WZ (Z + 1, при переполнении увеличиваем W)
          cpu.registers.Z = (cpu.registers.Z + 1) & 0xFF;
          if (cpu.registers.Z === 0) {
            cpu.registers.W = (cpu.registers.W + 1) & 0xFF;
          }
          const nextAddr = (cpu.registers.W << 8) | cpu.registers.Z;
          updateAddressBuffer(nextAddr);
          break;

        case 14:
          updateAddressBuffer((cpu.registers.W << 8) | cpu.registers.Z);
          break;

        case 15:
          // Читаем старший байт из памяти по адресу WZ в регистр H
          const highByteVal = cpu.readMemory((cpu.registers.W << 8) | cpu.registers.Z);
          updateDataBuffer(toHex(highByteVal, 2));
          cpu.registers.H = highByteVal;
          break;
      }
    }
  },

  0x3A: { // LDA a16
    cycles: 12,
    execute: (cpu, bytes) => {
      switch(cpu.currentCycle) {
        case 1:
          handleHighlighting(executionState.currentCycle, executionState.currentCommandRow, executionState.commandLength);
          cpu.setPC(executionState.nextCommandRow);
          break;

        case 2:
          updateAddressBuffer(cpu.registers.PC);
          break;

        case 3:
          updateDataBuffer(toHex(bytes[0], 2));
          break;

        case 4:
          currentCommandHex.textContent = `Рег. команд: ${toHex(bytes[0], 2)}`;
          currentCommandText.textContent = `Д/Ш команд: ${getCommandText(bytes[0])}`;
          break;

        case 5:
          executionState.nextCommandRow++;
          updateProgramCounter(executionState.nextCommandRow);
          break;

        case 6:
          updateAddressBuffer(cpu.registers.PC);
          break;

        case 7:
          const lowByte = bytes[1];
          updateDataBuffer(toHex(lowByte, 2));
          cpu.registers.Z = lowByte;
          break;

        case 8:
          executionState.nextCommandRow++;
          updateProgramCounter(executionState.nextCommandRow);
          break;

        case 9:
          updateAddressBuffer(cpu.registers.PC);
          break;

        case 10:
          const highByte = bytes[2];
          updateDataBuffer(toHex(highByte, 2));
          cpu.registers.W = highByte;
          break;

        case 11:
          updateAddressBuffer((cpu.registers.W << 8) | cpu.registers.Z);
          break;

        case 12:
          // Читаем из памяти по адресу WZ и записываем в регистр A
          const value = cpu.readMemory((cpu.registers.W << 8) | cpu.registers.Z);
          updateDataBuffer(toHex(value, 2));
          cpu.registers.A = value;
          break;
      }
    }
  },
  // PUSH B
  0xC5: {
    cycles: 10,
    execute: (cpu, bytes) => executePush(cpu, bytes, 'B', 'C')
  },
  // PUSH D
  0xD5: {
    cycles: 10,
    execute: (cpu, bytes) => executePush(cpu, bytes, 'D', 'E')
  },
  // PUSH H
  0xE5: {
    cycles: 10,
    execute: (cpu, bytes) => executePush(cpu, bytes, 'H', 'L')
  },
  // PUSH PSW
  0xF5: {
    cycles: 10,
    execute: (cpu, bytes) => executePush(cpu, bytes, 'A', null, getPSWValue)
  },
  // POP B
  0xC1: {
    cycles: 11,
    execute: (cpu, bytes) => executePop(cpu, bytes, 'C', 'B')
  },
  
  // POP D
  0xD1: {
    cycles: 11,
    execute: (cpu, bytes) => executePop(cpu, bytes, 'E', 'D')
  },
  
  // POP H
  0xE1: {
    cycles: 11,
    execute: (cpu, bytes) => executePop(cpu, bytes, 'L', 'H')
  },
  
  // POP PSW
  0xF1: {
    cycles: 11,
    execute: (cpu, bytes) => executePopPSW(cpu, bytes)
  },
  0xE3: { // XTHL
    cycles: 18,
    execute: (cpu, bytes) => {
      switch(cpu.currentCycle) {
        case 1:
          handleHighlighting(executionState.currentCycle, executionState.currentCommandRow, executionState.commandLength);
          cpu.setPC(executionState.nextCommandRow);
          break;
            
        case 2:
          updateAddressBuffer(cpu.registers.PC);
          break;
            
        case 3:
          updateDataBuffer(toHex(bytes[0], 2));
          break;
            
        case 4:
          currentCommandHex.textContent = `Рег. команд: ${toHex(bytes[0], 2)}`;
          currentCommandText.textContent = `Д/Ш команд: ${getCommandText(bytes[0])}`;
          break;
            
        case 5:
          // SP + 1 (подготовка к чтению старшего байта)
          cpu.registers.SP = (cpu.registers.SP + 1) & 0xFFFF;
          break;
            
        case 6:
          updateAddressBuffer(cpu.registers.SP);
          break;
            
        case 7:
          // Чтение старшего байта
          updateDataBuffer(toHex(cpu.readMemory(cpu.registers.SP + 1), 2));
          break;
            
        case 8:
          // Сохранение SP+1 в W (временное)
          cpu.registers.SP = (cpu.registers.SP + 1) & 0xFFFF;
          cpu.registers.W = cpu.readMemory(cpu.registers.SP - 1); // Сохраняем в W
          break;
            
        case 9:
          updateAddressBuffer(cpu.registers.SP);
          break;
            
        case 10:
          // Чтение младшего байта
          updateDataBuffer(toHex(cpu.readMemory(cpu.registers.SP), 2));
          break;
            
        case 11:
          cpu.registers.Z = cpu.readMemory(cpu.registers.SP); // Сохраняем в Z
          break;
            
        case 12:
          updateAddressBuffer(cpu.registers.SP);
          break;
            
        case 13:
          // Запись H в стек
          updateDataBuffer(toHex(cpu.registers.H, 2));
          cpu.writeMemory(cpu.registers.SP, cpu.registers.H);
          break;
            
        case 14:
          // Декремент SP (хотя команда обычно не меняет SP, но по вашей схеме)
          cpu.registers.SP = (cpu.registers.SP - 1) & 0xFFFF;
          break;
            
        case 15:
          updateAddressBuffer(cpu.registers.SP);
          break;
            
        case 16:
          // Запись L в стек
          updateDataBuffer(toHex(cpu.registers.L, 2));
          cpu.writeMemory(cpu.registers.SP, cpu.registers.L);
          break;
            
        case 17:
          // Декремент SP и обновление H
          cpu.registers.SP = (cpu.registers.SP - 1) & 0xFFFF;
          cpu.registers.H = cpu.registers.W;
          break;
            
        case 18:
          // Обновление L
          cpu.registers.L = cpu.registers.Z;
          break;
      }
    }
  }
}
    
// Функция для проверки, является ли команда специальной
function isSpecialCommand(opcode) {
  return SpecialCommands.hasOwnProperty(opcode);
}

// Функция для выполнения специальной команды
function executeSpecialCommand(cpu, bytes) {
  const opcode = bytes[0];
  const command = SpecialCommands[opcode];

  if (command) {
    command.execute(cpu, bytes);
    cpu.currentCycle++;
    
    if (cpu.currentCycle > command.cycles) {
      cpu.currentCycle = 1;
      return true;
    }
    return false;
  }
}

// Вспомогательная функция для получения текста команды
function getCommandText(opcode) {
  const commands = {
    0x09: "DAD B",
    0x19: "DAD D",
    0x29: "DAD H",
    0x39: "DAD SP",
    0x02: "STAX B",
    0x12: "STAX D",
    0x22: "SHLD a16",
    0x32: "STA a16",
    0x0A: "LDAX B",
    0x1A: "LDAX B",
    0xC5: "PUSH B",
    0xD5: "PUSH D",
    0xE5: "PUSH H",
    0xF5: "PUSH PSW",
    0xC1: "POP B",
    0xD1: "POP D",
    0xE1: "POP H",
    0xF1: "POP PSW",
    0xE3: "XTHL"
  };
  return commands[opcode] || "UNKNOWN";
}

function executePush(cpu, bytes, highReg, lowReg, getLowValue = null) {
    switch(cpu.currentCycle) {
        case 1:
            handleHighlighting(executionState.currentCycle, executionState.currentCommandRow, executionState.commandLength);
            cpu.setPC(executionState.nextCommandRow);
            break;

        case 2:
            updateAddressBuffer(cpu.registers.PC);
            break;

        case 3:
            updateDataBuffer(toHex(bytes[0], 2));
            break;

        case 4:
            currentCommandHex.textContent = `Рег. команд: ${toHex(bytes[0], 2)}`;
            currentCommandText.textContent = `Д/Ш команд: ${getCommandText(bytes[0])}`;
            break;

        case 5:
            updateAddressBuffer(cpu.registers.SP);
            break;

        case 6:
            const highValue = cpu.registers[highReg];
            updateDataBuffer(toHex(highValue, 2));
            cpu.writeMemory(cpu.registers.SP, highValue);
            break;

        case 7:
            cpu.registers.SP = (cpu.registers.SP - 1) & 0xFFFF;
            break;

        case 8:
            updateAddressBuffer(cpu.registers.SP);
            break;

        case 9:
            const lowValue = getLowValue ? getLowValue(cpu) : cpu.registers[lowReg];
            updateDataBuffer(toHex(lowValue, 2));
            cpu.writeMemory(cpu.registers.SP, lowValue);
            break;

        case 10:
            cpu.registers.SP = (cpu.registers.SP - 1) & 0xFFFF;
            break;
    }
}

// Функция для получения значения PSW
function getPSWValue(cpu) {
  return (cpu.flags.S << 7) | (cpu.flags.Z << 6) | (0 << 5) | 
  (cpu.flags.AC << 4) | (0 << 3) | (cpu.flags.P << 2) | (1 << 1) | cpu.flags.C;
}

// Общая функция для POP B/D/H
function executePop(cpu, bytes, lowReg, highReg) {
    switch(cpu.currentCycle) {
        case 1:
          handleHighlighting(executionState.currentCycle, executionState.currentCommandRow, executionState.commandLength);
          cpu.setPC(executionState.nextCommandRow);
          break;
            
        case 2:
          updateAddressBuffer(cpu.registers.PC);
          break;
            
        case 3:
          updateDataBuffer(toHex(bytes[0], 2));
          break;
            
        case 4:
          currentCommandHex.textContent = `Рег. команд: ${toHex(bytes[0], 2)}`;
          currentCommandText.textContent = `Д/Ш команд: ${getCommandText(bytes[0])}`;
          break;
            
        case 5:
          // Инкремент SP (подготовка к чтению)
          cpu.registers.SP = (cpu.registers.SP + 1) & 0xFFFF;
          break;
            
        case 6:
          updateAddressBuffer(cpu.registers.SP);
          break;
            
        case 7:
          // Чтение младшего байта
          updateDataBuffer(toHex(cpu.readMemory(cpu.registers.SP), 2));
          break;
            
        case 8:
          // Инкремент SP
          cpu.registers[lowReg] = cpu.readMemory(cpu.registers.SP);
          cpu.registers.SP = (cpu.registers.SP + 1) & 0xFFFF;
          break;
            
        case 9:
          updateAddressBuffer(cpu.registers.SP);
          break;  
            
        case 10:
          // Чтение старшего байта
          updateDataBuffer(toHex(cpu.readMemory(cpu.registers.SP), 2));
          cpu.registers[highReg] = cpu.readMemory(cpu.registers.SP);
          break;

        case 11:
          cpu.registers[highReg] = cpu.readMemory(cpu.registers.SP);
          break;
    }
}

// Специальная функция для POP PSW
function executePopPSW(cpu, bytes) {
    switch(cpu.currentCycle) {
        case 1:
            handleHighlighting(executionState.currentCycle, executionState.currentCommandRow, executionState.commandLength);
            cpu.setPC(executionState.nextCommandRow);
            break;
            
        case 2:
            updateAddressBuffer(cpu.registers.PC);
            break;
            
        case 3:
            updateDataBuffer(toHex(bytes[0], 2));
            break;
            
        case 4:
            currentCommandHex.textContent = `Рег. команд: ${toHex(bytes[0], 2)}`;
            currentCommandText.textContent = `Д/Ш команд: ${getCommandText(bytes[0])}`;
            break;
            
        case 5:
            // Инкремент SP (подготовка к чтению флагов)
            cpu.registers.SP = (cpu.registers.SP + 1) & 0xFFFF;
            break;
            
        case 6:
            updateAddressBuffer(cpu.registers.SP);
            break;
            
        case 7:
            // Чтение байта флагов
            updateDataBuffer(toHex(cpu.readMemory(cpu.registers.SP), 2));
            break;
            
        case 8:
            // Установка флагов
            setFlagsFromValue(cpu, cpu.readMemory(cpu.registers.SP));
            break;
            
        case 9:
            // Инкремент SP (подготовка к чтению аккумулятора)
            cpu.registers.SP = (cpu.registers.SP + 1) & 0xFFFF;
            break;
            
        case 10:
            updateAddressBuffer(cpu.registers.SP);
            break;
            
        case 11:
            // Чтение аккумулятора
            const aValue = cpu.readMemory(cpu.registers.SP);
            updateDataBuffer(toHex(aValue, 2));
            cpu.registers.A = aValue;
            break;
    }
}

// Функция для установки флагов из значения
function setFlagsFromValue(cpu, value) {
    cpu.flags.S = (value >> 7) & 1;
    cpu.flags.Z = (value >> 6) & 1;
    cpu.flags.AC = (value >> 4) & 1;
    cpu.flags.P = (value >> 2) & 1;
    cpu.flags.C = value & 1;
}