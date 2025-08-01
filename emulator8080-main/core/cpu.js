const jumpOpcodes = [
  0xC3, // JMP
  0xCA, // JZ
  0xC2, // JNZ
  0xDA, // JC
  0xD2, // JNC
  0xEA, // JPE
  0xE2, // JPO 
  0xF2, // JP 
  0xFA, // JM
  // CALL команды
  0xCD, 0xCC, 0xC4, 0xDC, 0xD4, 0xEC, 0xFC, 0xE4, 0xF4,
  // RET команды
  0xC9, 0xC8, 0xC0, 0xD8, 0xD0, 0xE8, 0xF8, 0xE0, 0xF0
];

class CPU8080 {
  constructor() {
    this.registers = {
      W: 0, Z: 0, A: 0, B: 0, C: 0, D: 0, E: 0, H: 0, L: 0,
      SP: 0xFFFF,  // Stack Pointer
      PC: 0x0000   // Program Counter
    };
    
    this.flags = {
      S: 0,  // Sign
      Z: 0,  // Zero
      AC: 0, // Aux Carry
      P: 0,  // Parity
      C: 0  // Carry
    };

    this.bufReg1 = 0;  // Буферный регистр 1
    this.bufReg2 = 0;  // Буферный регистр 2

    this.currentCycle = 1; // Текущий такт выполнения команды
    
    this.memory = new Uint8Array(0x10000); // 64KB memory (0x0000-0xFFFF)
    this.memory.fill(0x00); // Заполняем NOP (00)

    this.rowStates = {}; // ключ — индекс строки, значение — объект { readonly: bool, owner: number|null, highlighted: bool }

    this.onPCChange = () => {};

    this.isHalted = false; // Флаг остановки процессора
    this.onHaltCallback = null; // Коллбек для UI-оповещения

    // Эмуляция 256 портов ввода-вывода (0x00-0xFF)
    this.ioPorts = new Uint8Array(256);
    // Для отладки - храним историю обращений к портам
    this.ioAccessLog = [];
    this.onMemoryWrite = null; // Коллбек для обновления UI
  }

  readMemory(address) {
    return this.memory[address & 0xFFFF];
  }

  writeMemory(address, value) {
    this.memory[address & 0xFFFF] = value & 0xFF;
    if (this.onMemoryWrite) {
      this.onMemoryWrite(address); // Вызываем коллбек при записи
    }
  }

  // Установка обработчика для UI
  setHaltCallback(callback) {
    this.onHaltCallback = callback;
  }

  setBufReg1(value) {
    this.bufReg1 = value & 0xFF;
  }

  setBufReg2(value) {
    this.bufReg2 = value & 0xFF;
  }

  setPC(value) {
  this.registers.PC = value & 0xFFFF; // Обеспечиваем 16-битное значение
  this.onPCChange(this.registers.PC); 
}

// Добавляем метод для установки SP
  setSP(value) {
    this.registers.SP = value & 0xFFFF; // Обеспечиваем 16-битное значение
  }

  // Добавляем метод для получения SP
  getSP() {
    return this.registers.SP;
  }

  reset() {
    for (let reg in this.registers) {
      this.registers[reg] = reg === 'SP' ? 0xFFFF : 0;
    }
    
    for (let flag in this.flags) {
      this.flags[flag] = 0;
    }
  }

  resetBuffers() {
    this.bufReg1 = 0;
    this.bufReg2 = 0;
    this.registers.PC = 0x0000;
    this.registers.SP = 0xFFFF;
  }

  // Обработка HLT
  handleHLT() {
    this.isHalted = true;
    if (this.onHaltCallback) {
      const shouldResume = this.onHaltCallback();
      if (shouldResume) {
        this.resumeFromHalt();
      }
    }
  }
  // Снятие режима HALT
  resumeFromHalt() {
    this.isHalted = false;
    this.registers.PC += 1; // Переход к следующей команде
  }

  // Чтение из порта (команда IN)
  in(port) {
    const value = this.ioPorts[port & 0xFF];
    
    // Логируем операцию
    this.ioAccessLog.push({
      type: 'IN',
      port: port & 0xFF,
      value: value,
      pc: this.registers.PC
    });
    
    console.log(`IN from port 0x${(port & 0xFF).toString(16).padStart(2, '0')} = 0x${value.toString(16).padStart(2, '0')}`);
    
    return value;
  }

  // Запись в порт (команда OUT)
  out(port, value) {
    this.ioPorts[port & 0xFF] = value & 0xFF;
    
    // Логируем операцию
    this.ioAccessLog.push({
      type: 'OUT',
      port: port & 0xFF,
      value: value & 0xFF,
      pc: this.registers.PC
    });
    
    console.log(`OUT to port 0x${(port & 0xFF).toString(16).padStart(2, '0')} = 0x${(value & 0xFF).toString(16).padStart(2, '0')}`);
  }

