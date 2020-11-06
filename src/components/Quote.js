import React, { useEffect, useState } from 'react'
import Rating from "./Rating"
import axios from 'axios'

async function sleep(ms) {
    return new Promise(() => setTimeout(() => { }, ms))
}

function Quote() {
    const [quote, setQuote] = useState("");
    const [tags, setTags] = useState([]);
    const [quoteDate, setQuoteDate] = useState([]);
    const [quoteId, setQuoteId] = useState("");
    const [scoreData, setScoreData] = useState("");
    const [userAvg, setUserAvg] = useState("?");
    const [votes, setVotes] = useState("?");
    const [votingDisabled, setVotingDisabled] = useState(false);

    const clearStates = () => {
        setScoreData("");
        setUserAvg("?");
        setVotes("?");
        setVotingDisabled(false);
    }

    const instance = axios.create({
        baseURL: 'https://tronald-3011e.firebaseio.com/',
    });

    useEffect(() => {
        fetchQuote();
    }, [])

    useEffect(() => {
        clearStates();
    }, [quote])

    const fetchQuote = () => {
        fetch("https://matchilling-tronald-dump-v1.p.rapidapi.com/random/quote", {
            "method": "GET",
            "headers": {
                "accept": "application/hal+json",
                "x-rapidapi-key": "eb4874f6d3msh0a89680aa28d69bp122b31jsncdf1d68a065a",
                "x-rapidapi-host": "matchilling-tronald-dump-v1.p.rapidapi.com"
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setQuote(data.value);
                setTags(data.tags);
                setQuoteDate(data.appeared_at);
                setQuoteId(data.quote_id)
            })
            .catch(err => {
                console.error(err);
            });
    }

    useEffect(() => {
        console.log(scoreData)

        let sum = 0;
        let howManyScores = 0;

        if (scoreData.data != undefined) {
            Object.keys(scoreData.data).map(key => {
                if (scoreData.data[key].idQuote === quoteId) {
                    sum += scoreData.data[key].score;
                    howManyScores++;
                }
            })

            if (howManyScores > 0) {
                const avg = (sum / howManyScores).toFixed(2);
                setUserAvg(avg);
                setVotes(howManyScores);
            }
            else setVotes(howManyScores);
        }

    }, [scoreData])


    const onClickScoreHandler = (userScore) => {
        if (!votingDisabled) {

            console.log("[OnClickScoreHandler] Clicked:" + userScore);

            instance.post('/quotesRating.json', {
                idQuote: quoteId,
                score: userScore
            })

            checkOtherUsersScores()
            setVotingDisabled(true);
        }
    }

    const checkOtherUsersScores = async () => {
        axios.get('https://tronald-3011e.firebaseio.com/quotesRating.json').then(response => setScoreData(response));
        await sleep(200);
    }

    const nextQuoteHandler = () => {
        fetchQuote();
    }

    const printTags = (tags) => {
        console.log("hello" + tags)
        return tags.map((element,index) => {
            return <span key={index} className="tag">{element}</span>
        });
    }

    return (
        <div className="container">
            <h1 className="quote">"{quote}"</h1>
            <div className="container-small">
                <h2 className="date">Date {quoteDate}</h2>
                <h3 className="tags">Tags: {printTags(tags)}</h3>
            </div>

            <Rating votingDisabled={votingDisabled} clickHandler={onClickScoreHandler}></Rating>

            <h2 className="user-avg">Other poeople rated this quote {userAvg} / 10. Out of {votes} votes.</h2>
            <button onClick={nextQuoteHandler} className="btn-next-quote">Next quote</button>
            {votes === 0 && <p className="thanks">You are first one to vote! <span className="bold">Thank you</span>!</p> }
        </div>
    )
}

export default Quote
