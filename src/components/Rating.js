import React from 'react'

function Rating(props) {
    const scoreBoxes = () => {
        const boxes = []

        for (let i = 0; i <= 10; i++) {
            boxes.push(
                <li className="score-list-item" key={i} onClick={() => props.clickHandler(i)}>
                    {i}
                </li>
            )
        }

        return boxes;
    }

    return (
        <>
            <h3 className="rate-title">Rate stupidity</h3>
            <ul className={props.votingDisabled ? "score-list disabled" : "score-list"}>
                {scoreBoxes()}
            </ul>
        </>
    )
}

export default Rating