  // Вывод состояния всех портов в консоль
  dumpIOPorts() {
    console.log("Состояние портов ввода-вывода:");
    for (let i = 0; i < 256; i++) {
      if (this.ioPorts[i] !== 0) { // Показываем только не нулевые
        console.log(`Порт 0x${i.toString(16).padStart(2, '0')}: 0x${this.ioPorts[i].toString(16).padStart(2, '0')}`);
      }
    }
    
    console.log("История обращений к портам:");
    console.table(this.ioAccessLog);
  }

  handleMVI(opcode, value) {
    const regMap = {
      0x3E: 'A', 0x06: 'B', 0x0E: 'C',
      0x16: 'D', 0x1E: 'E', 0x26: 'H',
      0x2E: 'L', 0x36: 'M' // MVI M
    };
    
    const reg = regMap[opcode];
    if (reg) {
      if (reg === 'M') {
        const addr = (this.registers.H << 8) | this.registers.L;
        this.writeMemory(addr, value);
      } else {
        this.registers[reg] = value;
      }
    }
  }

  handleADD(operand) {
    const result = this.registers.A + operand;
    this.registers.A = result & 0xFF;
    this.updateFlags(this.registers.A, {
      checkAC: true,
      originalA: this.registers.A,
      operand: operand,
      checkC: result > 0xFF
    });
    // this.registers.PC += 1;
  }

  handleADC(operand) {
    const result = this.registers.A + operand + (this.flags.C ? 1 : 0);
    this.registers.A = result & 0xFF;
    this.updateFlags(this.registers.A, {
      checkAC: true,
      originalA: this.registers.A,
      operand: operand,
      checkC: result > 0xFF
    });
    // this.registers.PC += 1;
  }

  handleSUB(operand) {
    const result = this.registers.A - operand;
    this.registers.A = result & 0xFF;
    this.updateFlags(this.registers.A, {
        checkAC: true,
        originalA: this.registers.A,
        operand: operand,
        checkC: result < 0 
    });
    // this.registers.PC += 1;
  } 

  handleSBB(operand) {
    const result = this.registers.A - operand - (this.flags.C ? 1 : 0);
    this.registers.A = result & 0xFF;
    this.updateFlags(this.registers.A, {
      checkAC: true,
      originalA: this.registers.A,
      operand: operand,
      checkC: result < 0
    });
    // this.registers.PC += 1;
  }

  handleLogical(opcode, operand) {
    let result;
    switch(opcode) {
      case 0xA0: case 0xA1: case 0xA2: case 0xA3: case 0xA4: case 0xA5: case 0xA7: case 0xE6: case 0xA6: // ANA/ANI
        result = this.registers.A & operand;
        this.registers.A = result;
        this.updateFlags(result, {
          checkAC: true,  // Для AND AC=1
          checkC: false
        });
        this.flags.AC = 1; // Особенность 8080: AND всегда устанавливает AC=1
        this.flags.C = 0;  // AND всегда сбрасывает Carry
        break;
          
      case 0xB0: case 0xB1: case 0xB2: case 0xB3: case 0xB4: case 0xB5: case 0xB7: case 0xF6: case 0xB6: // ORA/ORI
        result = this.registers.A | operand;
        this.registers.A = result;
        this.updateFlags(result, {
          checkAC: false,  // Для OR AC=0
          checkC: false
        });
        this.flags.AC = 0; // OR сбрасывает AC
        this.flags.C = 0;  // OR всегда сбрасывает Carry
        break;
          
      case 0xA8: case 0xA9: case 0xAA: case 0xAB: case 0xAC: case 0xAD: case 0xAF: case 0xEE: case 0xAE: // XRA/XRI
        result = this.registers.A ^ operand;
        this.registers.A = result;
        this.updateFlags(result, {
          checkAC: false,  // Для XOR AC=0
          checkC: false
        });
        this.flags.AC = 0; // XOR сбрасывает AC
        this.flags.C = 0;  // XOR всегда сбрасывает Carry
        break;
    }
    // this.registers.PC += 1;
  }

  handleCMP(operand) {
    const result = this.registers.A - operand;
    this.updateFlags(result, {
      checkAC: true,
      originalA: this.registers.A,
      operand: operand,
      checkC: result < 0
    });
    // this.registers.PC += 1;
  }

