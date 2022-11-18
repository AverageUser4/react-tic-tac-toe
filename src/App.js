import React from 'react';

import { ReactComponent as Circle } from './assets/circle.svg';
import { ReactComponent as Cross } from './assets/cross.svg';

const initialGameData = [];
for(let i = 0; i < 9; i++)
  initialGameData.push({ contains: '', id: i });

const initialMode = matchMedia('prefers-color-scheme: light').matches ? 'light' : 'dark';

export default function App() {
  const [colorScheme, setColorScheme] = React.useState(initialMode);
  const [gameData, setGameData] = React.useState(initialGameData);
  const [currentPlayer, setCurrentPlayer] = React.useState(true);

  const [result, setResult] = React.useState({
    isOver: false,
    winner: ''
  });

  function resetGame() {
    setResult({ isOver: false, winner: '' });
    setGameData(initialGameData);
    setCurrentPlayer(true);
  }

  function checkField(id) {
    const newGameData = gameData.map(field => field.id !== id ? field : 
      { ...field, contains: currentPlayer ? 'circle' : 'cross' });

    setGameData(newGameData);
    setCurrentPlayer(!currentPlayer);

    checkGameOver(newGameData);
  }

  function checkGameOver(actualGameData) {
    // it only needs to check last player so it uses currentPlayer from this render
    // although it is already set to change in the next

    function isWinner(who) {
      const agd = actualGameData;

      return (
        // horizontal
        (agd[0].contains === who && agd[1].contains === who && agd[2].contains === who) ||
        (agd[3].contains === who && agd[4].contains === who && agd[5].contains === who) ||
        (agd[6].contains === who && agd[7].contains === who && agd[8].contains === who) ||

        // vertical
        (agd[0].contains === who && agd[3].contains === who && agd[6].contains === who) ||
        (agd[1].contains === who && agd[4].contains === who && agd[7].contains === who) ||
        (agd[2].contains === who && agd[5].contains === who && agd[8].contains === who) ||

        // cross
        (agd[0].contains === who && agd[4].contains === who && agd[8].contains === who) ||
        (agd[2].contains === who && agd[4].contains === who && agd[6].contains === who)
      );
    }

    function isTie() {
      return actualGameData.every(field => field.contains);
    }

    const player = currentPlayer ? 'circle' : 'cross';

    if(isWinner(player))
      setResult({ isOver: true, winner: player })
    else if(isTie())
      setResult({ isOver: true, winner: 'No one' })
  }

  return (
    <div className={'website' + (colorScheme === 'dark' ? ' website--dark' : '')}>

      <div>

        <header className="header">

          <h1 className="heading">Tic-Tac-Toe</h1>

          <button
            className="mode-button"
            onClick={()=>setColorScheme(prev => prev === 'dark' ? 'light' : 'dark')}
          >
            {colorScheme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>

        </header>

        <main className="game-field">

          {
            gameData.map(field =>
              <button 
                key={field.id} 
                className="button"
                onClick={field.contains || result.isOver ? ()=>0 : ()=>checkField(field.id)}
              >

                {
                  field.contains === 'circle' ? <Circle/> :
                  field.contains === 'cross' ? <Cross/> : ''
                }

              </button>
            )
          }

        </main>

        <footer className="footer">

          {
            result.isOver ?
              <>
                <h2 style={{ margin: 0 }}>{result.winner} wins!</h2>

                <button className="mode-button" onClick={resetGame}>Play again</button>
              </>
            :
            <span>Next move: {currentPlayer ? <Circle/> : <Cross/>}</span>
          }

        </footer>

      </div>


    </div>
  );
}