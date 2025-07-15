const commandComplete = document.querySelector("#commandComplete");
const resetCompliting = document.querySelector("#resetCompliting");

const currentCommandHex = document.querySelector("#currentCommandHex");
const currentCommandText = document.querySelector("#currentCommandText");

let currentHighlightedRow = -1;

commandComplete.addEventListener("click", () => {
  // Сначала убираем подсветку со всех строк
  tableBody.querySelectorAll(".highlighted-command").forEach(row => {
    if (!row.classList.contains("readonly-row")) {
      row.classList.remove("highlighted-command");
    }
  });

  // Находим следующую команду для подсветки
  let skipCount = 0;
  for (let i = currentHighlightedRow + 1; i < numRows; i++) {
    const row = tableBody.querySelector(`tr[data-row="${i}"]`);
    // Пропускаем readonly строки
    if (row.classList.contains("readonly-row")) continue;
    
    const cmdInput = row.querySelector('input[data-col="cmd"]');
    const valInput = row.querySelector('input[data-col="val"]');
    
    if (skipCount > 0) {
      skipCount--;
      continue;
    }

    if (cmdInput && cmdInput.value.trim() !== "") {
      // Проверяем, является ли команда 16-битной
      const cmdParts = cmdInput.value.split(" ");
      const command = cmdParts[0];
      
      if (commands16BitTail.includes(command)) {
        skipCount = 2; // Пропускаем следующие 2 строки (аргументы)
      }

      // Подсвечиваем найденную строку
      row.classList.add("highlighted-command");
      currentHighlightedRow = i;
      
      // Обновляем информацию о команде
      updateCommandInfo(row, valInput.value, cmdInput.value);
      
      // Прокручиваем таблицу к подсвеченной строке
      row.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  }

  // Если дошли до конца - сбрасываем
  currentHighlightedRow = -1;
  currentCommandHex.textContent = "Hex: -";
  currentCommandText.textContent = "Text: -";
});

resetCompliting.addEventListener("click", () => {
  tableBody.querySelectorAll(".highlighted-command").forEach(row => {
    row.classList.remove("highlighted-command");
  });
  currentHighlightedRow = -1;
  currentCommandHex.textContent = "Hex: -";
  currentCommandText.textContent = "Text: -";
});

function updateCommandInfo(row, hexValue, commandText) {
  const address = row.dataset.row;
  const fullHex = getFullCommandHex(address);
  
  currentCommandHex.textContent = `Hex: ${fullHex} (at ${toHex(parseInt(address), 4)})`;
  currentCommandText.textContent = `Text: ${commandText}`;
}

function getFullCommandHex(address) {
  const row = parseInt(address, 10);
  const valInput = document.querySelector(`input[data-row="${row}"][data-col="val"]`);
  
  if (!valInput) return "";
  
  let hexParts = [valInput.value];
  
  // Проверяем, является ли команда многострочной
  const cmdInput = document.querySelector(`input[data-row="${row}"][data-col="cmd"]`);
  if (!cmdInput) return valInput.value;
  
  const cmdText = cmdInput.value;
  const parts = cmdText.split(" ");
  const command = parts[0];
  
  if (commands8BitTail.includes(command)) {
    const nextRowVal = document.querySelector(`input[data-row="${row + 1}"][data-col="val"]`);
    if (nextRowVal) hexParts.push(nextRowVal.value);
  } 
  else if (commands16BitTail.includes(command)) {
    const nextRowVal1 = document.querySelector(`input[data-row="${row + 1}"][data-col="val"]`);
    const nextRowVal2 = document.querySelector(`input[data-row="${row + 2}"][data-col="val"]`);
    if (nextRowVal1 && nextRowVal2) {
      hexParts.push(nextRowVal1.value);
      hexParts.push(nextRowVal2.value);
    }
  }
  
  return hexParts.join(" ").toUpperCase();
}