  handleMOV(opcode) {
    // Определяем регистры-источник и назначение
    const srcReg = (opcode & 0x07); // Младшие 3 бита - источник
    const destReg = (opcode >> 3) & 0x07; // Следующие 3 бита - назначение
    
    const regNames = ['B', 'C', 'D', 'E', 'H', 'L', 'M', 'A'];
    const srcRegName = regNames[srcReg];
    const destRegName = regNames[destReg];
    
    // MOV r, M
    if (srcRegName === 'M') {
      const addr = (this.registers.H << 8) | this.registers.L;
      const value = this.readMemory(addr);
      
      // Специальная обработка для MOV M,M (0x76) - это HLT
      if (destRegName === 'M') {
        this.handleHLT(); // HLT
      } else {
        this.registers[destRegName] = value;
      }
    } 
    // MOV M, r
    else if (destRegName === 'M') {
      const addr = (this.registers.H << 8) | this.registers.L;
      this.writeMemory(addr, this.registers[srcRegName]);
    } 
    // MOV r1, r2
    else {
      this.registers[destRegName] = this.registers[srcRegName];
    }
  }

  handleINR(reg) {
    let value;
    if (reg === 'M') {
      const addr = (this.registers.H << 8) | this.registers.L;
      let value = this.readMemory(addr);
      value = (value + 1) & 0xFF;
      this.writeMemory(addr, value);
      
      // Обновляем флаги (кроме Carry)
      this.updateFlags(value, {
        checkAC: true,
        originalA: value - 1 // предыдущее значение
      });
    } else {
      // INR r - увеличить регистр
      value = (this.registers[reg] + 1) & 0xFF;
      this.registers[reg] = value;
    }
    
    // Флаги (кроме Carry)
    this.updateFlags(value, {
      checkAC: true,
      originalA: value - 1, // предыдущее значение
      operand: 1
    });
    // this.registers.PC += 1;
  }

  handleDCR(reg) {
    let value;
    if (reg === 'M') {
      const addr = (this.registers.H << 8) | this.registers.L;
      let value = this.readMemory(addr);
      value = (value - 1) & 0xFF;
      this.writeMemory(addr, value);
      
      // Обновляем флаги (кроме Carry)
      this.updateFlags(value, {
        checkAC: true,
        originalA: value + 1 // предыдущее значение
      });
    } else {
      // DCR r - уменьшить регистр
      value = (this.registers[reg] - 1) & 0xFF;
      this.registers[reg] = value;
    }
    
    // Флаги (кроме Carry)
    this.updateFlags(value, {
      checkAC: true,
      originalA: value + 1, // предыдущее значение
      operand: 1
    });
    // this.registers.PC += 1;
  }

  handleINX(opcode) {
    switch(opcode) {
      case 0x03: // INX B
        this.registers.C = (this.registers.C + 1) & 0xFF;
        if (this.registers.C === 0) {
          this.registers.B = (this.registers.B + 1) & 0xFF;
        }
        break;
          
      case 0x13: // INX D
        this.registers.E = (this.registers.E + 1) & 0xFF;
        if (this.registers.E === 0) {
          this.registers.D = (this.registers.D + 1) & 0xFF;
        }
        break;
          
      case 0x23: // INX H
        this.registers.L = (this.registers.L + 1) & 0xFF;
        if (this.registers.L === 0) {
          this.registers.H = (this.registers.H + 1) & 0xFF;
        }
        break;
          
      case 0x33: // INX SP
        this.registers.SP = (this.registers.SP + 1) & 0xFFFF;
        break;
    }
    // this.registers.PC += 1;
  }

  handleDCX(opcode) {
    switch(opcode) {
      case 0x0B: // DCX B
        this.registers.C = (this.registers.C - 1) & 0xFF;
        if (this.registers.C === 0xFF) { // При переходе через 0
          this.registers.B = (this.registers.B - 1) & 0xFF;
        }
        break;
          
      case 0x1B: // DCX D
        this.registers.E = (this.registers.E - 1) & 0xFF;
        if (this.registers.E === 0xFF) {
          this.registers.D = (this.registers.D - 1) & 0xFF;
        }
        break;
          
      case 0x2B: // DCX H
        this.registers.L = (this.registers.L - 1) & 0xFF;
        if (this.registers.L === 0xFF) {
          this.registers.H = (this.registers.H - 1) & 0xFF;
        }
        break;
          
      case 0x3B: // DCX SP
        this.registers.SP = (this.registers.SP - 1) & 0xFFFF;
        break;
    }
    // this.registers.PC += 1;
  }

  handleRLC() {
    const a = this.registers.A;
    const newCarry = (a >> 7) & 1; // Сохраняем старший бит
    this.registers.A = ((a << 1) | newCarry) & 0xFF; // Сдвигаем влево и добавляем бит
    this.flags.C = newCarry; // Устанавливаем флаг переноса
    // this.registers.PC += 1;
  }

