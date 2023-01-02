/**
 * Contains machine learning related helper functions.
 *
 * @since 29/12/2022
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import { parse } from 'csv';
import shuffle from 'shuffle-array';


/**
 * Represents a confusion matrix.
 */
export type ConfusionMatrix = { [key: string]: { [key: string]: number } };

/**
 * Represents a document used to train or test a model.
 */
export interface Document {

    /**
     * The document label.
     */
    label: string;

    /**
     * The document contents.
     */
    document: string;
}


/**
 * Converts a base64-encoded CSV file to a set of documents.
 *
 * @param base64EncodedCsv the base64-encoded CSV file to convert
 * @returns the resulting set of documents
 */
export function base64EncodedCsvToDocuments(base64EncodedCsv: string) {
    return new Promise<Document[]>((resolve, reject) => {

        // Decode from base64 into buffer.
        const buffer = Buffer.from(base64EncodedCsv, 'base64');

        // Parse CSV from buffer.
        const rows: Document[] = [];
        parse(buffer)
            .on('data', (row) => {

                // Throw error on incorrect column count.
                if (row.length !== 2) {
                    throw new Error('CSV file has the wrong number of columns.');
                }
                rows.push({ document: row[1], label: row[0] }); // Accumulate row as document,
            })
            .on('error', (e) => {
                reject(e); // Reject on read error.
            })
            .on('end', () => {

                // Reject on empty CSV.
                if (!rows.length) {
                    return reject(new Error('CSV file cannot be empty.'));
                }

                // Reject on missing or bad column headers.
                if (rows[0]?.label !== 'label' || rows[0]?.document !== 'document') {
                    return reject(new Error('CSV file headings are incorrect.'));
                }
                resolve(rows.slice(1)); // Exclude column headers from resolved data.
            });
    });
}

/**
 * Splits a set of documents into testing and training portions.
 *
 * @param documents the set of documents to split
 * @param split the ratio of testing data to split (defaults to 0.2 for 20% testing and 80% training)
 * @returns the set of documents split into testing and training portions
 */
export function testTrainSplit(documents: Document[], split = 0.2): { test: Document[], train: Document[] } {

    // Shuffle copy of documents array.
    const shuffledCopy = shuffle(documents, { copy: true });

    // Split and return.
    const n = Math.ceil(shuffledCopy.length * split);
    const test = shuffledCopy.slice(0, n);
    const train = shuffledCopy.slice(n);
    return { test, train };
}

/**
 * Initializes a confusion matrix for the specified documents.
 *
 * @param documents the documents to initialize the confusion matrix for
 * @returns the initialized confusion matrix
 */
export function initializeConfusionMatrix(documents: Document[]): ConfusionMatrix {

    // Extract unique labels.
    const labels = documents
        .map((doc) => doc.label)
        .filter((v, i, a) => i === a.indexOf(v));

    // Create matrix.
    const confusionMatrix: ConfusionMatrix = {};
    labels.forEach((trueLabel) => {
        confusionMatrix[trueLabel] = labels.map((actualLabel) => ({
            [actualLabel]: 0,
        })).reduce((a, b) => ({ ...a, ...b }), {});
    });
    return confusionMatrix;
}

/**
 * Computes the overall accuracy of a model from its confusion matrix.
 *
 * @param confusionMatrix the confusion matrix
 * @returns a number indicating the overall accuracy of the model
 */
export function computeOverallAccuracy(confusionMatrix: ConfusionMatrix) {

    // Compute count of correct outputs (true label and actual label are the same).
    const correct = Object.keys(confusionMatrix)
        .map((label) => {
            const column = confusionMatrix[label];
            return column ? (column[label] ?? 0) : 0;
        }).reduce((a, b) => a + b, 0);

    // Compute total outputs.
    const all = Object.values(confusionMatrix)
        .map((row) => Object.values(row))
        .flat()
        .reduce((a, b) => a + b, 0);

    // Return correct outputs over total outputs.
    return correct / all;
}

/**
 * Computes the precision for the given label on the given confusion matrix.
 *
 * @param confusionMatrix the confusion matrix
 * @param label the label to compute precision for
 * @returns the computed precision for the label
 */
