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
  // Прокручиваем таблицу к текущей команде
//   const row = tableBody.querySelector(`tr[data-row="${newPC}"]`);
//   if (row) {
//     row.scrollIntoView({ behavior: 'smooth', block: 'center' });
//   }
  
  // Обновляем отображение PC в UI
  programCounter.textContent = toHex(newPC, 4);
};

// Функция сброса состояния процессора
resetCompliting.addEventListener("click", () => {
    cpu.reset();
    updateUIFromCPU(); // Функция для обновления UI из состояния CPU
    resetExecutionState();
});

function getCommandLengthForAddress(address) {
  const opcode = cpu.readMemory(address);
  const mnemonic = reverseOpcodeMap[toHex(opcode, 2)];
  
  if (!mnemonic) return 1;
  
  const [command] = mnemonic.split(" ");
  
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
function resetExecutionState() {
    executionState = {
        currentCycle: 0,
        currentCommandRow: -1,
        commandText: "",
        nextCommandRow: 0,
        isExecuting: false
    };
    
    tableBody.querySelectorAll(".highlighted-command").forEach(row => {
        row.classList.remove("highlighted-command");
    });

    tableBody.querySelectorAll(".highlighted-argument").forEach(row => {
        row.classList.remove("highlighted-argument");
    });
    
    currentCommandHex.textContent = "Рег. команд: -";
    currentCommandText.textContent = "Д/Ш команд: -";
}

// function getCommandBytes(row, length) {
//     const bytes = [];
//     for (let i = 0; i < length; i++) {
//         const valInput = document.querySelector(`input[data-row="${row + i}"][data-col="val"]`);
//         bytes.push(parseInt(valInput?.value || "00", 16));
//     }
//     return bytes;
// }

function getCommandBytes(row, length) {
  const bytes = [];
  for (let i = 0; i < length; i++) {
    bytes.push(cpu.memory[row + i]); // Читаем из памяти CPU
  }
  return bytes;
}

// При изменении счетчика команд в таблице обновляем PC процессора
function updateProgramCounter(row) {
  cpu.setPC(row);
  programCounter.textContent = toHex(row, 4);
  
//   // Прокручиваем к текущей команде
//   const rowElement = tableBody.querySelector(`tr[data-row="${row}"]`);
//   if (rowElement) {
//     rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//   }
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
        const row = tableBody.querySelector(`tr[data-row="${i}"]`);
        if (!row || row.classList.contains("readonly-row")) continue;
        
        const hasCommand = row.querySelector('input[data-col="cmd"]')?.value.trim();
        const hasValue = row.querySelector('input[data-col="val"]')?.value.trim();
        
        if ((hasCommand || hasValue) && !isArgumentRow(i)) {
            return i;
        }
    }
    return -1;
}

// Функция для выполнения команды до завершения всех тактов
// function executeCommandToCompletion() {
//     if (executionState.isExecuting) return;
//     executionState.isExecuting = true;

//     // Проверка на HALT перед началом выполнения
//     if (cpu.isHalted) {
//         const shouldResume = confirm("Процессор остановлен командой HLT.\nПродолжить выполнение?");
//         if (shouldResume) {
//             cpu.resumeFromHalt();
//         } else {
//             executionState.isExecuting = false;
//             return;
//         }
//     }
    
//     // Если мы еще не начали выполнять команду (currentCycle === 0)
//     if (executionState.currentCycle === 0) {
//         // Находим следующую команду
//         const foundRow = findNextCommand(executionState.nextCommandRow);
//         executionState.currentCommandRow = foundRow;
//         // Получаем информацию о команде
//         const rowElement = tableBody.querySelector(`tr[data-row="${foundRow}"]`);
//         if (rowElement) {
//             const valInput = rowElement.querySelector('input[data-col="val"]');
//             const cmdInput = rowElement.querySelector('input[data-col="cmd"]');
//             executionState.commandHex = valInput?.value || "";
//             executionState.commandText = cmdInput?.value || "";
//             executionState.commandLength = getCommandLength(executionState.commandText);
//         }
        
//         // Начинаем с такта 1
//         executionState.currentCycle = 1;
//     }
    
//     // Вычисляем сколько тактов нужно выполнить для текущей команды
//     const totalCycles = getTotalCyclesForCommand(executionState.commandLength);
    