  handleRRC() {
    const a = this.registers.A;
    const newCarry = a & 1; // Сохраняем младший бит
    this.registers.A = ((a >> 1) | (newCarry << 7)) & 0xFF; // Сдвигаем вправо и добавляем бит
    this.flags.C = newCarry; // Устанавливаем флаг переноса
    // this.registers.PC += 1;
  }

  handleRAL() {
    const a = this.registers.A;
    const newCarry = (a >> 7) & 1; // Сохраняем старший бит
    this.registers.A = ((a << 1) | this.flags.C) & 0xFF; // Сдвигаем влево + старый C
    this.flags.C = newCarry; // Обновляем флаг переноса
    // this.registers.PC += 1;
  }

  handleRAR() {
    const a = this.registers.A;
    const newCarry = a & 1; // Сохраняем младший бит
    this.registers.A = ((a >> 1) | (this.flags.C << 7)) & 0xFF; // Сдвигаем вправо + старый C
    this.flags.C = newCarry; // Обновляем флаг переноса
    // this.registers.PC += 1;
  }

  handleDAA() {
    let correction = 0;
    let newCarry = this.flags.C;

    // Коррекция младшей тетрады (0-3 биты)
    if ((this.registers.A & 0x0F) > 9 || this.flags.AC) {
      correction += 0x06;
    }

    // Коррекция старшей тетрады (4-7 биты)
    if ((this.registers.A >> 4) > 9 || newCarry) {
      correction += 0x60;
      newCarry = 1; // Устанавливаем Carry, если было переполнение
    }

    // Применяем коррекцию
    this.registers.A = (this.registers.A + correction) & 0xFF;

    // Обновляем флаги
    this.updateFlags(this.registers.A, {
      checkC: newCarry,
      checkAC: true
    });
  }

  handleSTC() {
    this.flags.C = 1;  // Просто устанавливаем Carry в 1
  }

  handleCMA() {
    this.registers.A = (~this.registers.A) & 0xFF;  // Инверсия с маской 8 бит
  }

  handleCMC() {
    this.flags.C = this.flags.C ^ 1;  // Инвертируем Carry (XOR с 1)
  }

