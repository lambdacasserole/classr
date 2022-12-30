import { useState } from "react";
import { ConfusionMatrix, normalizeConfusionMatrix } from "../utils/ml";

import { trpc } from "../utils/trpc";


export interface ConfusionMatrixDisplayProps {
    confusionMatrix: ConfusionMatrix;
}


function shade(v) {
    // return `rgb(255, ${255 - (255 * v)}, ${255 - (255 * v)})`
    return `rgb(${50 + (255 * v)}, 50, 50)`;
}

function tone(v) {
    // return 255 * v < 128 ? 'black' : 'white';
    return 255 * v < 128 ? 'white' : 'black';
}


const ConfusionMatrixDisplay: React.FC<ConfusionMatrixDisplayProps> = ({
    confusionMatrix,
}: ConfusionMatrixDisplayProps) => {
    const labels = Object.keys(confusionMatrix);
    const normalizedConfusionMatrix = normalizeConfusionMatrix(confusionMatrix);
    return (
        <div
            className="font-mono"
            style={{
                display: 'grid',
                gridTemplateRows: `auto repeat(${labels.length}, 1fr)`,
                gridTemplateColumns: `auto repeat(${labels.length}, 1fr)`,
                // borderTop: '1px solid #ccc',
                // borderLeft: '1px solid #ccc',
            }}>
            <div className="grid-item" style={{ gridRow: 1, gridColumn: 1 }}></div>
            {labels.map((label, i) => {
                const column = normalizedConfusionMatrix[label];
                return (
                    <>
                        <div
                            className="grid-item text-center"
                            style={{
                                gridRow: 1,
                                gridColumn: i + 2,
                                borderBottom: '1px solid #000',
                            }}>
                            {label}
                        </div>
                        <div
                            className="grid-item text-right"
                            style={{
                                gridRow: i + 2,
                                gridColumn: 1,
                                borderRight: '1px solid #000',
                            }}>{label}</div>
                        {column ? Object.keys(column).map((row, j) =>
                            <div
                                className="grid-item text-center"
                                style={{
                                    gridRow: j + 2,
                                    gridColumn: i + 2,
                                    backgroundColor: shade(column[row]),
                                    color: tone(column[row]),
                                    borderBottom: `1px solid ${j === labels.length - 1 ? '#000' : 'transparent'}`,
                                    borderRight: `1px solid ${i === labels.length - 1 ? '#000' : 'transparent'}`,
                                }}>
                                {Math.round(column[row] * 100) / 100}
                            </div>)
                            : []}
                    </>
                );
            })}
        </div>
    );
};

export default ConfusionMatrixDisplay;