//     // Выполняем все такты до завершения команды
//     const executeNextCycle = () => {
//         if (executionState.currentCycle > 0 && executionState.currentCycle <= totalCycles) {
//             executeCycle();
            
//             // Если команда еще не завершена, продолжаем
//             if (executionState.currentCycle > 0 && executionState.currentCycle <= totalCycles) {
//                 setTimeout(executeNextCycle, 10);
//             } else {
//                 executionState.isExecuting = false;
//             }
//         } else {
//             executionState.isExecuting = false;
//         }
//     };
    
//     executeNextCycle();
// }

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
    
    // Если мы еще не начали выполнять команду (currentCycle === 0)
    if (executionState.currentCycle === 0) {
        // Находим следующую команду
        const foundRow = findNextCommand(executionState.nextCommandRow);
        
        executionState.currentCommandRow = foundRow;
        // Получаем информацию о команде
        const rowElement = tableBody.querySelector(`tr[data-row="${foundRow}"]`);
        if (rowElement) {
            const valInput = rowElement.querySelector('input[data-col="val"]');
            const cmdInput = rowElement.querySelector('input[data-col="cmd"]');
            executionState.commandHex = valInput?.value || "";
            executionState.commandText = cmdInput?.value || "";
            executionState.commandLength = getCommandLength(executionState.commandText);
        }
        
        // Начинаем с такта 1
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
        if (foundRow === -1) {
            console.log("Программа завершена");
            return;
        }
        
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

// Модифицированная функция выполнения команды
function executeCurrentCommand(isPartialExecution = false) {
    const row = executionState.currentCommandRow;
    const commandLength = executionState.commandLength;
    const commandBytes = getCommandBytes(row, commandLength);
    
    // Сохраняем текущий PC перед выполнением
    const oldPC = cpu.registers.PC;
    
    // Выполняем команду
    if (commandBytes.length > 0) {
        cpu.executeCommand(commandBytes, isPartialExecution);
    }
    
    // Обновляем UI
    updateUIFromCPU();
    
    // Для JMP используем новый PC из процессора
    if (commandBytes[0] === 0xC3 && !isPartialExecution) {
        executionState.nextCommandRow = cpu.registers.PC;
    } else {
        executionState.nextCommandRow = oldPC + commandLength;
    }
}

function isArgumentRow(rowIndex) {
    // Проверяем текущую строку и две предыдущие (максимальный охват для 3-байтовых команд)
    const previousRowsToCheck = [rowIndex - 1, rowIndex - 2]; 

    // Проверяем каждую из предыдущих строк
    return previousRowsToCheck.some(prevRowIndex => {
        // Находим строку таблицы
        const prevRow = tableBody.querySelector(`tr[data-row="${prevRowIndex}"]`);
        
        // Пропускаем если строка не существует или только для чтения
        if (!prevRow || prevRow.classList.contains("readonly-row")) return false;
        const prevCommandText = prevRow.querySelector('input[data-col="cmd"]')?.value.trim();
        if (!prevCommandText) return false;
        
        // Извлекаем имя команды (первое слово)
        const commandName = prevCommandText.split(" ")[0];
        
        // Проверяем, является ли это командой с аргументами
        const isCommandWithArgs = commands16BitTail.concat(commands8BitTail).includes(commandName);
        
        // Если это не команда с аргументами - пропускаем
        if (!isCommandWithArgs) return false;
        
        // Вычисляем длину команды (1-3 байта)
        const commandLength = getCommandLength(prevCommandText);
        
        // Проверяем, попадает ли текущая строка в диапазон аргументов команды
        const isCurrentRowArgument = (prevRowIndex + commandLength) > rowIndex;
        return isCurrentRowArgument;
    });
}

function executeCycle() {
    // Проверяем, остановлен ли процессор
    if (cpu.isHalted) {
        // Предлагаем пользователю снять флаг HALT
        const shouldResume = confirm("Процессор остановлен командой HLT.\nПродолжить выполнение?");
        if (shouldResume) {
            cpu.resumeFromHalt();
            // Продолжаем выполнение с текущего состояния
            return executeCycle(); // Рекурсивный вызов для продолжения
        } else {
            // Пользователь отказался - останавливаем выполнение
            executionState.isExecuting = false;
            return;
        }
    }

    const { currentCycle, currentCommandRow, commandLength } = executionState;
    
    // 1. Обработка подсветки
    handleHighlighting(currentCycle, currentCommandRow, commandLength);

    // 2. Получаем байты команды
    const commandBytes = getCommandBytes(currentCommandRow, commandLength);
    
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
        // Для однобайтных команд (например, ADD B) обновляем буферные регистры
        const opcode = parseInt(document.querySelector(`input[data-row="${row}"][data-col="val"]`)?.value || "00", 16);
        
        // Определяем, нужно ли обновлять буферные регистры для этой команды
        if (shouldUpdateBuffersForOpcode(opcode)) {
            updateBuffersForOpcode(opcode);
        }
        
        executeCurrentCommand();
        // Сбрасываем состояние выполнения
        executionState.currentCycle = 0;
        executionState.currentCommandRow = -1;
        
        // Важно: обновляем отображение PC
        updateProgramCounter(cpu.registers.PC);
    } else {
        updateProgramCounter(row + 1);
        executionState.currentCycle = 6;
        console.log(cpu.registers.PC);
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
        // Для команд с непосредственным операндом (ADI, SUI и т.д.)
        const opcode = parseInt(document.querySelector(`input[data-row="${row}"][data-col="val"]`)?.value || "00", 16);
        
        if (shouldUpdateBuffersForImmediateOpcode(opcode)) {
            updateBuffersForImmediateOpcode(opcode, argValue);
        }
        
        executeCurrentCommand();
        executionState.currentCycle = 0;
    } else if (length === 3) {
        executeCurrentCommand(true);
        executionState.currentCycle = 8;
    }
}

