// 1. Deposit some Money
// 2. Determine number of lines to bet on
// 3. Collect a bet Amount
// 4. Spin the slot machine
// 5. check if the user won
// 6. won => give the user thier winnings
// 7. lost => take thier bet -> play again
// 8. check the bet money

// Input 
const prompt = require("prompt-sync")();

// Specifying the matrix ( 3 , 3)
const ROWS = 3;
const COLS = 3;

// specifying no of each element in a Column[A(2),B(4),C(6),D(8)]
const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};


// Score for each symbol 
const SYMBOLS_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

// Depositing the initial Amount (Balance)
const deposit = () => {
  // Doesn't break unless a return statement is given ( only right value will break the loop)
  while (true) {
    // getting the amount
    const depositAmount = prompt("Enter a deposit amount : ");
    // converting string => float
    const numberDepositAmount = parseFloat(depositAmount);
    // validating the Amount ( not an number , less or equal to 0)
    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("invalid deposit amount");
    } else {
      console.log(numberDepositAmount);
      return numberDepositAmount;
    }
  }
};

const getNumberOfLine = () => {
  // Doesn't break unless a return statement is given ( only right value will break the loop)
  while (true) {
    // Input can be given within 1 - 3
    const lines = parseInt(
      prompt("Enter the Number of lines to bet (1 - 3) : ")
    );
    // validation of lines input ( not an number , less or equal to 0 , greater than 3)
    if (isNaN(lines) || lines <= 0 || lines > 3) {
      console.log("invalid number of lines");
    } else {
      console.log(lines);
      return lines;
    }
  }
};

const getBet = (balance, lines) => {
  // Doesn't break unless a return statement is given ( only right value will break the loop)
  while (true) {
    // getting the bet amount per line ( see the description on the bet)
    const bet = parseFloat(prompt("Enter the total Bet per line : "));
    // minimum balance > 0
    if (balance > 0) {
      // validation of lines input ( not an number , less or equal to 0)
      if (isNaN(bet) || bet <= 0) {
        console.log("Invalid bet");
      } else {
        // bet won't be greater than balance
        if (bet > balance / lines) {
          console.log(
            `Insufficient Balance amount \nBalance Amount per linel is ${
              balance / lines
            }`
          );
        } else {
          console.log(bet);
          return bet;
        }
      }
    } else {
      console.log("No Balance Amount");
    }
  }
};

const spin = () => {
  // creating a empty array of symbols
  const symbols = [];
  // looping through SYMBOLS_COUNT
  // Object.entries() will give an array of arrays which containe [key ,value] of the object 
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    // Here this will the push the elements (A,B,C,D) with thier respective counts
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
      // the exact array will look like this symbol = [A,A,B,B,B,B,C,C,C,C,C,C,D,D,D,D,D,D,D,D]
    }
  }
  // Columns empty array
  const reels = []; 
  // Iteration on COLS = 3
  for (let i = 0; i < COLS; i++) {
    // creating an inner array inside reels array
    reels.push([]);
    // using spread operator to store all the symbols inside reelSymbols
    const reelSymbols = [...symbols];
    // 1 Columns contains 3 rows ( 3 rows X 3 columns = 9 elements which is ( 3 lines of slot machine))
    // Iteration on ROWS = 3;
    for (let j = 0; j < ROWS; j++) {
      // generating a random number between 0 and lastElement of reelSymbol array
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      // assingin the randomIndex as index of reelSymbol and storing it in the selected Symbol
      const selectedSymbol = reelSymbols[randomIndex];
      // Now pushing the selected Symbol inside the reels array 
      reels[i].push(selectedSymbol);
      // This ensures that same number doesn't repeat in another row of the same column
      reelSymbols.splice(randomIndex, 1);
    }
  }
  // returns an nested array in  array[[arr1],[arr2],[arr3] arr1,2,3 contains 3 elements in them
  return reels;
};

const transpose = (reels) => {
  // declare an empty string
  const rows = [];
  // run loop on rows(n)
  for (let i = 0; i < ROWS; i++) {
    // creates n arrasy inside the rows array
    rows.push([]);
    // run loop on cols
    for (let j = 0; j < COLS; j++) {
      // inserts the the n values of cols in n row
      rows[i].push(reels[j][i]);
    }
  }
  // returs a tranposed matrix rows => cols and cols => rows
  // [[1,2,3],           [[1,4,5],
  //  [4,5,6],      =>    [2,5,8],     -> we're doing this so that we can check inside one row if it has all
  //  [7,8,9]]            [7,8,9],]       values are same
  return rows;
};

const printRows = (rows) => {
  // Iteration throgh rows array
  for (const row of rows) {
    // declare a empty string for each row
    let rowString = "";
    // for every row or rows array an index and an symbol is given
    for (const [i, symbol] of row.entries()) {
      // here the row has i symbols 
      rowString += symbol;
      // last row won't get the |
      if (i != rows.length - 1) {
        rowString += " | ";
      }
    }
    // display to check the slot machine out come 
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  // intializing the winning amount to be zero
  let winnings = 0;
  // iteration over no of lines given
  for (let row = 0; row < lines; row++) {
    // assigns the symbol in rows[row] to symbols array
    const symbols = rows[row];
    // setting the allSame true ( Status : Won ) in default
    let allSame = true;
    // Iteration over symbols
    for (const symbol of symbols) {
      // if any of the symbol in symbols is not equal to the first elemen of symbol
      if (symbol != symbols[0]) {
        // setting allSame to false ( Status : Lost)
        allSame = false;
        // break the loop
        break;
      }
    }
    
    // if all same is true
    if (allSame) {
      // winning = (bet * symbol value) * lines ( It does happens when this loop iterates for lines )
      winnings += bet * SYMBOLS_VALUES[symbols[0]];
    }
  }
  // return the winnings ( excluding balance,bet amount )
  return winnings;
};

const game = () => {
  // depsit the balance (Initial amount)
  let balance = deposit();
  // loop breaks when there is an return statement
  while (true) {
    // displaying current balance
    console.log(`You Have a balance of $${balance}`)
    // getting numberOflines and bet Amount and product of these will give us the totalBet
    const numberOfLines = getNumberOfLine();
    const bet = getBet(balance, numberOfLines);
    const totalBet = bet * numberOfLines;
    // totalBet amout is deducted from the balance
    balance -= totalBet;
    // reels ( Slot machine is now turned on )
    const reels = spin();
    // the slot machine output is transposed and displayed
    const rows = transpose(reels);
    printRows(rows);
    // winnings is stored in the winning It's Either 0 or something
    const winnings = getWinnings(rows, bet, numberOfLines);
    // if the winning is more than 0 ( you've won )
    if(winnings>0){
        // you're balance is debited(+) with winning and totalBet ("You've won")
        balance += winnings + totalBet;
    }else{
        // you're balance is debited(+) with winnings which is 0 ( you've Lost)
        balance += winnings;
    }
    // display the winning amount
    console.log(`You've Won $${winnings.toString()}`);
    // check If you ran out of balance break the loop and get out
    if(balance <= 0) {
        // display the message that we ran out the money
        console.log(`You ran out of money!`);
        break;
    }

    // Ask the player If he wants to play again 
    const playAgain = prompt("Do you want to play again");
    // if the answer is yes type y or break the loop 
    if(playAgain != "y") break;
  }
};

game();
