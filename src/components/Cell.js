import React from "react";
import '../components/Cell.css'

const Cell = ({ value, onClick, isWinner }) => {
    return (
        <>
            <div className={(isWinner ? "cell, winner-cell" : "cell")} onClick={onClick}>
                {value}
            </div>
        </>
    )
}

export default Cell