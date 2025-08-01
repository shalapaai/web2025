cpu.setHaltCallback(() => {
  return confirm("Процессор остановлен командой HLT.\nПродолжить выполнение?");
});

const resetCompliting = document.querySelector("#resetCompliting");

const currentCommandHex = document.querySelector("#currentCommandHex");
const currentCommandText = document.querySelector("#currentCommandText");

const programCounter = document.querySelector("#programCounter").nextElementSibling;
const adrBuf = document.querySelector("#adrBuf");
const dataBuf = document.querySelector("#dataBuf");

// Привязываем изменение PC к таблице
cpu.onPCChange = (newPC) => {
  
  // Обновляем отображение PC в UI
  programCounter.textContent = toHex(newPC, 4);
};

// Модифицируем обработчик кнопки reset
resetCompliting.addEventListener("click", () => {
    cpu.reset();
    cpu.resetBuffers(); // Сбрасываем буферные регистры и PC
    updateUIFromCPU(); // Обновляем UI
    resetExecutionState();
    cpu.setPC(0);
    
    // Обновляем отображение буферов в UI
    document.querySelector("#regBuf1").textContent = `Буферный регистр 1: 00`;
    document.querySelector("#regBuf2").textContent = `Буферный регистр 2: 00`;
    document.querySelector("#adrBuf").textContent = `Буфер адреса: 0000`;
    document.querySelector("#dataBuf").textContent = `Буфер данных: 00`;
});

function getCommandLengthForAddress(address) {
    const opcode = cpu.readMemory(address);
    const mnemonic = reverseOpcodeMap[toHex(opcode, 2)] || "";
    const command = mnemonic.split(" ")[0];
    
    // Специальные случаи для команд, которые могут быть ошибочно интерпретированы
    if (command === "NOP" && opcode !== 0x00) {
        return 1; // Неизвестные команды считаем однобайтовыми
    }
    
    if (commands8BitTail.includes(command)) return 2;
    if (commands16BitTail.includes(command)) return 3;
    return 1;
}

function getFullCommandHex(address) {
  let hexParts = [];
  const commandLength = getCommandLengthForAddress(address);
  
  for (let i = 0; i < commandLength; i++) {
    hexParts.push(toHex(cpu.readMemory(address + i), 2));
  }
  
  return hexParts.join(" ");
}

// -------------------------------

// Состояние выполнения команды
let executionState = {
    currentCycle: 0,
    currentCommandRow: -1,
    commandText: "",
    nextCommandRow: 0,
    isExecuting: false,
    get commandLength() {
        return this.commandText ? getCommandLength(this.commandText) : 1
    }
};

// Функция сброса состояния
// Функция сброса состояния выполнения
function resetExecutionState() {
    executionState = {
        currentCycle: 0,
        currentCommandRow: -1,
        commandText: "",
        nextCommandRow: 0,
        isExecuting: false
    };
    
    // Снимаем подсветку со всех строк
    tableBody.querySelectorAll(".highlighted-command, .highlighted-argument").forEach(row => {
        row.classList.remove("highlighted-command", "highlighted-argument");
    });
    
    currentCommandHex.textContent = "Рег. команд: -";
    currentCommandText.textContent = "Д/Ш команд: -";
    updateCycleDisplay(0);
    
    // Очищаем подсвеченные состояния в rowStates
    for (const row in cpu.rowStates) {
        if (cpu.rowStates[row]) {
            cpu.rowStates[row].highlighted = false;
        }
    }
}

function getCommandBytes(row, length) {
    const bytes = [];
    for (let i = 0; i < length; i++) {
        bytes.push(cpu.readMemory(row + i));
    }
    return bytes;
}