  executeCommand(bytes, isPartialExecution = false) {
    if (this.isHalted) {
      console.warn("Процессор остановлен! Требуется сброс или прерывание.");
      return false; // Прекращаем выполнение
    }

    const opcode = bytes[0];
    const arg1 = bytes.length > 1 ? bytes[1] : null;
    const arg2 = bytes.length > 2 ? bytes[2] : null;

    // Сохраняем оригинальный PC для возможного перехода
    const originalPC = this.registers.PC;

    this.currentCycle = 1;

    // Проверяем, является ли команда специальной
    if (isSpecialCommand(opcode)) {
        return executeSpecialCommand(this, bytes);
    }   

    const regMap = {
        0x80: 'B', 0x81: 'C', 0x82: 'D', 0x83: 'E',
        0x84: 'H', 0x85: 'L', 0x87: 'A',
        0xA0: 'B', 0xA1: 'C', 0xA2: 'D', 0xA3: 'E',
        0xA4: 'H', 0xA5: 'L', 0xA7: 'A',
        0xB0: 'B', 0xB1: 'C', 0xB2: 'D', 0xB3: 'E',
        0xB4: 'H', 0xB5: 'L', 0xB7: 'A',
        0xA8: 'B', 0xA9: 'C', 0xAA: 'D', 0xAB: 'E',
        0xAC: 'H', 0xAD: 'L', 0xAF: 'A'
    };

    // Таблица соответствия кодов INR/DCR регистрам
    const inrDcrMap = {
      0x04: 'B', 0x0C: 'C', 0x14: 'D', 0x1C: 'E',
      0x24: 'H', 0x2C: 'L', 0x34: 'M', 0x3C: 'A',
      
      0x05: 'B', 0x0D: 'C', 0x15: 'D', 0x1D: 'E',
      0x25: 'H', 0x2D: 'L', 0x35: 'M', 0x3D: 'A'
    };

    // Обработка LXI с частичным выполнением
    if ((opcode === 0x01 || opcode === 0x11 || opcode === 0x21 || opcode === 0x31) && bytes.length >= 3) {
        if (isPartialExecution) {
            // Первая часть выполнения (младший байт)
            switch(opcode) {
                case 0x01: this.registers.C = bytes[1]; break;
                case 0x11: this.registers.E = bytes[1]; break;
                case 0x21: this.registers.L = bytes[1]; break;
                case 0x31: this.registers.SP = (this.registers.SP & 0xFF00) | bytes[1]; break;
                case 0xC3: this.registers.Z = bytes[1]; break;
            }
        } else {
            // Вторая часть выполнения (старший байт)
            switch(opcode) {
                case 0x01: this.registers.B = bytes[2]; break;
                case 0x11: this.registers.D = bytes[2]; break;
                case 0x21: this.registers.H = bytes[2]; break;
                case 0x31: this.registers.SP = (bytes[2] << 8) | (this.registers.SP & 0xFF); break;
                case 0xC3: 
                  this.registers.W = bytes[2]; 
                  this.setPC((this.registers.W << 8) | this.registers.Z);
                  executionState.nextCommandRow = this.registers.PC;
                  break;
            }
        }
        return;
    }

    switch(opcode) {
      case 0x00: // NOP
        // this.registers.PC += 1;
        break;

      case 0x76: // HLT
        this.handleHLT();
        return false; // Команда выполнена, процессор остановлен
        
      case 0x3E: case 0x06: case 0x0E: case 0x16: 
      case 0x1E: case 0x26: case 0x2E: case 0x36: // MVI r,d8
        this.handleMVI(opcode, arg1);
        break;
        
      case 0x80: case 0x81: case 0x82: case 0x83: 
      case 0x84: case 0x85: case 0x87: // ADD r
        this.handleADD(this.registers[regMap[opcode]]);
        break;
        
      case 0x88: case 0x89: case 0x8A: case 0x8B: 
      case 0x8C: case 0x8D: case 0x8F: // ADC r
        this.handleADC(this.registers[regMap[opcode - 0x08]]);
        break;
        
      case 0x90: case 0x91: case 0x92: case 0x93: 
      case 0x94: case 0x95: case 0x97: // SUB r
        this.handleSUB(this.registers[regMap[opcode - 0x10]]);
        break;
        
      case 0x98: case 0x99: case 0x9A: case 0x9B: 
      case 0x9C: case 0x9D: case 0x9F: // SBB r
        this.handleSBB(this.registers[regMap[opcode - 0x18]]);
        break;
        
      case 0xA0: case 0xA1: case 0xA2: case 0xA3: 
      case 0xA4: case 0xA5: case 0xA7: // ANA r
      case 0xB0: case 0xB1: case 0xB2: case 0xB3: 
      case 0xB4: case 0xB5: case 0xB7: // ORA r
      case 0xA8: case 0xA9: case 0xAA: case 0xAB: 
      case 0xAC: case 0xAD: case 0xAF: // XRA r
        this.handleLogical(opcode, this.registers[regMap[opcode]]);
        break;
        
      case 0xB8: case 0xB9: case 0xBA: case 0xBB: 
      case 0xBC: case 0xBD: case 0xBF: // CMP r
        this.handleCMP(this.registers[regMap[opcode - 0x38]]);
        break;

      case 0x86: // ADD M
        const addMAddr = (this.registers.H << 8) | this.registers.L;
        this.handleADD(this.readMemory(addMAddr));
        break;
        
      case 0x8E: // ADC M
        const adcMAddr = (this.registers.H << 8) | this.registers.L;
        this.handleADC(this.readMemory(adcMAddr));
        break;
        
      case 0x96: // SUB M
        const subMAddr = (this.registers.H << 8) | this.registers.L;
        this.handleSUB(this.readMemory(subMAddr));
        break;
        
      case 0x9E: // SBB M
        const sbbMAddr = (this.registers.H << 8) | this.registers.L;
        this.handleSBB(this.readMemory(sbbMAddr));
        break;
        
      case 0xA6: // ANA M
        const anaMAddr = (this.registers.H << 8) | this.registers.L;
        this.handleLogical(opcode, this.readMemory(anaMAddr));
        break;
        
      case 0xAE: // XRA M
        const xraMAddr = (this.registers.H << 8) | this.registers.L;
        this.handleLogical(opcode, this.readMemory(xraMAddr));
        break;
        
      case 0xB6: // ORA M
        const oraMAddr = (this.registers.H << 8) | this.registers.L;
        this.handleLogical(opcode, this.readMemory(oraMAddr));
        break;
        
      case 0xBE: // CMP M
        const cmpMAddr = (this.registers.H << 8) | this.registers.L;
        this.handleCMP(this.readMemory(cmpMAddr));
        break;

      // MOV r1, r2 (0x40-0x7F)
      case 0x40: case 0x41: case 0x42: case 0x43: case 0x44: case 0x45: case 0x46: case 0x47:
      case 0x48: case 0x49: case 0x4A: case 0x4B: case 0x4C: case 0x4D: case 0x4E: case 0x4F:
      case 0x50: case 0x51: case 0x52: case 0x53: case 0x54: case 0x55: case 0x56: case 0x57:
      case 0x58: case 0x59: case 0x5A: case 0x5B: case 0x5C: case 0x5D: case 0x5E: case 0x5F:
      case 0x60: case 0x61: case 0x62: case 0x63: case 0x64: case 0x65: case 0x66: case 0x67:
      case 0x68: case 0x69: case 0x6A: case 0x6B: case 0x6C: case 0x6D: case 0x6E: case 0x6F:
      case 0x70: case 0x71: case 0x72: case 0x73: case 0x74: case 0x75: case 0x76: case 0x77:
      case 0x78: case 0x79: case 0x7A: case 0x7B: case 0x7C: case 0x7D: case 0x7E: case 0x7F:
        this.handleMOV(opcode);
        // this.registers.PC += 1;
        break;

      case 0xC6: // ADI d8
        this.handleADD(arg1);
        // this.registers.PC += 2; 
        break;
        
      case 0xCE: // ACI d8
        this.handleADC(arg1);
        // this.registers.PC += 2;
        break;
        
      case 0xD6: // SUI d8
        this.handleSUB(arg1);
        // this.registers.PC += 2;
        break;
        
      case 0xDE: // SBI d8
        this.handleSBB(arg1);
        // this.registers.PC += 2;
        break;
        
      case 0xE6: // ANI d8
        this.handleLogical(opcode, arg1);
        // this.registers.PC += 2;
        break;
        
      case 0xEE: // XRI d8
        this.handleLogical(opcode, arg1);
        // this.registers.PC += 2;
        break;
        
      case 0xF6: // ORI d8
        this.handleLogical(opcode, arg1);
        // this.registers.PC += 2; 
        break;
        
      case 0xFE: // CPI d8
        this.handleCMP(arg1);
        // this.registers.PC += 2;
        break;

      // INR r (0x04, 0x0C, 0x14, 0x1C, 0x24, 0x2C, 0x34, 0x3C)
      case 0x04: case 0x0C: case 0x14: case 0x1C:
      case 0x24: case 0x2C: case 0x34: case 0x3C:
        this.handleINR(inrDcrMap[opcode]);
        break;

      // DCR r (0x05, 0x0D, 0x15, 0x1D, 0x25, 0x2D, 0x35, 0x3D)
      case 0x05: case 0x0D: case 0x15: case 0x1D:
      case 0x25: case 0x2D: case 0x35: case 0x3D:
        this.handleDCR(inrDcrMap[opcode]);
        break;

      case 0x03: case 0x13: case 0x23: case 0x33: // INX rp
        this.handleINX(opcode);
        break;

      case 0x0B: case 0x1B: case 0x2B: case 0x3B: // DCX rp
        this.handleDCX(opcode);
        break;

      case 0x07: // RLC
        this.handleRLC();
        break;
      case 0x0F: // RRC
        this.handleRRC();
        break;
      case 0x17: // RAL
        this.handleRAL();
        break;
      case 0x1F: // RAR
        this.handleRAR();
        break;
      
      case 0x27: // DAA
        this.handleDAA();
        break;

      case 0x37: // STC
        this.handleSTC();
        break;

      case 0x2F: // CMA
        this.handleCMA();
        break;

      case 0x3F: // CMC
        this.handleCMC();
        break;

      case 0xDB: // IN
        const inPort = bytes[1];
        this.registers.A = this.in(inPort);
        break;

      case 0xD3: // OUT
        const outPort = bytes[1];
        this.out(outPort, this.registers.A);
        break;
        
      case 0xEB: // XCHG
        // Обмениваем H и D
        let temp = this.registers.H;
        this.registers.H = this.registers.D;
        this.registers.D = temp;

        // Обмениваем L и E
        temp = this.registers.L;
        this.registers.L = this.registers.E;
        this.registers.E = temp;
        break;

      case 0xF3: // DI
        console.log('Прерывания запрещены')
        break;
          
      case 0xFB: // EI
        console.log('Прерывания разрешены')
        break;

      case 0xF9:
        this.registers.SP = ((this.registers.H << 8) | this.registers.L) & 0xFFFF;
        break;

      case 0xC3: // JMP
          if (isPartialExecution) {
              this.registers.Z = bytes[1]; // Младший байт
          } else {
              this.registers.W = bytes[2];
              const newPC = ((this.registers.W << 8) | this.registers.Z);
              this.setPC(newPC);
          }
          break;

      case 0xCA: // JZ
      case 0xC2: // JNZ
      case 0xDA: // JC
      case 0xD2: // JNC
      case 0xEA: // JPE
      case 0xFA: // JPO
          if (isPartialExecution) {
              // Первый такт - читаем младший байт адреса
              this.registers.Z = bytes[1];
          } else {
              // Второй такт - проверяем условие и прыгаем если нужно
              let shouldJump = false;
              
              switch(opcode) {
                  case 0xCA: shouldJump = this.flags.Z; break;  // JZ
                  case 0xC2: shouldJump = !this.flags.Z; break; // JNZ
                  case 0xDA: shouldJump = this.flags.C; break;  // JC
                  case 0xD2: shouldJump = !this.flags.C; break; // JNC
                  case 0xEA: shouldJump = this.flags.P; break;  // JPE
                  case 0xFA: shouldJump = !this.flags.P; break; // JPO
              }
              
              if (shouldJump) {
                  const newPC = ((bytes[2] << 8) | this.registers.Z) - 1;
                  this.setPC(newPC);
              }
          }
          break;
        
      case 0xFA: // JM (Jump Minus)
          if (isPartialExecution) {
              this.registers.Z = bytes[1]; // Младший байт адреса
          } else {
              if (this.flags.S) { // Если флаг S=1 (отрицательный результат)
                  const newPC = ((bytes[2] << 8) | this.registers.Z) - 1;
                  this.setPC(newPC);
              }
          }
          break;

      case 0xF2: // JP (Jump Plus)
          if (isPartialExecution) {
              this.registers.Z = bytes[1]; // Младший байт адреса
          } else {
              if (!this.flags.S) { // Если флаг S=0 (положительный результат)
                  const newPC = ((bytes[2] << 8) | this.registers.Z) - 1;
                  this.setPC(newPC);
              }
          }
          break;

      case 0xC7: // RST 0
      case 0xCF: // RST 1
      case 0xD7: // RST 2
      case 0xDF: // RST 3
      case 0xE7: // RST 4
      case 0xEF: // RST 5
      case 0xF7: // RST 6
      case 0xFF: // RST 7
          // Вычисляем адрес перехода: N*8 (где N = 0-7)
          const rstAddress = (opcode & 0x38) * 8; // 0x38 = 00111000
          
          // Сохраняем адрес возврата (PC + 1) в стеке
          const returnAddr = this.registers.PC + 1;
          this.writeMemory(this.registers.SP - 1, (returnAddr >> 8) & 0xFF); // Старший байт
          this.writeMemory(this.registers.SP - 2, returnAddr & 0xFF);       // Младший байт
          this.registers.SP -= 2;
          
          // Переход по вычисленному адресу
          this.setPC(rstAddress - 1); // -1 для компенсации инкремента PC
          break;

      case 0xCD: // CALL (безусловный)
          if (isPartialExecution) {
              this.registers.Z = bytes[1]; // Младший байт адреса
          } else {
              // Сохраняем адрес возврата (PC + 3) в стеке
              const returnAddr = this.registers.PC + 3;
              this.writeMemory(this.registers.SP - 1, (returnAddr >> 8) & 0xFF); // Старший байт
              this.writeMemory(this.registers.SP - 2, returnAddr & 0xFF);      // Младший байт
              this.registers.SP -= 2;
              
              // Переход по адресу
              const newPC = ((bytes[2] << 8) | this.registers.Z) - 1;
              this.setPC(newPC);
          }
          break;

      // Условные варианты CALL (используют те же коды, что и условные JMP)
      case 0xCC: // CZ (Call if Zero)
      case 0xC4: // CNZ (Call if Not Zero)
      case 0xDC: // CC (Call if Carry)
      case 0xD4: // CNC (Call if No Carry)
      case 0xEC: // CPE (Call if Parity Even)
      case 0xFC: // CM (Call if Minus)
      case 0xE4: // CPO (Call if Parity Odd)
      case 0xF4: // CP (Call if Plus)
          if (isPartialExecution) {
              this.registers.Z = bytes[1]; // Младший байт адреса
          } else {
              let shouldCall = false;
              switch(opcode) {
                  case 0xCC: shouldCall = this.flags.Z; break;  // CZ
                  case 0xC4: shouldCall = !this.flags.Z; break; // CNZ
                  case 0xDC: shouldCall = this.flags.C; break;  // CC
                  case 0xD4: shouldCall = !this.flags.C; break; // CNC
                  case 0xEC: shouldCall = this.flags.P; break;  // CPE
                  case 0xFC: shouldCall = this.flags.S; break;  // CM
                  case 0xE4: shouldCall = !this.flags.P; break; // CPO
                  case 0xF4: shouldCall = !this.flags.S; break; // CP
              }
              
              if (shouldCall) {
                  // Сохраняем адрес возврата (PC + 3) в стеке
                  const returnAddr = this.registers.PC + 3;
                  this.writeMemory(this.registers.SP - 1, (returnAddr >> 8) & 0xFF);
                  this.writeMemory(this.registers.SP - 2, returnAddr & 0xFF);
                  this.registers.SP -= 2;
                  
                  // Переход по адресу
                  const newPC = ((bytes[2] << 8) | this.registers.Z) - 1;
                  this.setPC(newPC);
              }
          }
          break;

      case 0xC9: // RET (безусловный возврат)
          // Чтение адреса возврата из стека
          const lowByte = this.readMemory(this.registers.SP);
          const highByte = this.readMemory(this.registers.SP + 1);
          const returnAddrRet = (highByte << 8) | lowByte;
          
          this.registers.SP += 2; // Восстанавливаем указатель стека
          this.setPC(returnAddrRet - 1); // -1 для компенсации инкремента PC
          
          // Такты: 10 (3 на чтение младшего, 3 на старший, 1 на сложение, 3 на восстановление PC)
          this.cycles += 10;
          break;

      case 0xC0: // RNZ (Return if Not Zero)
      case 0xC8: // RZ (Return if Zero)
      case 0xD0: // RNC (Return if No Carry)
      case 0xD8: // RC (Return if Carry)
      case 0xE0: // RPO (Return if Parity Odd)
      case 0xE8: // RPE (Return if Parity Even)
      case 0xF0: // RP (Return if Plus)
      case 0xF8: // RM (Return if Minus)
          // Проверка условия
          let conditionMet = false;
          switch(opcode) {
              case 0xC0: conditionMet = !this.flags.Z; break;  // RNZ
              case 0xC8: conditionMet = this.flags.Z; break;   // RZ
              case 0xD0: conditionMet = !this.flags.C; break;  // RNC
              case 0xD8: conditionMet = this.flags.C; break;   // RC
              case 0xE0: conditionMet = !this.flags.P; break;  // RPO
              case 0xE8: conditionMet = this.flags.P; break;   // RPE
              case 0xF0: conditionMet = !this.flags.S; break;  // RP
              case 0xF8: conditionMet = this.flags.S; break;   // RM
          }

          if (conditionMet) {
              // Полноценный RET
              const lowByte = this.readMemory(this.registers.SP);
              const highByte = this.readMemory(this.registers.SP + 1);
              const returnAddr = (highByte << 8) | lowByte;
              
              this.registers.SP += 2;
              this.setPC(returnAddr - 1);
              
              // Такты: 11 (1 на проверку условия + 10 как у обычного RET)
              this.cycles += 11;
          } else {
              // Только проверка условия (возврат не выполняется)
              // Такты: 5 (1 на проверку условия + 4 на чтение команды)
              this.cycles += 5;
          }
          break;

    case 0xE9: // PCHL
        // Загружаем PC из пары регистров H:L
        const newPC = (this.registers.H << 8) | this.registers.L;
        this.setPC(newPC - 1); // -1 для компенсации последующего инкремента PC
        
        // Такты: 5 (1 на чтение опкода + 4 на выполнение)
        this.cycles += 5;
        break;

      default:
        // Автоматическое увеличение PC только если команда не меняет его
        if (!this.isHalted && !isPartialExecution && 
            !jumpOpcodes.includes(opcode) && 
            !isSpecialCommand(opcode)) {
            this.registers.PC += bytes.length;
        }
        break;
    }
       // Автоматическое увеличение PC после выполнения команды
    // if (!this.isHalted && !isPartialExecution && 
    //     !jumpOpcodes.includes(opcode) && 
    //     !isSpecialCommand(opcode)) {
    //     // Увеличиваем PC на длину команды
    //     this.registers.PC += bytes.length;
    // }

    return true;
    
  }
  
