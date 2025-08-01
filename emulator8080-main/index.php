<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="UTF-8">
  <title>Intel 8080</title>
  <link rel="stylesheet" href="./css/styles.css">
</head>

<body>
  <div class="container">
    <div class="left-container">
      <span class="border-label-left">Состояния</span>
    <div class="cycle">
      <div class="data-block">
        <p id="currentCycle">Текущий такт: -</p>
      </div>
    </div>
    <div class="data-container">
      <div class="data-container1">
        <div class="flags-indicator">
            <div class="flag">
                <div class="flag-name" data-flag='Z'>Z</div>
                <div class="lamp"></div>
            </div>
            <div class="flag">
                <div class="flag-name" data-flag='S'>S</div>
                <div class="lamp"></div>
            </div>
            <div class="flag">
                <div class="flag-name" data-flag='P'>P</div>
                <div class="lamp"></div>
            </div>
            <div class="flag">
                <div class="flag-name" data-flag='C'>C</div>
                <div class="lamp"></div>
            </div>
            <div class="flag">
                <div class="flag-name" data-flag='AC'>AC</div>
                <div class="lamp"></div>
            </div>
        </div>
        <div class="data-block">
          <p>Буфер данных</p>
          <p id="dataBuf">00</p>
        </div>
      </div>

      <div class="data-container2">
        <div class="data-block">
          <p data-reg='A'>A</p>
          <p>00</p>
        </div>
          <div class="data-block">
          <p>Буф рег 1</p>
          <p id="regBuf1">00</p>
        </div>
        <div class="data-block data-container2_currentCommandHex" id="executionInfo">
          <p>Рег. команд</p>
          <p id="currentCommandHex">-</p>
        </div>
      </div>

      <div class="data-container3">
        <div class="data-block">
          <p>Буф рег 2</p>
          <p id="regBuf2">00</p>
        </div>
        <div class="data-block data-container3_currentCommandText" id="executionInfo">
          <p>Д/Ш команд</p>
          <p id="currentCommandText">-</p>
        </div>
      </div>
    </div>
   
  <div class="inf-container">
      <table class="reg-table">
        <tr>
          <td colspan="2" class="full-row">Мультиплексор</td>
        </tr>
        <tr>
          <td colspan="2" class="full-row">Регистры временного хранения</td>
        </tr>
        <tr>
            <td>
                <div class="register-cell">
                    <p class="register-name" data-reg='W'>W</p>
                    <p class="register-value">00</p>
                </div>
            </td>
            <td>
                <div class="register-cell">
                    <p class="register-name" data-reg='Z'>Z</p>
                    <p class="register-value">00</p>
                </div>
            </td>
        </tr>
        <tr>
            <td colspan="2" class="section-title">Регистры общего назначения (РОН)</td>
        </tr>
        <tr>
            <td>
                <div class="register-cell">
                    <p class="register-name" data-reg='B'>B</p>
                    <p class="register-value">00</p>
                </div>
            </td>
            <td>
                <div class="register-cell">
                    <p class="register-name" data-reg='C'>C</p>
                    <p class="register-value">00</p>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="register-cell">
                    <p class="register-name" data-reg='D'>D</p>
                    <p class="register-value">00</p>
                </div>
            </td>
            <td>
                <div class="register-cell">
                    <p class="register-name" data-reg='E'>E</p>
                    <p class="register-value">00</p>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="register-cell">
                    <p class="register-name" data-reg='H'>H</p>
                    <p class="register-value">00</p>
                </div>
            </td>
            <td>
                <div class="register-cell">
                    <p class="register-name" data-reg='L'>L</p>
                    <p class="register-value">00</p>
                </div>
            </td>
        </tr>
        <tr>
            <td id="stackPointer" colspan="2" class="full-row">Указатель стека (УС): <span class="sp-value">FFFF</span></td>
        </tr>
        <tr>
            <td id="programCounter" colspan="2" class="full-row">Счётчик команд (СК): <span class="pc-value">0000</span></td>
        </tr>
    </table>
    <div class="data-block">
      <p>Буфер адреса</p>
      <p id="adrBuf">0000</p>
    </div>
  </div>
  </div>
      
  <div class="right-container">
    <div class="input-container">
      <span class="border-label-right">Ячейка ОЗУ и её значение</span>
      <div class="input-table-container">
        <div class="virtual-container" id="memoryContainer">
          <table class="input-table" id="memoryTable">
            <thead>
              <tr>
                <th>Адрес</th>
                <th>Машинный код</th>
                <th>Команда</th>
              </tr>
            </thead>
            <tbody id="memoryTableBody"></tbody>
          </table>
        </div>
      </div>
      <div class="searchPC">
        <p>Найти ячейку ОЗУ</p>
        <input class="searchPC__input" type="text">
      </div>
    </div>
    <div class="buttons-container"> 
      <div>
        <span class="border-label-right">Кнопки</span>
        <button class="command-complete" id="commandComplete">Выполнить команду</button>
        <button class="command-complete" id="cycleComplete">Выполнить такт</button>
      </div>
      <div>
        <button class="prog-change" id="resetCompliting">Старт</button>
        <button class="prog-change" id="clearAllCommands">Очистить</button>
        <button class="prog-change" id="buttonView">Команды</button>
      </div>
    </div>
  </div>
  </div>

  <img class="arrow-image" src="arrows.png">

  <div id="modalOverlay" class="modal-overlay opcode-table_hidden">
    <div class="modal-content">
      <table id="opcodeTable" class="opcode-table"><!--opcode-table_hidden -->
        <tbody>
          <tr class="inf tr1">
            <td class="withborder inf">&nbsp;</td>
            <td class="withborder"><b>&nbsp;x0&nbsp;</b></td>
            <td class="withborder"><b>&nbsp;x1&nbsp;</b></td>
            <td class="withborder"><b>&nbsp;x2&nbsp;</b></td>
            <td class="withborder"><b>&nbsp;x3&nbsp;</b></td>
            <td class="withborder"><b>&nbsp;x4&nbsp;</b></td>
            <td class="withborder"><b>&nbsp;x5&nbsp;</b></td>
            <td class="withborder"><b>&nbsp;x6&nbsp;</b></td>
            <td class="withborder"><b>&nbsp;x7&nbsp;</b></td>
            <td class="withborder"><b>&nbsp;x8&nbsp;</b></td>
            <td class="withborder"><b>&nbsp;x9&nbsp;</b></td>
            <td class="withborder"><b>&nbsp;xA&nbsp;</b></td>
            <td class="withborder"><b>&nbsp;xB&nbsp;</b></td>
            <td class="withborder"><b>&nbsp;xC&nbsp;</b></td>
            <td class="withborder"><b>&nbsp;xD&nbsp;</b></td>
            <td class="withborder"><b>&nbsp;xE&nbsp;</b></td>
            <td class="withborder"><b>&nbsp;xF&nbsp;</b></td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;0x&nbsp;</b></td>
            <td class="withborder misc">NOP<br>1&nbsp;&nbsp;4<br>- - - - -</td>
            <td class="withborder bit16-load">LXI B,d16<br>3&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder bit8-load">STAX B<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit16-arith">INX B<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-arith">INR B<br>1&nbsp;&nbsp;5<br>S Z A P -</td>
            <td class="withborder bit8-arith">DCR B<br>1&nbsp;&nbsp;5<br>S Z A P -</td>
            <td class="withborder bit8-load">MVI B,d8<br>2&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-arith">RLC<br>1&nbsp;&nbsp;4<br>- - - - C</td>
            <td class="withborder misc">*NOP<br>1&nbsp;&nbsp;4<br>- - - - -</td>
            <td class="withborder bit16-arith">DAD B<br>1&nbsp;&nbsp;10<br>- - - - C</td>
            <td class="withborder bit8-load">LDAX B<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit16-arith">DCX B<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-arith">INR C<br>1&nbsp;&nbsp;5<br>S Z A P -</td>
            <td class="withborder bit8-arith">DCR C<br>1&nbsp;&nbsp;5<br>S Z A P -</td>
            <td class="withborder bit8-load">MVI C,d8<br>2&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-arith">RRC<br>1&nbsp;&nbsp;4<br>- - - - C</td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;1x&nbsp;</b></td>
            <td class="withborder misc">*NOP<br>1&nbsp;&nbsp;4<br>- - - - -</td>
            <td class="withborder bit16-load">LXI D,d16<br>3&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder bit8-load">STAX D<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit16-arith">INX D<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-arith">INR D<br>1&nbsp;&nbsp;5<br>S Z A P -</td>
            <td class="withborder bit8-arith">DCR D<br>1&nbsp;&nbsp;5<br>S Z A P -</td>
            <td class="withborder bit8-load">MVI D,d8<br>2&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-arith">RAL<br>1&nbsp;&nbsp;4<br>- - - - C</td>
            <td class="withborder misc">*NOP<br>1&nbsp;&nbsp;4<br>- - - - -</td>
            <td class="withborder bit16-arith">DAD D<br>1&nbsp;&nbsp;10<br>- - - - C</td>
            <td class="withborder bit8-load">LDAX D<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit16-arith">DCX D<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-arith">INR E<br>1&nbsp;&nbsp;5<br>S Z A P -</td>
            <td class="withborder bit8-arith">DCR E<br>1&nbsp;&nbsp;5<br>S Z A P -</td>
            <td class="withborder bit8-load">MVI E,d8<br>2&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-arith">RAR<br>1&nbsp;&nbsp;4<br>- - - - C</td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;2x&nbsp;</b></td>
            <td class="withborder misc">*NOP<br>1&nbsp;&nbsp;4<br>- - - - -</td>
            <td class="withborder bit16-load">LXI H,d16<br>3&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder bit16-load">SHLD a16<br>3&nbsp;&nbsp;16<br>- - - - -</td>
            <td class="withborder bit16-arith">INX H<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-arith">INR H<br>1&nbsp;&nbsp;5<br>S Z A P -</td>
            <td class="withborder bit8-arith">DCR H<br>1&nbsp;&nbsp;5<br>S Z A P -</td>
            <td class="withborder bit8-load">MVI H,d8<br>2&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-arith">DAA<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborde misc">*NOP<br>1&nbsp;&nbsp;4<br>- - - - -</td>
            <td class="withborder bit16-arith">DAD H<br>1&nbsp;&nbsp;10<br>- - - - C</td>
            <td class="withborder bit16-load">LHLD a16<br>3&nbsp;&nbsp;16<br>- - - - -</td>
            <td class="withborder bit16-arith">DCX H<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-arith">INR L<br>1&nbsp;&nbsp;5<br>S Z A P -</td>
            <td class="withborder bit8-arith">DCR L<br>1&nbsp;&nbsp;5<br>S Z A P -</td>
            <td class="withborder bit8-load">MVI L,d8<br>2&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-arith">CMA<br>1&nbsp;&nbsp;4<br>- - - - -</td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;3x&nbsp;</b></td>
            <td class="withborder misc">*NOP<br>1&nbsp;&nbsp;4<br>- - - - -</td>
            <td class="withborder bit16-load">LXI SP,d16<br>3&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder bit8-load">STA a16<br>3&nbsp;&nbsp;13<br>- - - - -</td>
            <td class="withborder bit16-arith">INX SP<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-arith">INR M<br>1&nbsp;&nbsp;10<br>S Z A P -</td>
            <td class="withborder bit8-arith">DCR M<br>1&nbsp;&nbsp;10<br>S Z A P -</td>
            <td class="withborder bit8-load">MVI M,d8<br>2&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder bit8-arith">STC<br>1&nbsp;&nbsp;4<br>- - - - C</td>
            <td class="withborder misc">*NOP<br>1&nbsp;&nbsp;4<br>- - - - -</td>
            <td class="withborder bit16-arith">DAD SP<br>1&nbsp;&nbsp;10<br>- - - - C</td>
            <td class="withborder bit8-load">LDA a16<br>3&nbsp;&nbsp;13<br>- - - - -</td>
            <td class="withborder bit16-arith">DCX SP<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-arith">INR A<br>1&nbsp;&nbsp;5<br>S Z A P -</td>
            <td class="withborder bit8-arith">DCR A<br>1&nbsp;&nbsp;5<br>S Z A P -</td>
            <td class="withborder bit8-load">MVI A,d8<br>2&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-arith">CMC<br>1&nbsp;&nbsp;4<br>- - - - C</td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;4x&nbsp;</b></td>
            <td class="withborder bit8-load">MOV B,B<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV B,C<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV B,D<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV B,E<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV B,H<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV B,L<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV B,M<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-load">MOV B,A<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV C,B<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV C,C<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV C,D<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV C,E<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV C,H<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV C,L<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV C,M<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-load">MOV C,A<br>1&nbsp;&nbsp;5<br>- - - - -</td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;5x&nbsp;</b></td>
            <td class="withborder bit8-load">MOV D,B<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV D,C<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV D,D<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV D,E<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV D,H<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV D,L<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV D,M<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-load">MOV D,A<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV E,B<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV E,C<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV E,D<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV E,E<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV E,H<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV E,L<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV E,M<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-load">MOV E,A<br>1&nbsp;&nbsp;5<br>- - - - -</td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;6x&nbsp;</b></td>
            <td class="withborder bit8-load">MOV H,B<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV H,C<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV H,D<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV H,E<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV H,H<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV H,L<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV H,M<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-load">MOV H,A<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV L,B<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV L,C<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV L,D<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV L,E<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV L,H<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV L,L<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV L,M<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-load">MOV L,A<br>1&nbsp;&nbsp;5<br>- - - - -</td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;7x&nbsp;</b></td>
            <td class="withborder bit8-load">MOV M,B<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-load">MOV M,C<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-load">MOV M,D<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-load">MOV M,E<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-load">MOV M,H<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-load">MOV M,L<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder misc">HLT<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-load">MOV M,A<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-load">MOV A,B<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV A,C<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV A,D<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV A,E<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV A,H<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV A,L<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder bit8-load">MOV A,M<br>1&nbsp;&nbsp;7<br>- - - - -</td>
            <td class="withborder bit8-load">MOV A,A<br>1&nbsp;&nbsp;5<br>- - - - -</td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;8x&nbsp;</b></td>
            <td class="withborder bit8-arith">ADD B<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ADD C<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ADD D<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ADD E<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ADD H<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ADD L<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ADD M<br>1&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder bit8-arith">ADD A<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ADC B<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ADC C<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ADC D<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ADC E<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ADC H<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ADC L<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ADC M<br>1&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder bit8-arith">ADC A<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;9x&nbsp;</b></td>
            <td class="withborder bit8-arith">SUB B<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">SUB C<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">SUB D<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">SUB E<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">SUB H<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">SUB L<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">SUB M<br>1&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder bit8-arith">SUB A<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">SBB B<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">SBB C<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">SBB D<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">SBB E<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">SBB H<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">SBB L<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">SBB M<br>1&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder bit8-arith">SBB A<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;Ax&nbsp;</b></td>
            <td class="withborder bit8-arith">ANA B<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ANA C<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ANA D<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ANA E<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ANA H<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ANA L<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ANA M<br>1&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder bit8-arith">ANA A<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">XRA B<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">XRA C<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">XRA D<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">XRA E<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">XRA H<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">XRA L<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">XRA M<br>1&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder bit8-arith">XRA A<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;Bx&nbsp;</b></td>
            <td class="withborder bit8-arith">ORA B<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ORA C<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ORA D<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ORA E<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ORA H<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ORA L<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">ORA M<br>1&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder bit8-arith">ORA A<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">CMP B<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">CMP C<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">CMP D<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">CMP E<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">CMP H<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">CMP L<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
            <td class="withborder bit8-arith">CMP M<br>1&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder bit8-arith">CMP A<br>1&nbsp;&nbsp;4<br>S Z A P C</td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;Cx&nbsp;</b></td>
            <td class="withborder jmp">RNZ<br>1&nbsp;&nbsp;11/5<br>- - - - -</td>
            <td class="withborder bit16-load">POP B<br>1&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder jmp">JNZ a16<br>3&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder jmp">JMP a16<br>3&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder jmp">CNZ a16<br>3&nbsp;&nbsp;17/11<br>- - - - -</td>
            <td class="withborder bit16-load">PUSH B<br>1&nbsp;&nbsp;11<br>- - - - -</td>
            <td class="withborder bit8-arith">ADI d8<br>2&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder jmp">RST 0<br>1&nbsp;&nbsp;11<br>- - - - -</td>
            <td class="withborder jmp">RZ<br>1&nbsp;&nbsp;11/5<br>- - - - -</td>
            <td class="withborder jmp">RET<br>1&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder jmp">JZ a16<br>3&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder jmp">*JMP a16<br>3&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder jmp">CZ a16<br>3&nbsp;&nbsp;17/11<br>- - - - -</td>
            <td class="withborder jmp">CALL a16<br>3&nbsp;&nbsp;17<br>- - - - -</td>
            <td class="withborder bit8-arith">ACI d8<br>2&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder jmp">RST 1<br>1&nbsp;&nbsp;11<br>- - - - -</td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;Dx&nbsp;</b></td>
            <td class="withborder jmp">RNC<br>1&nbsp;&nbsp;11/5<br>- - - - -</td>
            <td class="withborder bit16-load">POP D<br>1&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder jmp">JNC a16<br>3&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder misc">OUT d8<br>2&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder jmp">CNC a16<br>3&nbsp;&nbsp;17/11<br>- - - - -</td>
            <td class="withborder bit16-load">PUSH D<br>1&nbsp;&nbsp;11<br>- - - - -</td>
            <td class="withborder bit8-arith">SUI d8<br>2&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder jmp">RST 2<br>1&nbsp;&nbsp;11<br>- - - - -</td>
            <td class="withborder jmp">RC<br>1&nbsp;&nbsp;11/5<br>- - - - -</td>
            <td class="withborder jmp">*RET<br>1&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder jmp">JC a16<br>3&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder misc">IN d8<br>2&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder jmp">CC a16<br>3&nbsp;&nbsp;17/11<br>- - - - -</td>
            <td class="withborder jmp">*CALL a16<br>3&nbsp;&nbsp;17<br>- - - - -</td>
            <td class="withborder bit8-arith">SBI d8<br>2&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder jmp">RST 3<br>1&nbsp;&nbsp;11<br>- - - - -</td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;Ex&nbsp;</b></td>
            <td class="withborder jmp">RPO<br>1&nbsp;&nbsp;11/5<br>- - - - -</td>
            <td class="withborder bit16-load">POP H<br>1&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder jmp">JPO a16<br>3&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder bit16-load">XTHL<br>1&nbsp;&nbsp;18<br>- - - - -</td>
            <td class="withborder jmp">CPO a16<br>3&nbsp;&nbsp;17/11<br>- - - - -</td>
            <td class="withborder bit16-load">PUSH H<br>1&nbsp;&nbsp;11<br>- - - - -</td>
            <td class="withborder bit8-arith">ANI d8<br>2&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder jmp">RST 4<br>1&nbsp;&nbsp;11<br>- - - - -</td>
            <td class="withborder jmp">RPE<br>1&nbsp;&nbsp;11/5<br>- - - - -</td>
            <td class="withborder jmp">PCHL<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder jmp">JPE a16<br>3&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder bit16-load">XCHG<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder jmp">CPE a16<br>3&nbsp;&nbsp;17/11<br>- - - - -</td>
            <td class="withborder jmp">*CALL a16<br>3&nbsp;&nbsp;17<br>- - - - -</td>
            <td class="withborder bit8-arith">XRI d8<br>2&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder jmp">RST 5<br>1&nbsp;&nbsp;11<br>- - - - -</td>
          </tr>
          <tr class="tr1">
            <td class="withborder inf"><b>&nbsp;Fx&nbsp;</b></td>
            <td class="withborder jmp">RP<br>1&nbsp;&nbsp;11/5<br>- - - - -</td>
            <td class="withborder bit16-load">POP PSW<br>1&nbsp;&nbsp;10<br>S Z A P C</td>
            <td class="withborder jmp">JP a16<br>3&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder misc">DI<br>1&nbsp;&nbsp;4<br>- - - - -</td>
            <td class="withborder jmp">CP a16<br>3&nbsp;&nbsp;17/11<br>- - - - -</td>
            <td class="withborder bit16-load">PUSH PSW<br>1&nbsp;&nbsp;11<br>- - - - -</td>
            <td class="withborder bit8-arith">ORI d8<br>2&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder jmp">RST 6<br>1&nbsp;&nbsp;11<br>- - - - -</td>
            <td class="withborder jmp">RM<br>1&nbsp;&nbsp;11/5<br>- - - - -</td>
            <td class="withborder bit16-load">SPHL<br>1&nbsp;&nbsp;5<br>- - - - -</td>
            <td class="withborder jmp">JM a16<br>3&nbsp;&nbsp;10<br>- - - - -</td>
            <td class="withborder misc">EI<br>1&nbsp;&nbsp;4<br>- - - - -</td>
            <td class="withborder jmp">CM a16<br>3&nbsp;&nbsp;17/11<br>- - - - -</td>
            <td class="withborder jmp">*CALL a16<br>3&nbsp;&nbsp;17<br>- - - - -</td>
            <td class="withborder bit8-arith">CPI d8<br>2&nbsp;&nbsp;7<br>S Z A P C</td>
            <td class="withborder jmp">RST 7<br>1&nbsp;&nbsp;11<br>- - - - -</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <script src="./core/opcode_map.js" defer></script>
  <script src="./core/cpu.js" defer></script>
  <script src="./core/mains.js" defer></script>
  <script src="./core/commands.js" defer></script>
  <script src="./core/special_command.js" defer></script>
  <script src="./core/modal_window.js" defer></script>
</body>

</html>