// При изменении счетчика команд в таблице обновляем PC процессора
function updateProgramCounter(row) {
  cpu.setPC(row);
  programCounter.textContent = toHex(row, 4);
  
  // Прокручиваем к текущей команде
  const rowElement = tableBody.querySelector(`tr[data-row="${row}"]`);
  if (rowElement) {
    rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Функция для обновления буфера адреса
function updateAddressBuffer(row) {
    adrBuf.textContent = `Буфер адреса: ${toHex(row, 4)}`;
}

// Функция для обновления буфера данных
function updateDataBuffer(hexValue) {
    dataBuf.textContent = `Буфер данных: ${hexValue}`;
}

// Функция определения длины команды
function getCommandLength(commandText) {
    if (!commandText) return 1;
    
    const parts = commandText.split(" ");
    const command = parts[0];
    
    if (commands8BitTail.includes(command)) {
        return 2; // Команда + 1 байт данных
    } else if (commands16BitTail.includes(command)) {
        return 3; // Команда + 2 байта данных
    }
    
    return 1; // Обычная 1-байтовая команда
}

function findNextCommand(startFrom) {
    for (let i = startFrom; i < numRows; i++) {
        // Если строка не является аргументом последней команды, возвращаем её
        if (!isArgumentRow(i)) {
            return i;
        }
    }
    return -1;
}

function executeCommandToCompletion() {
    if (executionState.isExecuting) return;
    executionState.isExecuting = true;

    // Проверка на HALT перед началом выполнения
    if (cpu.isHalted) {
        const shouldResume = confirm("Процессор остановлен командой HLT.\nПродолжить выполнение?");
        if (shouldResume) {
            cpu.resumeFromHalt();
        } else {
            executionState.isExecuting = false;
            return;
        }
    }
    const totalCycles = getTotalCyclesForCommand(executionState.commandLength);
    // В цикле выполнения тактов:
  while (executionState.currentCycle > 0 && executionState.currentCycle <= totalCycles) {
    updateCycleDisplay(executionState.currentCycle);
    executeCycle();
  }
    
    if (executionState.currentCycle === 0) {
        // Находим следующую команду, читая прямо из памяти CPU
        let foundRow = -1;
        for (let i = executionState.nextCommandRow; i < numRows; i++) {
            // Проверяем, что это не аргумент предыдущей команды
            if (!isArgumentRow(i)) {
                foundRow = i;
                break;
            }
        }
        
        executionState.currentCommandRow = foundRow;
        
        // Получаем информацию о команде из памяти CPU
        if (foundRow !== -1) {
            const opcode = cpu.readMemory(foundRow);
            executionState.commandHex = toHex(opcode, 2);
            executionState.commandText = reverseOpcodeMap[executionState.commandHex] || "NOP";
            executionState.commandLength = getCommandLengthForAddress(foundRow);
        }
        
        executionState.currentCycle = 1;
    }
    
    // Получаем байты команды
    const commandBytes = getCommandBytes(executionState.currentCommandRow, executionState.commandLength);
    
    // Проверяем, является ли команда специальной
    if (isSpecialCommand(commandBytes[0])) {
        // Для специальных команд выполняем все циклы сразу
        const opcode = commandBytes[0];
        const specialCommand = SpecialCommands[opcode];
        
        // Выполняем все циклы команды
        for (let cycle = cpu.currentCycle; cycle <= specialCommand.cycles; cycle++) {
            cpu.currentCycle = cycle;
            executeSpecialCommand(cpu, commandBytes);
            updateUIFromCPU();
        }
        
        // Завершаем выполнение команды
        executionState.nextCommandRow = executionState.currentCommandRow + executionState.commandLength;
        executionState.currentCycle = 0;
        cpu.currentCycle = 1;
        executionState.isExecuting = false;
    } else {
        // Стандартная обработка команды
        const totalCycles = getTotalCyclesForCommand(executionState.commandLength);
        
        // Выполняем все такты до завершения команды
        while (executionState.currentCycle > 0 && executionState.currentCycle <= totalCycles) {
            executeCycle();
        }
        
        executionState.isExecuting = false;
    }
}

// Обновляем обработчик кнопки выполнения команды
commandComplete.addEventListener("click", () => {
    if (executionState.isExecuting) return;
    executeCommandToCompletion();
});

function getTotalCyclesForCommand(commandLength) {
    switch(commandLength) {
        case 1: return 5;  // 5 такта для 1-байтовой команды
        case 2: return 7;  // 7 тактов для команды с 1 аргументом
        case 3: return 10; // 10 тактов для команды с 2 аргументами
        default: return 5;
    }
}

// Обработчик кнопки выполнения такта
cycleComplete.addEventListener("click", () => {
    if (executionState.isExecuting) return;
    
    // Если выполнение еще не начато, находим первую команду
    if (executionState.currentCycle === 0) {
        const foundRow = findNextCommand(executionState.nextCommandRow);
        
        executionState.currentCommandRow = foundRow;
        executionState.currentCycle = 1;
        
        // Получаем информацию о команде
        const rowElement = tableBody.querySelector(`tr[data-row="${foundRow}"]`);
        if (rowElement) {
            const valInput = rowElement.querySelector('input[data-col="val"]');
            const cmdInput = rowElement.querySelector('input[data-col="cmd"]');
            executionState.commandHex = valInput?.value || "";
            executionState.commandText = cmdInput?.value || "";
            executionState.commandLength = getCommandLength(executionState.commandText);
        }
    }
    
    // Выполняем один такт
    executeCycle();
});


function executeCurrentCommand(isPartialExecution = false) {
    const row = executionState.currentCommandRow;
    const commandLength = executionState.commandLength;
    const commandBytes = getCommandBytes(row, commandLength);
    
    // Выполняем команду
    cpu.executeCommand(commandBytes, isPartialExecution);
    updateUIFromCPU();
    
    executionState.nextCommandRow = cpu.registers.PC;
}

function isArgumentRow(rowIndex) {
    // Если не было выполнено команд, строка не может быть аргументом
    if (executionState.currentCommandRow === -1) return false;

    const lastCommandRow = executionState.currentCommandRow;
    const opcode = cpu.readMemory(lastCommandRow);
    const mnemonic = reverseOpcodeMap[toHex(opcode, 2)] || "";
    const command = mnemonic.split(" ")[0];
    const commandLength = getCommandLengthForAddress(lastCommandRow);

    // Для 2-байтовых команд (например, MVI)
    if (commands8BitTail.includes(command) && commandLength === 2 && rowIndex === lastCommandRow + 1) {
        return true;
    }

    // Для 3-байтовых команд (например, LXI)
    if (commands16BitTail.includes(command) && commandLength === 3 && 
        (rowIndex === lastCommandRow + 1 || rowIndex === lastCommandRow + 2)) {
        return true;
    }

    return false;
}

function executeCycle() {
    // Проверяем, остановлен ли процессор
    if (cpu.isHalted) {
        const shouldResume = confirm("Процессор остановлен командой HLT.\nПродолжить выполнение?");
        if (shouldResume) {
            cpu.resumeFromHalt();
            // Продолжаем выполнение с текущего состояния
            return executeCycle(); // Рекурсивный вызов для продолжения
        } else {
            executionState.isExecuting = false;
            return;
        }
    }

    updateCycleDisplay(executionState.currentCycle);

    const { currentCycle, currentCommandRow, commandLength } = executionState;

    
    // 1. Обработка подсветки
    handleHighlighting(currentCycle, currentCommandRow, commandLength);

    // 2. Получаем байты команды
    const commandBytes = getCommandBytes(currentCommandRow, commandLength);
    
    // Обновляем UI на основе данных из памяти
    if (currentCycle === 4) {
        const fullHex = commandBytes.map(b => toHex(b, 2)).join(' ');
        currentCommandHex.textContent = `Рег. команд: ${fullHex} (по адресу ${toHex(currentCommandRow, 4)})`;
        currentCommandText.textContent = `Д/Ш команд: ${executionState.commandText}`;
    }
    
    // 3. Проверяем, является ли команда специальной
    if (isSpecialCommand(commandBytes[0])) {
        const opcode = commandBytes[0];
        const specialCommand = SpecialCommands[opcode];
        
        // Обновляем UI перед выполнением команды
        updateProgramCounter(executionState.nextCommandRow);
        // updateAddressBuffer(currentCommandRow);
        // updateDataBuffer(toHex(commandBytes[0], 2));
        // currentCommandHex.textContent = `Рег. команд: ${toHex(commandBytes[0], 2)}`;
        // currentCommandText.textContent = `Д/Ш команд: ${getCommandText(commandBytes[0])}`;
        
        // Выполняем специальную команду
        const finished = executeSpecialCommand(cpu, commandBytes);
        
        // Обновляем UI после выполнения команды
        updateUIFromCPU();
        
        // Если команда завершена
        if (finished) {
            executionState.nextCommandRow = currentCommandRow + commandLength;
            executionState.currentCycle = 0;
            cpu.currentCycle = 1;
        } else {
            executionState.currentCycle = cpu.currentCycle;
        }
    } else {
        // Стандартная обработка тактов выполнения
        switch (currentCycle) {
            case 1: handleCycle1(executionState.nextCommandRow); break;
            case 2: handleCycle2(executionState.nextCommandRow); break;
            case 3: handleCycle3(executionState.nextCommandRow); break;
            case 4: handleCycle4(executionState.nextCommandRow); break;
            case 5: handleCycle5(executionState.nextCommandRow, commandLength); break;
            case 6: handleCycle6(executionState.nextCommandRow); break;
            case 7: handleCycle7(executionState.nextCommandRow, commandLength); break;
            case 8: handleCycle8(executionState.nextCommandRow); break;
            case 9: handleCycle9(executionState.nextCommandRow); break;
            case 10: handleCycle10(executionState.nextCommandRow, commandLength); break;
        }
    }
}

// Вспомогательные функции для обработки тактов
function handleCycle1(row) {
    updateProgramCounter(row);
    executionState.currentCycle = 2;
}

function handleCycle2(row) {
    updateAddressBuffer(row);
    executionState.currentCycle = 3;
}

function handleCycle3(row) {
    const cmdDataInput = document.querySelector(`input[data-row="${row}"][data-col="val"]`);
    updateDataBuffer(cmdDataInput?.value || "00");
    executionState.currentCycle = 4;
}

function handleCycle4(row) {
    const fullHex = getFullCommandHex(row);
    currentCommandHex.textContent = `Рег. команд: ${fullHex} (по адресу ${toHex(row, 4)})`;
    currentCommandText.textContent = `Д/Ш команд: ${executionState.commandText}`;
    executionState.currentCycle = 5;
}

function handleCycle5(row, length) {
    if (length === 1) {
        const opcode = parseInt(document.querySelector(`input[data-row="${row}"][data-col="val"]`)?.value || "00", 16);
        
        // Обновляем буферные регистры для всех команд (не только для специальных)
        updateBuffersForOpcode(opcode);
        
        executeCurrentCommand();
        
        executionState.nextCommandRow = cpu.registers.PC;
        executionState.currentCycle = 0;
        executionState.currentCommandRow = -1;
    } else {
        updateProgramCounter(row + 1);
        executionState.currentCycle = 6;
    }
}

function handleCycle6(row) {
    updateAddressBuffer(row + 1);
    executionState.currentCycle = 7;
}

function handleCycle7(row, length) {
    const argInput = document.querySelector(`input[data-row="${row + 1}"][data-col="val"]`);
    const argValue = parseInt(argInput?.value || "00", 16);
    updateDataBuffer(argInput?.value || "00");
    
    if (length === 2) {
        const opcode = parseInt(document.querySelector(`input[data-row="${row}"][data-col="val"]`)?.value || "00", 16);
        
        // Для команд с непосредственным операндом обновляем буферы
        if (shouldUpdateBuffersForImmediateOpcode(opcode)) {
            updateBuffersForImmediateOpcode(opcode, argValue);
        }
        
        executeCurrentCommand();
        executionState.nextCommandRow = cpu.registers.PC - 1;
        executionState.currentCycle = 0;
        executionState.currentCommandRow = -1;
    } else if (length === 3) {
        executeCurrentCommand(true);
        executionState.currentCycle = 8;
    }
}
function handleCycle8(row) {
    updateProgramCounter(row + 1);
    executionState.currentCycle = 9;
    console.log(cpu.registers.PC);
}

function handleCycle9(row) {
    updateAddressBuffer(row + 1);
    executionState.currentCycle = 10;
}

function handleCycle10(row, length) {
    const argInput = document.querySelector(`input[data-row="${row + 1}"][data-col="val"]`);
    updateDataBuffer(argInput?.value || "00");

    executeCurrentCommand(false);
    const isJumpCommand = isJumpOpcode(cpu.readMemory(row));
    if (isJumpCommand) {
        executionState.nextCommandRow = cpu.registers.PC;
    } else {
        executionState.nextCommandRow = cpu.registers.PC + 1;
    }
    
    executionState.currentCycle = 0;
    executionState.currentCommandRow = -1;
}

function updateBuffersForOpcode(opcode) {
    const regMap = {
        0x80: 'B', 0x81: 'C', 0x82: 'D', 0x83: 'E',
        0x84: 'H', 0x85: 'L', 0x87: 'A',
        0x88: 'B', 0x89: 'C', 0x8A: 'D', 0x8B: 'E',
        0x8C: 'H', 0x8D: 'L', 0x8F: 'A',
        0x90: 'B', 0x91: 'C', 0x92: 'D', 0x93: 'E',
        0x94: 'H', 0x95: 'L', 0x97: 'A',
        0x98: 'B', 0x99: 'C', 0x9A: 'D', 0x9B: 'E',
        0x9C: 'H', 0x9D: 'L', 0x9F: 'A',
        0xA0: 'B', 0xA1: 'C', 0xA2: 'D', 0xA3: 'E',
        0xA4: 'H', 0xA5: 'L', 0xA7: 'A',
        0xA8: 'B', 0xA9: 'C', 0xAA: 'D', 0xAB: 'E',
        0xAC: 'H', 0xAD: 'L', 0xAF: 'A',
        0xB0: 'B', 0xB1: 'C', 0xB2: 'D', 0xB3: 'E',
        0xB4: 'H', 0xB5: 'L', 0xB7: 'A',
        0xB8: 'B', 0xB9: 'C', 0xBA: 'D', 0xBB: 'E',
        0xBC: 'H', 0xBD: 'L', 0xBF: 'A'
    };
    
    const regName = regMap[opcode];
    if (regName) {
        // Для всех арифметических/логических команд:
        // BufReg1 = аккумулятор (A)
        // BufReg2 = второй операнд (регистр или значение из памяти)
        cpu.setBufReg1(cpu.registers.A);
        
        if (regName === 'M') {
            // Для операций с памятью (M)
            const addr = (cpu.registers.H << 8) | cpu.registers.L;
            cpu.setBufReg2(cpu.readMemory(addr));
        } else {
            // Для операций с регистрами
            cpu.setBufReg2(cpu.registers[regName]);
        }
    }
}

// Функция для проверки, является ли опкод переходной командой
function isJumpOpcode(opcode) {
    const jumpOpcodes = [
        0xC3, // JMP
        0xCA, 0xC2, 0xDA, 0xD2, 0xEA, 0xFA, // Условные переходы
        0xCD, 0xCC, 0xC4, 0xDC, 0xD4, 0xEC, 0xFC, 0xE4, 0xF4, // CALL
        0xC9, 0xC8, 0xC0, 0xD8, 0xD0, 0xE8, 0xF8, 0xE0, 0xF0, // RET
        0xE9 // PCHL (косвенный переход)
    ];
    return jumpOpcodes.includes(opcode);
}

function shouldUpdateBuffersForOpcode(opcode) {
    const bufferUpdateOpcodes = [
        // Все арифметические/логические команды с регистрами
        0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x87,
        0x88, 0x89, 0x8A, 0x8B, 0x8C, 0x8D, 0x8F,
        0x90, 0x91, 0x92, 0x93, 0x94, 0x95, 0x97,
        0x98, 0x99, 0x9A, 0x9B, 0x9C, 0x9D, 0x9F,
        0xA0, 0xA1, 0xA2, 0xA3, 0xA4, 0xA5, 0xA7,
        0xA8, 0xA9, 0xAA, 0xAB, 0xAC, 0xAD, 0xAF,
        0xB0, 0xB1, 0xB2, 0xB3, 0xB4, 0xB5, 0xB7,
        0xB8, 0xB9, 0xBA, 0xBB, 0xBC, 0xBD, 0xBF,
        
        // Команды с памятью (M)
        0x86, 0x8E, 0x96, 0x9E, // ADD M, ADC M, SUB M, SBB M
        0xA6, 0xAE, 0xB6, 0xBE  // ANA M, XRA M, ORA M, CMP M
    ];
    
    return bufferUpdateOpcodes.includes(opcode);
}

function updateBuffersForOpcode(opcode) {
    const regMap = {
        0x80: 'B', 0x81: 'C', 0x82: 'D', 0x83: 'E',
        0x84: 'H', 0x85: 'L', 0x87: 'A',
        0x88: 'B', 0x89: 'C', 0x8A: 'D', 0x8B: 'E',
        0x8C: 'H', 0x8D: 'L', 0x8F: 'A',
        0x90: 'B', 0x91: 'C', 0x92: 'D', 0x93: 'E',
        0x94: 'H', 0x95: 'L', 0x97: 'A',
        0x98: 'B', 0x99: 'C', 0x9A: 'D', 0x9B: 'E',
        0x9C: 'H', 0x9D: 'L', 0x9F: 'A',
        0xA0: 'B', 0xA1: 'C', 0xA2: 'D', 0xA3: 'E',
        0xA4: 'H', 0xA5: 'L', 0xA7: 'A',
        0xA8: 'B', 0xA9: 'C', 0xAA: 'D', 0xAB: 'E',
        0xAC: 'H', 0xAD: 'L', 0xAF: 'A',
        0xB0: 'B', 0xB1: 'C', 0xB2: 'D', 0xB3: 'E',
        0xB4: 'H', 0xB5: 'L', 0xB7: 'A',
        0xB8: 'B', 0xB9: 'C', 0xBA: 'D', 0xBB: 'E',
        0xBC: 'H', 0xBD: 'L', 0xBF: 'A'
    };
    
    const regName = regMap[opcode];
    if (regName) {
        cpu.setBufReg1(cpu.registers.A);
        cpu.setBufReg2(cpu.registers[regName]);
    }
}

function shouldUpdateBuffersForImmediateOpcode(opcode) {
    // Команды с непосредственным операндом, для которых нужно обновлять буферные регистры
    const immediateOpcodes = [
        0xC6, // ADI
        0xCE, // ACI
        0xD6, // SUI
        0xDE, // SBI
        0xE6, // ANI
        0xEE, // XRI
        0xF6, // ORI
        0xFE  // CPI
    ];
    
    return immediateOpcodes.includes(opcode);
}

function handleHighlighting(currentCycle, currentCommandRow, commandLength) {
    // Удаляем старую подсветку
    if (currentCycle === 1) {
        tableBody.querySelectorAll(".highlighted-command, .highlighted-argument").forEach(row => {
            const rowIndex = parseInt(row.dataset.row, 10);
            row.classList.remove("highlighted-command", "highlighted-argument");

            // Удаляем флаг подсветки из rowStates
            if (cpu.rowStates[rowIndex]) {
                cpu.rowStates[rowIndex].highlighted = false;
            }
        });
    }

    // Определяем строку для подсветки
    const { row, isArgument } = getHighlightTarget(currentCycle, currentCommandRow, commandLength);

    if (row >= 0) {
        const rowElement = tableBody.querySelector(`tr[data-row="${row}"]`);
        if (rowElement) {
            const className = isArgument ? "highlighted-argument" : "highlighted-command";
            rowElement.classList.add(className);

            // Сохраняем флаг подсветки в rowStates
            cpu.rowStates[row] = cpu.rowStates[row] || {};
            cpu.rowStates[row].highlighted = true;
            cpu.rowStates[row].highlightType = isArgument ? "argument" : "command";
        }
    }
}

// Функция определения цели для подсветки
function getHighlightTarget(currentCycle, currentCommandRow, commandLength) {
    if (currentCycle >= 1 && currentCycle <= 4) {
        return { row: currentCommandRow, isArgument: false };
    } 
    else if (currentCycle >= 5) {
        const argNumber = Math.floor((currentCycle - 5) / 3);
        if (argNumber < commandLength - 1) {
            return { row: currentCommandRow + argNumber + 1, isArgument: true };
        }
        return { row: currentCommandRow, isArgument: false };
    }
    return { row: -1, isArgument: false };
}

function updateUIFromCPU() {
    // Обновляем регистры
    document.querySelectorAll(".reg-table th").forEach(th => {
        const name = th.textContent.trim();
        const valueCell = th.nextElementSibling;
        
        if (cpu.registers[name] !== undefined) {
            valueCell.textContent = toHex(cpu.registers[name], name === 'SP' || name === 'PC' ? 4 : 2);
        }
    });
    
    // Обновляем флаги
    document.querySelectorAll(".flags-table th").forEach(th => {
        const flag = th.textContent.trim();
        if (cpu.flags[flag] !== undefined) {
            th.nextElementSibling.textContent = cpu.flags[flag]; 
        }
    });

    // Обновляем буферные регистры
        document.querySelector("#regBuf1").textContent = `Буферный регистр 1: ${toHex(cpu.bufReg1, 2)}`;
        document.querySelector("#regBuf2").textContent = `Буферный регистр 2: ${toHex(cpu.bufReg2, 2)}`;

    const stackPointerElement = document.querySelector("#stackPointer").nextElementSibling;
    stackPointerElement.textContent = toHex(cpu.registers.SP, 4);
}