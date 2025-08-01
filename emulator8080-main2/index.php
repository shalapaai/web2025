<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="UTF-8">
  <title>ОЗУ Intel 8080</title>
  <link rel="stylesheet" href="./css/style.css">
</head>

<body>
  <div class="container">
    

    <div>
      <table class="reg-table">
        <thead>
          <tr>
            <th>Регистр</th>
            <th>Значение</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>W</th>
            <th>00</th>
          </tr>
          <tr>
            <th>Z</th>
            <th>00</th>
          </tr>
          <tr>
            <th>A</th>
            <th>00</th>
          </tr>
          <tr>
            <th>B</th>
            <th>00</th>
          </tr>
          <tr>
            <th>C</th>
            <th>00</th>
          </tr>
          <tr>
            <th>D</th>
            <th>00</th>
          </tr>
          <tr>
            <th>E</th>
            <th>00</th>
          </tr>
          <tr>
            <th>H</th>
            <th>00</th>
          </tr>
          <tr>
            <th>L</th>
            <th>00</th>
          </tr>
          <tr>
            <th id="stackPointer">Указатель стека</th>
            <th>FFFF</th>
          </tr>
          <tr>
            <th id="programCounter">Счетчик команд</th>
            <th>0000</th>
          </tr>
        </tbody>
      </table>

      <table class="flags-table">
        <thead>
          <tr>
            <th>Флаг</th>
            <th>Значение</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>C</th>
            <th>0</th>
          </tr>
          <tr>
            <th>P</th>
            <th>0</th>
          </tr>
          <tr>
            <th>AC</th>
            <th>0</th>
          </tr>
          <tr>
            <th>Z</th>
            <th>0</th>
          </tr>
          <tr>
            <th>S</th>
            <th>0</th>
          </tr>

        </tbody>
      </table>
    </div>
    <div class="but-buf-container">
      <div>
        <button class="command-complete" id="commandComplete">Выполнить команду</button>
        <button class="command-complete" id="cycleComplete">Выполнить такт</button>
      </div>
      <div>
        <button class="prog-change" id="resetCompliting">Перезагрузить</button>
        <button class="prog-change" id="clearAllCommands">Очистить</button>
        <button class="prog-change" id="buttonView">Список команд</button>
      </div>
      
      <div class="buf-container">
        <div class="data-block" id="executionInfo">
          <p id="currentCommandHex">Рег. команд: -</p>
          <p id="currentCommandText">Д/Ш команд: -</p>
        </div>

        <div class="data-block">
          <p id="adrBuf">Буфер адреса: 0000</p>
        </div>

        <div class="data-block">
          <p id="dataBuf">Буфер данных: 00</p>
        </div>
      </div>
      <div>
        <div class="data-block">
          <p id="regBuf1">Буферный регистр 1: 00</p>
        </div>
        <div class="data-block">
          <p id="regBuf2">Буферный регситр 2: 00</p>
        </div>
      </div>
    </div>

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
  <script src="./core/command.js" defer></script>
  <script src="./core/special_commands.js" defer></script>
  <script src="./core/modal_window.js" defer></script>
</body>

</html>