function handleCycle8(row) {
    updateProgramCounter(row + 2);
    executionState.currentCycle = 9;
    console.log(cpu.registers.PC);
}

function handleCycle9(row) {
    updateAddressBuffer(row + 2);
    executionState.currentCycle = 10;
}

function handleCycle10(row, length) {
    const argInput = document.querySelector(`input[data-row="${row + 2}"][data-col="val"]`);
    updateDataBuffer(argInput?.value || "00");
    
    if (length === 3) {
        // Для LXI - завершаем выполнение без обновления буферных регистров
        executeCurrentCommand(false);
    }
    executionState.currentCycle = 0;
}

function shouldUpdateBuffersForOpcode(opcode) {
    // Команды, для которых нужно обновлять буферные регистры
    const bufferUpdateOpcodes = [
        0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x87, // ADD r
        0x88, 0x89, 0x8A, 0x8B, 0x8C, 0x8D, 0x8F, // ADC r
        0x90, 0x91, 0x92, 0x93, 0x94, 0x95, 0x97, // SUB r
        0x98, 0x99, 0x9A, 0x9B, 0x9C, 0x9D, 0x9F, // SBB r
        0xA0, 0xA1, 0xA2, 0xA3, 0xA4, 0xA5, 0xA7, // ANA r
        0xA8, 0xA9, 0xAA, 0xAB, 0xAC, 0xAD, 0xAF, // XRA r
        0xB0, 0xB1, 0xB2, 0xB3, 0xB4, 0xB5, 0xB7, // ORA r
        0xB8, 0xB9, 0xBA, 0xBB, 0xBC, 0xBD, 0xBF  // CMP r
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
        // Для арифметических/логических операций:
        // bufReg1 = значение регистра A
        // bufReg2 = значение второго операнда (регистра из команды)
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

function updateBuffersForImmediateOpcode(opcode, value) {
    // Для команд с непосредственным операндом:
    // bufReg1 = значение регистра A
    // bufReg2 = непосредственное значение из команды
    cpu.setBufReg1(cpu.registers.A);
    cpu.setBufReg2(value);
}

// Функция обработки подсветки
function handleHighlighting(currentCycle, currentCommandRow, commandLength) {
    // Удаляем подсветку только при начале новой команды
    if (currentCycle === 1) {
        tableBody.querySelectorAll(".highlighted-command, .highlighted-argument")
            .forEach(row => row.classList.remove("highlighted-command", "highlighted-argument"));
    }

    // Определяем текущую строку для подсветки
    const { row, isArgument } = getHighlightTarget(currentCycle, currentCommandRow, commandLength);
    
    // Применяем подсветку
    if (row >= 0) {
        const rowElement = tableBody.querySelector(`tr[data-row="${row}"]`);
        if (rowElement) {
            rowElement.classList.add(isArgument ? "highlighted-argument" : "highlighted-command");
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
