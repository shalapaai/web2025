class CPU8080 {
  constructor() {
    this.registers = {
      A: new Register8(),  // Accumulator
      B: new Register8(),
      C: new Register8(),
      D: new Register8(),
      E: new Register8(),
      H: new Register8(),
      L: new Register8(),
      SP: new Register16(), // Stack Pointer
      PC: new Register16()  // Program Counter
    };
    
    this.flags = {
      S: 0,  // Sign
      Z: 0,  // Zero
      AC: 0, // Aux Carry
      P: 0,  // Parity
      CY: 0  // Carry
    };
    
    this.state = {
      currentOpcode: null,
      machineCycle: 0,
      tState: 0,
      halted: false,
      interruptsEnabled: false
    };
    
    this.memory = new Uint8Array(0x10000); // 64KB memory
    this.history = [];
  }
  
  reset() {
    // Reset all registers and flags
    Object.values(this.registers).forEach(reg => reg.set(0));
    Object.keys(this.flags).forEach(flag => this.flags[flag] = 0);
    
    this.state = {
      currentOpcode: null,
      machineCycle: 0,
      tState: 0,
      halted: false,
      interruptsEnabled: false
    };
  }
  
  step() {
    if (this.state.halted) return;
    
    // Record previous state
    const prevState = this.snapshot();
    
    // Execute current t-state
    this.executeTState();
    
    // Record changes
    this.recordHistory(prevState);
    
    // Advance to next t-state or opcode
    this.advanceState();
  }
  
  executeTState() {
    // Implementation depends on current state
    switch (this.state.tState) {
      case 0: // Opcode fetch
        this.state.currentOpcode = this.readMemory(this.registers.PC.get());
        this.registers.PC.increment();
        break;
        
      // Add more t-states for different instructions
    }
  }
  
  snapshot() {
    return {
      registers: {
        A: this.registers.A.get(),
        B: this.registers.B.get(),
        C: this.registers.C.get(),
        D: this.registers.D.get(),
        E: this.registers.E.get(),
        H: this.registers.H.get(),
        L: this.registers.L.get(),
        SP: this.registers.SP.get(),
        PC: this.registers.PC.get()
      },
      flags: {...this.flags},
      state: {...this.state}
    };
  }
  
  recordHistory(prevState) {
    // Compare and record changes
    const changes = {};
    const current = this.snapshot();
    
    // Compare registers
    for (const reg in current.registers) {
      if (current.registers[reg] !== prevState.registers[reg]) {
        changes[reg] = {
          from: prevState.registers[reg],
          to: current.registers[reg]
        };
      }
    }
    
    // Compare flags
    for (const flag in current.flags) {
      if (current.flags[flag] !== prevState.flags[flag]) {
        changes[flag] = {
          from: prevState.flags[flag],
          to: current.flags[flag]
        };
      }
    }
    
    this.history.push({
      tick: this.history.length,
      instruction: this.state.currentOpcode,
      changes,
      state: {...current.state}
    });
  }
  
  // ... other methods
}

class Register8 {
  constructor() {
    this.value = 0;
    this.changed = false;
  }
  
  get() {
    return this.value;
  }
  
  set(val) {
    this.value = val & 0xFF;
    this.changed = true;
  }
  
  increment() {
    this.set(this.value + 1);
  }
  
  decrement() {
    this.set(this.value - 1);
  }
}

class Register16 {
  constructor() {
    this.high = new Register8();
    this.low = new Register8();
  }
  
  get() {
    return (this.high.get() << 8) | this.low.get();
  }
  
  set(val) {
    this.high.set((val >> 8) & 0xFF);
    this.low.set(val & 0xFF);
  }
  
  increment() {
    const current = this.get();
    this.set(current + 1);
  }
  
  decrement() {
    const current = this.get();
    this.set(current - 1);
  }
}