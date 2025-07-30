const cpu = new CPU8080();

// Устанавливаем callback для обновления таблицы
cpu.onMemoryWrite = (address) => {
  const row = tableBody.querySelector(`tr[data-row="${address}"]`);
  if (row) {
    const valInput = row.querySelector('input[data-col="val"]');
    if (valInput) {
      // Проверяем, активно ли поле ввода в данный момент
      if (document.activeElement !== valInput) {
        const memoryValue = cpu.readMemory(address);
        valInput.value = toHex(memoryValue, 2);
      }
    }
    
    const cmdInput = row.querySelector('input[data-col="cmd"]');
    if (cmdInput) {
      const opcode = cpu.readMemory(address);
      const mnemonic = reverseOpcodeMap[toHex(opcode, 2)] || "NOP";
      // Для поля команды всегда обновляем значение
      cmdInput.value = mnemonic;
    }
  }
  
  refreshVisibleRows(); // Обновляем видимые строки
};

const tableBody = document.querySelector("#memoryTable tbody");
const numRows = 0xFF + 1;

function toHex(value, length = 4) {
  return value.toString(16).toUpperCase().padStart(length, "0");
}

// Создание поля ввода
function createInput(row, col, maxLength = 16) {
  const input = document.createElement("input");
  input.dataset.row = row;
  input.dataset.col = col;
  input.maxLength = maxLength;

  return input;
}

// Устанавливает значение в ячейку
function setCellValue(row, col, text) {
  const selector = `input[data-row="${row}"][data-col="${col}"]`;
  const input = document.querySelector(selector);
  if (input && input.value !== text) {
    input.value = text;
    
    // Обновляем память CPU
    if (col === "val") {
      const bytes = text.split(/\s+/);
      bytes.forEach((byte, i) => {
        if (byte.length === 2) {
          const value = parseInt(byte, 16);
          cpu.writeMemory(row + i, value);
        }
      });
    }
    input.dispatchEvent(new Event("input"));
  }
}

// Проверяет валидность аргумента (2 символа HEX)
function validateArg(arg) {
  return arg && arg.length === 2;
}

// Помечает строку как read-only
function markRowReadonly(rowIndex, ownerIndex) {
  const row = tableBody.querySelector(`tr[data-row="${rowIndex}"]`);
  if (!row) return;

  const currentOwner = row.dataset.owner;
  if (currentOwner && parseInt(currentOwner, 10) !== ownerIndex) {
    unmarkOwnedRows(parseInt(currentOwner, 10));
  }

  row.classList.add("readonly-row");
  row.dataset.owner = ownerIndex;

  row.querySelectorAll("input").forEach(input => {
    input.readOnly = true;
    input.tabIndex = -1;
  });
}

// Освобождает занятые строки
function unclaimIfOccupied(row, maxOffset = 2) {
  for (let i = 1; i <= maxOffset; i++) {
    const targetRow = tableBody.querySelector(`tr[data-row="${row + i}"]`);
    if (!targetRow) continue;

    const existingOwner = targetRow.dataset.owner;
    if (existingOwner && parseInt(existingOwner, 10) !== row) {
      unmarkOwnedRows(parseInt(existingOwner, 10));
    }
  }
}

// Снимает пометку read-only
function unmarkOwnedRows(ownerIndex) {
  tableBody.querySelectorAll(`tr[data-owner="${ownerIndex}"]`).forEach(row => {
    row.classList.remove("readonly-row");
    delete row.dataset.owner;
    row.querySelectorAll("input").forEach(input => {
      input.readOnly = false;
      input.tabIndex = 0;
      input.value = "";
    });
  });
}

// Находит следующую видимую строку
function findVisibleRowBelow(start) {
  for (let i = start + 1; i < numRows; i++) {
    const row = tableBody.querySelector(`tr[data-row="${i}"]`);
    if (row && !row.classList.contains("readonly-row")) return i;
  }
  return null;
}

// Находит предыдущую видимую строку
function findVisibleRowAbove(start) {
  for (let i = start - 1; i >= 0; i--) {
    const row = tableBody.querySelector(`tr[data-row="${i}"]`);
    if (row && !row.classList.contains("readonly-row")) return i;
  }
  return null;
}

