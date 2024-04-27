import { Col, Row } from "../components";
import { Results } from "shared";

interface ResultCardProps {
    results: Results;
}

export default function ResultCard({results}: ResultCardProps) {
    return (
        <>
            <div className="border-b-2 border-solid border-gray-300 pb-2 my-2 pr-2">
                <Row className="px-2">
                    <Col>Rank</Col>
                    <Col>Nomination</Col>
                    <Col className="text-right">Score</Col>
                </Row>
            </div>
            <div className="overflow-y-auto px-2">
                {results.map((result, idx) => 
                        <Row className="my-1 shadow-lg p-3 bg-gray-100 rounded-lg border-2 border-indigo-400" key={result.nominationID}>
                            <Col>
                                <div className="star">{idx+1}</div>
                            </Col>
                            <Col><span className="font-bold">{result.nominationText}</span></Col>
                            <Col className="text-right">{result.score.toFixed(2)}</Col>
                        </Row>
                )}
            </div>
        </>
    )
}