  updateFlags(result, options = {}) {
    // Для арифметических операций используем полный результат (16 бит)
    // Для логических операций используем только младшие 8 бит
    const byteResult = result & 0xFF;
    const fullResult = result;

    // Zero flag (Z) - устанавливается, если 8-битный результат равен 0
    this.flags.Z = (byteResult === 0) ? 1 : 0;
    
    // Sign flag (S) - устанавливается, если 7-й бит результата установлен
    this.flags.S = (byteResult & 0x80) ? 1 : 0;
    
    // Parity flag (P) - четность количества установленных битов
    let bits = 0;
    for (let i = 0; i < 8; i++) {
        bits += (byteResult >> i) & 1;
    }
    this.flags.P = (bits % 2 === 0) ? 1 : 0;
    
    // Auxiliary Carry flag (AC) - перенос из 3-го в 4-й бит
    if (options.checkAC) {
        const mask = 0x10; // Маска для 4-го бита
        this.flags.AC = ((options.originalA ^ byteResult ^ options.operand) & mask) ? 1 : 0;
    }
    
    // Carry flag (C) - перенос/заем для арифметических операций
    if (options.checkC !== undefined) {
        this.flags.C = options.checkC ? 1 : 0;
    } else if (options.logicalOperation) {
        // Для логических операций флаг C всегда сбрасывается
        this.flags.C = 0;
    }
  }
}