const clearAllCommandsBtn = document.querySelector("#clearAllCommands");

clearAllCommandsBtn.addEventListener("click", () => {
  // Снимаем подсветку и сбрасываем текущую позицию
  resetCompliting.click();

  cpu.memory.fill(0x00);
  
  // Очищаем все строки таблицы
  for (let i = 0; i < numRows; i++) {
    const row = tableBody.querySelector(`tr[data-row="${i}"]`);
    if (row) {
      // Снимаем все классы и атрибуты
      row.classList.remove("readonly-row", "highlighted-command");
      delete row.dataset.owner;
      
      // Получаем поля ввода
      const valInput = row.querySelector('input[data-col="val"]');
      const cmdInput = row.querySelector('input[data-col="cmd"]');
      
      if (valInput) {
        valInput.value = "00";
        cpu.writeMemory(i, 0x00); // Инициализируем память
        valInput.readOnly = false;
        valInput.tabIndex = 0;
      }
      
      if (cmdInput) {
        cmdInput.value = "NOP"; // Устанавливаем NOP вместо пустой строки
        cpu.writeMemory(i, 0x00); // Инициализируем память
        cmdInput.readOnly = false;
        cmdInput.tabIndex = 0;
      }
    }
  }
});

const ROW_HEIGHT = 32; // Высота одной строки в пикселях
const BUFFER_ROWS = 10; // Буферные строки сверху и снизу
const totalRows = 0x10000; // Количество строк (00-FF)

// Инициализация виртуального скролла
function initVirtualTable() {
  const container = document.getElementById('memoryContainer');
  const tableBody = document.getElementById('memoryTableBody');
  
  container.style.height = `calc(100vh - 250px)`;
  tableBody.style.height = `${totalRows * ROW_HEIGHT}px`;
  
  container.addEventListener('scroll', renderVisibleRows);
  renderVisibleRows();
}

/// Рендеринг видимых строк
function renderVisibleRows() {
  const container = document.getElementById('memoryContainer');
  const tableBody = document.getElementById('memoryTableBody');
  
  // Рассчитываем видимый диапазон
  const scrollTop = container.scrollTop;
  const visibleStart = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_ROWS);
  const visibleEnd = Math.min(
    totalRows, 
    Math.ceil((scrollTop + container.clientHeight) / ROW_HEIGHT) + BUFFER_ROWS
  );
  
  // Удаляем строки вне видимой области
  const existingRows = tableBody.querySelectorAll('.virtual-row');
  existingRows.forEach(row => {
    const rowIndex = parseInt(row.dataset.row);
    if (rowIndex < visibleStart || rowIndex > visibleEnd) {
      row.remove();
    }
  });
  
  // Добавляем новые строки для видимой области
  for (let i = visibleStart; i < visibleEnd; i++) {
    // Проверяем, не существует ли уже эта строка
    if (!tableBody.querySelector(`tr[data-row="${i}"]`)) {
      const row = createTableRow(i);
      row.style.position = 'absolute';
      row.style.top = `${i * ROW_HEIGHT}px`;
      tableBody.appendChild(row);
    }
  }
}

