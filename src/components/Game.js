import React, { useEffect, useState } from "react";
import '../components/Game.css'
import Cell from "./Cell";
import { useNavigate } from "react-router-dom";

const Game = () => {
    const [board, setBoard] = useState([null, null, null, null, null, null, null, null, null])
    const [letter, setLetter] = useState(null)
    const [turn, setTurn] = useState(1)
    const [winner, setWinner] = useState(null)
    const [winningSeq, setWinningSeq] = useState([])

    const winTitle = ["Oops.. Computer Has Won. Try Again..!! 😔", "Congratulations You Won..!! 🏆", "Ouch..!! Its Draw"]

    const navigate = useNavigate();

    const letterClicked = (value) => {
        setLetter(value)
    }

    const restartClicked = () => {
        window.location.reload();
    }

    const winCheck = (board, currrentTurn) => {
        const arr = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]

        for (let i = 0; i < arr.length; i++) {
            const [a, b, c] = arr[i];
            if (board[a] && board[a] == board[b] && board[a] == board[c]) {
                console.log('winner = ', currrentTurn)
                setWinningSeq(arr[i])
                setWinner(currrentTurn)
                return
            }
        }

        let filledCellsCount = board.reduce((acc, val) => acc + (val !== null ? 1 : 0), 0);

        if (filledCellsCount === 9) {
            setWinner(2)
        }
    }

    const cellClicked = (id) => {
        if (!winner && turn) {
            let filledCellsCount = board.reduce((acc, val) => acc + (val !== null ? 1 : 0), 0);

            if (filledCellsCount === 9) {
                navigate('/winner', { state: { winner: 2 } });
            }

            const updatedBoard = [...board];
            updatedBoard[id] = (letter ? 'X' : 'O')
            setBoard(updatedBoard);
            winCheck(updatedBoard, 1)
            setTurn(!turn)
        }
    }

    useEffect(() => {
        if (!winner && !turn) {
            let filledCellsCount = board.reduce((acc, val) => acc + (val !== null ? 1 : 0), 0);

            if (filledCellsCount === 9) {
                navigate('/winner', { state: { winner: 2 } });
            }
            fetch('https://hiring-react-assignment.vercel.app/api/bot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(board)
            })
                .then(response => response.json())
                .then(data => {
                    const computerMove = data;
                    const updatedBoard = [...board];
                    updatedBoard[computerMove] = (letter ? 'O' : 'X');
                    setBoard(updatedBoard);
                    winCheck(updatedBoard, 0)
                    setTurn(!turn)
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }, [letter, turn, winner])

    return (
        <>
            <div className="heading">Tic Tac Toe</div>
            <div className={(letter !== null) ? "letter, display-none" : "letter"}>
                <button className="letter-x" onClick={() => letterClicked(1)}>X</button>
                <button className="letter-dis"> choose your letter</button>
                <button className="letter-o" onClick={() => letterClicked(0)}>O</button>
            </div>
            <div className={(letter !== null ? "board" : "board, display-none")}>
                <div className={(winner !== null) ? "display-none" : "game-turn"}>{turn ? "Your Turn" : "Computers Turn"}</div>
                <div className="cell-container">
                    {board.map((cellValue, index) => (
                        <Cell
                            key={index}
                            value={cellValue}
                            onClick={() => cellClicked(index)}
                            isWinner={winningSeq.includes(index)}
                        />
                    ))}
                </div>
                <div className={(winner === null) ? "display-none" : "winner-banner"}>
                    <div className="win-title">{winTitle[winner]}</div>
                    <button className="restart-btn" onClick={restartClicked}>Restart</button>
                </div>
            </div>
        </>
    )
}

export default Game;