function computePrecision(confusionMatrix: ConfusionMatrix, label: string) {
    const column = confusionMatrix[label];
    const correct = column ? (column[label] ?? 0) : 0;
    const rowSum = Object.values(confusionMatrix)
        .map((column) => column[label] ?? 0)
        .reduce((a, b) => a + b, 0);
    return correct / rowSum;
}

/**
 * Computes all precisions for the given confusion matrix.
 *
 * @param confusionMatrix the confusion matrix
 * @returns the computed precisions for the confusion matrix
 */
function computePrecisions(confusionMatrix: ConfusionMatrix) {
    return Object.keys(confusionMatrix).map((label) => computePrecision(confusionMatrix, label));
}

/**
 * Computes the macro precision for the given confusion matrix.
 *
 * @param confusionMatrix the confusion matrix
 * @returns the computed macro precision for the confusion matrix
 */
export function computeMacroPrecision(confusionMatrix: ConfusionMatrix) {
    const precisions = computePrecisions(confusionMatrix);
    return precisions.reduce((a, b) => a + b, 0) / precisions.length;
}

/**
 * Computes the recall for the given label on the given confusion matrix.
 *
 * @param confusionMatrix the confusion matrix
 * @param label the label to compute recall for
 * @returns the computed recall for the label
 */
function computeRecall(confusionMatrix: ConfusionMatrix, label: string) {
    const column = confusionMatrix[label];
    const correct = column ? (column[label] ?? 0) : 0;
    const columnSum = Object.values(column ?? {})
        .reduce((a, b) => a + b, 0);
    return correct / columnSum;
}

/**
 * Computes all recall for the given confusion matrix.
 *
 * @param confusionMatrix the confusion matrix
 * @returns the computed recall for the confusion matrix
 */
function computeRecalls(confusionMatrix: ConfusionMatrix) {
    return Object.keys(confusionMatrix).map((label) => computeRecall(confusionMatrix, label));
}

/**
 * Computes the macro recall for the given confusion matrix.
 *
 * @param confusionMatrix the confusion matrix
 * @returns the computed macro recall for the confusion matrix
 */
export function computeMacroRecall(confusionMatrix: ConfusionMatrix) {
    const recalls = computeRecalls(confusionMatrix);
    return recalls.reduce((a, b) => a + b, 0) / recalls.length;
}

/**
 * Computes the macro F1 score for the given confusion matrix.
 *
 * @param confusionMatrix the confusion matrix
 * @returns the computed macro F1 score for the confusion matrix
 */
export function computeMacroF1Score(confusionMatrix: ConfusionMatrix) {
    const macroPrecision = computeMacroPrecision(confusionMatrix);
    const macroRecall = computeMacroRecall(confusionMatrix);
    return 2 * (macroPrecision * macroRecall) / (macroPrecision + macroRecall);
}

/**
 * Computes the suppport for the given confusion matrix.
 *
 * @param confusionMatrix the confusion matrix
 * @returns the computed suppport for the confusion matrix
 */
export function computeSupport(confusionMatrix: ConfusionMatrix) {
    return Object.keys(confusionMatrix)
        .map((label) => {
            const column = confusionMatrix[label];
            return {
                [label]: column ? Object.values(column).reduce((a, b) => a + b, 0) : 0,
            };
        }).reduce((a, b) => ({ ...a, ...b }), {});
}

/**
 * Computes a normalized version of the given confusion matrix.
 *
 * @param confusionMatrix the confusion matrix
 * @returns the normalized version of the given confusion matrix
 */
export function normalizeConfusionMatrix(confusionMatrix: ConfusionMatrix): ConfusionMatrix {

    // Compute total for each column.
    const labels = Object.keys(confusionMatrix);
    const labelTotals = labels
        .map((label) => {
            const column = confusionMatrix[label];
            return {
                [label]: column ? Object.values(column).reduce((a, b) => a + b, 0) : 0,
            }
        }).reduce((a, b) => ({ ...a, ...b }), {});

    // Compute normalized version of confusion matrix by division with totals.
    return labels
        .map((trueLabel) => {
            const column = confusionMatrix[trueLabel];
            if (column) {
                return {
                    [trueLabel]: labels.map((actualLabel) => ({
                        [actualLabel]: (column[actualLabel] ?? 0) / (labelTotals[trueLabel] ?? 1),
                    })).reduce((a, b) => ({ ...a, ...b }), {}),
                };
            }
            return {};
        }).reduce((a, b) => ({ ...a, ...b }), {});
}