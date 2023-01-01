/**
 * Contains the {@link ConfusionMatrixDisplay} component and its props interface.
 *
 * @since 01/01/2022
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import type { ConfusionMatrix } from "../utils/ml";
import { normalizeConfusionMatrix } from "../utils/ml";


/**
 * Propsfor the {@link ConfusionMatrixDisplay} component.
 */
export interface ConfusionMatrixDisplayProps {

    /**
     * The confusion matrix to display in the component.
     */
    confusionMatrix: ConfusionMatrix;
}


/**
 * Gets the color of a confusion matrix cell based on its value.
 *
 * @param value the value of the cell
 * @returns the color of the cell as a CSS RGB color
 */
function cellColor(value = 0) {
    return `rgb(${50 + (255 * value)}, 50, 50)`;
}

/**
 * Gets the color of a confusion matrix cell's text based on its value.
 *
 * @param value the value of the cell
 * @returns the color of the cell's text as a CSS RGB color
 */
function cellTextShade(value = 0) {
    return 255 * value < 128 ? 'white' : 'black';
}


/**
 * Represents a component capable of displaying a confusion matrix.
 */
const ConfusionMatrixDisplay: React.FC<ConfusionMatrixDisplayProps> = ({
    confusionMatrix,
}: ConfusionMatrixDisplayProps) => {

    // Extract labels from confusion matrix.
    const labels = Object.keys(confusionMatrix);

    // Obtain normalized representation of confusion matrix.
    const normalizedConfusionMatrix = normalizeConfusionMatrix(confusionMatrix);

    return (
        // Size grid according to number of labels.
        <div
            className="font-mono"
            style={{
                display: 'grid',
                gridTemplateRows: `auto repeat(${labels.length}, 1fr)`,
                gridTemplateColumns: `auto repeat(${labels.length}, 1fr)`,
            }}>
            {/* Upper-left blank cell */}
            <div className="grid-item" style={{ gridRow: 1, gridColumn: 1 }}></div>
            {labels.map((label, i) => {
                const column = normalizedConfusionMatrix[label]; // Get column.
                return (
                    <>
                        {/* Column headers */}
                        <div
                            className="grid-item text-center"
                            style={{
                                gridRow: 1,
                                gridColumn: i + 2,
                                borderBottom: '1px solid #000',
                            }}>
                            {label}
                        </div>
                        {/* Row headers */}
                        <div
                            className="grid-item text-right"
                            style={{
                                gridRow: i + 2,
                                gridColumn: 1,
                                borderRight: '1px solid #000',
                            }}>{label}</div>
                        {/* Data cells */}
                        {column ? Object.keys(column).map((row, j) =>
                            <div
                                key={j}
                                className="grid-item text-center"
                                style={{
                                    gridRow: j + 2,
                                    gridColumn: i + 2,
                                    backgroundColor: cellColor(column[row]),
                                    color: cellTextShade(column[row]),
                                    borderBottom: `1px solid ${j === labels.length - 1 ? '#000' : 'transparent'}`,
                                    borderRight: `1px solid ${i === labels.length - 1 ? '#000' : 'transparent'}`,
                                }}>
                                {Math.round((column[row] ?? 0) * 100) / 100}
                            </div>) : []}
                    </>
                );
            })}
        </div>
    );
};

export default ConfusionMatrixDisplay;
