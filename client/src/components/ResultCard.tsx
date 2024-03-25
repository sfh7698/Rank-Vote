import { Col, Row } from "../components";
import { Results } from "shared";

interface ResultCardProps {
    results: Results;
}

export default function ResultCard({results}: ResultCardProps) {
    return (
        <>
            <div className="border-b-2 border-solid border-gray-300 pb-2 my-2 pr-2">
                <Row>
                    <Col className="font-semibold">Nomination</Col>
                    <Col className="font-semibold text-right">Score</Col>
                </Row>
            </div>
            <div className="divide-y-2 overflow-y-auto pr-2 divide-gray-300">
                {results.map((result) => (
                    <Row key={result.nominationID} className="my-1">
                        <Col>{result.nominationText}</Col>
                        <Col className="text-right">{result.score.toFixed(2)}</Col>
                    </Row>
                ))}
            </div>
        </>
    )
}