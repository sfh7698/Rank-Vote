import { Card } from ".";

interface RankedNominationProps {
    nominationText: string,
    rank?: number
    onSelect: () => void
}

export default function RankedNomination({rank, nominationText, onSelect}: RankedNominationProps){
    return (
        <div className="my-4" onClick={onSelect}>
            <Card className="border-2 border-indigo-700 text-indigo-700 relative">
                <div className="font-semibold text-center">{nominationText}</div>
                {rank && (
                    <div className="absolute w-6 h-6 -top-3 -right-3 rounded-full bg-indigo-600">
                        <div className="text-center font-medium text-white">{rank}</div>
                    </div>
                )}
            </Card>
        </div>
    )
}