// Функция создания строки (аналогична вашей, но для одной строки)
function createTableRow(rowIndex) {
    const row = document.createElement("tr");
    row.className = "virtual-row";
    row.dataset.row = rowIndex;

    // Создаем ячейку с адресом
    const addrCell = document.createElement("td");
    addrCell.textContent = toHex(rowIndex, 4);

    // Создаем поле ввода для машинного кода
    const valInput = createInput(rowIndex, "val", 8);


    // Создаем поле ввода для команды
    const cmdInput = createInput(rowIndex, "cmd");

    // Заполняем значения из памяти CPU
    const memoryValue = cpu.readMemory(rowIndex);
    valInput.value = toHex(memoryValue, 2);
    
    // Определяем команду по опкоду
    const opcode = memoryValue;
    const mnemonic = reverseOpcodeMap[toHex(opcode, 2)] || "NOP";
    cmdInput.value = mnemonic;

    // Обработчик фокуса для поля значения
    valInput.addEventListener("focus", () => {
        if (valInput.value === "00") {
            valInput.value = "";
            cmdInput.value = "";
        }
    });

    // Обработчик фокуса для поля команды
    cmdInput.addEventListener("focus", () => {
        if (cmdInput.value === "NOP") {
            valInput.value = "";
            cmdInput.value = "";
        }
    });

    // Обработчик потери фокуса для поля значения
    valInput.addEventListener("blur", () => {
        if (!valInput.value.trim()) {
            valInput.value = "00";
            cmdInput.value = "NOP";
        }
    });

    // Обработчик потери фокуса для поля команды
    cmdInput.addEventListener("blur", () => {
        if (!cmdInput.value.trim()) {
            valInput.value = "00";
            cmdInput.value = "NOP";
        }
    });

    // Обработчик ввода для поля значения
    valInput.addEventListener("input", () => {
        const row = parseInt(valInput.dataset.row, 10);

        // Обновляем память CPU
        const bytes = valInput.value.toUpperCase().split(/\s+/);
        bytes.forEach((byte, i) => {
            if (byte.length === 2) {
                const value = parseInt(byte, 16);
                if (!isNaN(value)) {
                    cpu.writeMemory(row + i, value);
                }
            }
        });

        cmdInput.value = "";
        unclaimIfOccupied(row);
        unmarkOwnedRows(row);

        const [code, arg0, arg1] = valInput.value.toUpperCase().split(" ");
        
        if (code.length !== 2) return;

        const mnemonic = reverseOpcodeMap[code];
        if (!mnemonic) return;

        const [command, args] = mnemonic.split(" ");
        
        valInput.value = valInput.value.toUpperCase();
        cmdInput.value = mnemonic;

        if (commands8BitTail.includes(command)) {
            const data = validateArg(arg0)
                ? arg0
                : document.querySelector(`input[data-row="${row + 1}"][data-col="val"]`)?.value.toUpperCase();

            if (validateArg(data)) {
                const formattedCmd = mnemonic.replace("d8", data);
                cmdInput.value = formattedCmd;

                valInput.value = code;
                setCellValue(row + 1, "val", data);

                markRowReadonly(row + 1, row);
            }
        } else if (commands16BitTail.includes(command)) {
            const lo = validateArg(arg0)
            ? arg0
            : document.querySelector(`input[data-row="${row + 1}"][data-col="val"]`)?.value.toUpperCase();
            const hi = validateArg(arg1)
            ? arg1
            : document.querySelector(`input[data-row="${row + 2}"][data-col="val"]`)?.value.toUpperCase();

            if (validateArg(lo) && validateArg(hi)) {
                const formattedCmd = `${command} ${args.replace(/d16|a16/, hi + lo)}`;
                cmdInput.value = formattedCmd;

                valInput.value = code;
                setCellValue(row + 1, "val", lo);
                setCellValue(row + 2, "val", hi);
                
                markRowReadonly(row + 1, row);
                markRowReadonly(row + 2, row);
            }
        }
    });

    // Обработчик ввода для поля команды
    cmdInput.addEventListener("input", (e) => {
        const row = parseInt(e.target.dataset.row, 10);
        const inputText = cmdInput.value.replace(/,\s+/g, ",").trim();

        unclaimIfOccupied(row);
        unmarkOwnedRows(row);

        const opcode = opcodeMap[inputText];
        if (opcode) return setCellValue(row, "val", opcode);

        const parts = inputText.split(" ");
        const command = parts[0]?.toUpperCase();
        const data = parts[1]?.toUpperCase();

        const mviMatch = inputText.match(/^MVI\s+([A-Z]),([0-9A-F]{2})$/i);
        if (mviMatch) {
            const fullMnemonic = `MVI ${mviMatch[1].toUpperCase()},d8`;
            const code = opcodeMap[fullMnemonic];
            if (code) {
                setCellValue(row, "val", code);
                setCellValue(row + 1, "val", mviMatch[2]);

                markRowReadonly(row + 1, row);

                cmdInput.value = `MVI ${mviMatch[1].toUpperCase()},${mviMatch[2]}`;

                return;
            }
        }

        if (commands8BitTail.includes(command) && data?.length === 2) {
            const code = opcodeMap[`${command} d8`];
            if (code) {
                setCellValue(row, "val", code);
                setCellValue(row + 1, "val", data);

                markRowReadonly(row + 1, row);

                cmdInput.value = `${command} ${data}`;

                return;
            }
        }

        const lxiMatch = inputText.match(/^(\w+)\s+([A-Z]{1,2}),(\w{4})$/i);
        if (lxiMatch) {
            const fullMnemonic = `${lxiMatch[1].toUpperCase()} ${lxiMatch[2].toUpperCase()},d16`;
            const code = opcodeMap[fullMnemonic];
            const data = lxiMatch[3].toUpperCase();
            if (code && data.length === 4) {
                setCellValue(row, "val", code);
                setCellValue(row + 1, "val", data.slice(2, 4));
                setCellValue(row + 2, "val", data.slice(0, 2));

                markRowReadonly(row + 1, row);
                markRowReadonly(row + 2, row);

                cmdInput.value = `${lxiMatch[1]} ${lxiMatch[2]},${data}`;

                return;
            }
        }

        if (commands16BitTail.includes(command) && data?.length === 4) {
            const code = opcodeMap[`${command} a16`];
            if (code) {
                setCellValue(row, "val", code);
                setCellValue(row + 1, "val", data.slice(2, 4));
                setCellValue(row + 2, "val", data.slice(0, 2));

                markRowReadonly(row + 1, row);
                markRowReadonly(row + 2, row);

                cmdInput.value = `${command} ${data}`;
            }
        }

        valInput.value = "";
    });

    // Обработчики навигации по таблице
    [valInput, cmdInput].forEach(input => {
        input.addEventListener("keydown", (e) => {
            const row = parseInt(input.dataset.row);
            const col = input.dataset.col;
            let nextRow = row;
            let nextCol = col;

            if (e.key === "Enter" || (e.key === "ArrowDown" && e.ctrlKey)) {
                nextRow = findVisibleRowBelow(row);
            } else if (e.key === "ArrowUp" && e.ctrlKey) {
                nextRow = findVisibleRowAbove(row);
            } else if (e.key === "ArrowRight" && e.ctrlKey) {
                nextCol = col === "val" ? "cmd" : null;
            } else if (e.key === "ArrowLeft" && e.ctrlKey) {
                nextCol = col === "cmd" ? "val" : null;
            } else return;

            e.preventDefault();

            if (nextCol && nextRow !== null) {
                const nextInput = document.querySelector(`input[data-row="${nextRow}"][data-col="${nextCol}"]`);
                if (nextInput) {
                    nextInput.focus();
                    // Прокручиваем к нужной строке
                    const container = document.getElementById('memoryContainer');
                    const rowTop = nextRow * ROW_HEIGHT;
                    if (rowTop < container.scrollTop || rowTop > container.scrollTop + container.clientHeight) {
                        container.scrollTop = Math.max(0, rowTop - container.clientHeight / 2);
                    }
                }
            }
        });
    });

    // Создаем ячейки и добавляем элементы
    const valCell = document.createElement("td");
    const cmdCell = document.createElement("td");
    valCell.appendChild(valInput);
    cmdCell.appendChild(cmdInput);

    row.appendChild(addrCell);
    row.appendChild(valCell);
    row.appendChild(cmdCell);

    return row;
}

document.addEventListener('DOMContentLoaded', () => {
    initVirtualTable();
});
function refreshVisibleRows() {
  const container = document.getElementById('memoryContainer');
  const scrollTop = container.scrollTop;
  renderVisibleRows();
  container.scrollTop = scrollTop; // Сохраняем позицию скролла
}

function updateTableRow(address) {
  const row = tableBody.querySelector(`tr[data-row="${address}"]`);
  if (!row) return;
  
  const valInput = row.querySelector('input[data-col="val"]');
  if (valInput) {
    const memoryValue = cpu.readMemory(address);
    valInput.value = toHex(memoryValue, 2);
  }
  
  // Также обновим команду, если нужно
  const cmdInput = row.querySelector('input[data-col="cmd"]');
  if (cmdInput) {
    const opcode = cpu.readMemory(address);
    const mnemonic = reverseOpcodeMap[toHex(opcode, 2)] || "NOP";
    cmdInput.value = mnemonic;
  }
  refreshVisibleRows();
}