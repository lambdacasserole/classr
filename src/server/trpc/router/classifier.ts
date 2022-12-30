import { router, publicProcedure, protectedProcedure } from "../trpc";
import z from 'zod';
import { Readable } from 'stream';
import { parse } from 'csv';
import { randomUUID } from 'crypto';
import shuffle from 'shuffle-array';

import bayes from 'bayes';


interface Document {
    label: string;
    document: string;
}

function base64EncodedCsvToDocuments(base64EncodedCsv: string) {
    return new Promise<Document[]>((resolve, reject) => {
        const buffer = Buffer.from(base64EncodedCsv, 'base64');
        const rows: Document[] = [];
        parse(buffer)
            .on('data', (row) => {
                if (row.length !== 2) {
                    throw new Error('CSV file has the wrong number of columns.');
                }
                rows.push({ document: row[1], label: row[0] })
            })
            .on('error', (e) => {
                reject(e);
            })
            .on('end', () => {
                if (!rows.length) {
                    return reject(new Error('CSV file cannot be empty.'));
                }
                if (rows[0]?.label !== 'label' || rows[0]?.document !== 'document') {
                    return reject(new Error('CSV file headings are incorrect.'));
                }
                resolve(rows.slice(1));
            });
    });
}

function testTrainSplit(docs: Document[], split = 0.2): { test: Document[], train: Document[] } {
    const shuffledCopy = shuffle(docs, { copy: true });
    const i = Math.ceil(shuffledCopy.length * split);
    const test = shuffledCopy.slice(0, i);
    const train = shuffledCopy.slice(i);
    return { test, train };
}


/**
 * Represents a confusion matrix.
 */
type ConfusionMatrix = { [key: string]: { [key: string]: number } };


/**
 * Initializes a confusion matrix for the specified documents.
 *
 * @param documents the documents to initialize the confusion matrix for
 * @returns the initialized confusion matrix
 */
function initializeConfusionMatrix(documents: Document[]): ConfusionMatrix {

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
function computeOverallAccuracy(confusionMatrix: ConfusionMatrix) {

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

function computePrecision(confusionMatrix: ConfusionMatrix, label: string) {
    const column = confusionMatrix[label];
    const correct = column ? (column[label] ?? 0) : 0;
    const rowSum = Object.values(confusionMatrix)
        .map((column) => column[label] ?? 0)
        .reduce((a, b) => a + b, 0);
    return correct / rowSum;
}

function computePrecisions(confusionMatrix: ConfusionMatrix) {
    return Object.keys(confusionMatrix).map((label) => computePrecision(confusionMatrix, label));
}

function computeMacroPrecision(confusionMatrix: ConfusionMatrix) {
    const precisions = computePrecisions(confusionMatrix);
    return precisions.reduce((a, b) => a + b, 0) / precisions.length;
}

function computeRecall(confusionMatrix: ConfusionMatrix, label: string) {
    const column = confusionMatrix[label];
    const correct = column ? (column[label] ?? 0) : 0;
    const columnSum = Object.values(column ?? {})
        .reduce((a, b) => a + b, 0);
    return correct / columnSum;
}

function computeRecalls(confusionMatrix: ConfusionMatrix) {
    return Object.keys(confusionMatrix).map((label) => computeRecall(confusionMatrix, label));
}

function computeMacroRecall(confusionMatrix: ConfusionMatrix) {
    const recalls = computeRecalls(confusionMatrix);
    return recalls.reduce((a, b) => a + b, 0) / recalls.length;
}

function computeMacroF1Score(confusionMatrix: ConfusionMatrix) {
    const macroPrecision = computeMacroPrecision(confusionMatrix);
    const macroRecall = computeMacroRecall(confusionMatrix);
    return 2 * (macroPrecision * macroRecall) / (macroPrecision + macroRecall);
}

function computeSupport(confusionMatrix: ConfusionMatrix) {
    return Object.keys(confusionMatrix)
        .map((label) => {
            const column = confusionMatrix[label];
            return {
                [label]: column ? Object.values(column).reduce((a, b) => a + b, 0) : 0,
            };
        }).reduce((a, b) => ({ ...a, ...b }), {});
}

export const classifierRouter = router({
    list: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.prisma.classifier.findMany({
                where: {
                    userId: ctx.session.user.id,
                },
            });
        }),
    classify: protectedProcedure
        .input(
            z.object({
                classifierUuid: z.string(),
                document: z.string(),
            }),
        )
        .query(async ({
            ctx,
            input: { classifierUuid, document },
        }) => {
            const classifierRecord = await ctx.prisma.classifier.findFirstOrThrow({
                where: {
                    uuid: classifierUuid,
                }
            });
            const classifier = bayes.fromJson(JSON.stringify(classifierRecord.classifier));
            return classifier.categorize(document);
        }),
    train: protectedProcedure
        .input(
            z.object({
                data: z.string(),
            }),
        )
        .mutation(async ({
            ctx,
            input: { data },
        }) => {

            // Parse base64 out of data URL.
            const csvData = data.split(',')[1];
            if (!csvData) {
                throw new Error('CSV data is missing or corrupt.');
            }
            const documents = await base64EncodedCsvToDocuments(csvData);
            const confusionMatrix = initializeConfusionMatrix(documents);
            const { test, train } = testTrainSplit(documents);
            const classifier = bayes();
            await Promise.all(train.map((document) => classifier.learn(document.document, document.label)));
            await Promise.all(test.map(async (document) => {
                const trueLabel = document.label;
                const actualLabel = await classifier.categorize(document.document);
                const column = confusionMatrix[trueLabel];
                if (column) {
                    column[actualLabel] += 1;
                }
            }));
            await ctx.prisma.classifier.create({
                data: {
                    uuid: randomUUID(),
                    name: '',
                    description: '',
                    precision: computeMacroPrecision(confusionMatrix),
                    recall: computeMacroRecall(confusionMatrix),
                    f1Score: computeMacroF1Score(confusionMatrix),
                    overallAccuracy: computeOverallAccuracy(confusionMatrix),
                    support: computeSupport(confusionMatrix),
                    classifier: JSON.parse(classifier.toJson()),
                    confusionMatrix: confusionMatrix,
                    userId: ctx.session.user.id,
                }
            })
            console.log(
                computeMacroPrecision(confusionMatrix),
                computeMacroRecall(confusionMatrix),
                computeOverallAccuracy(confusionMatrix),
                computeMacroF1Score(confusionMatrix),
                computeSupport(confusionMatrix),
            );
            // console.log(await nb.categorize('Stressed out but deeply inspired by our CEO, working on myself!'));
            // console.log(await nb.categorize('Just failed a job interview, seriously upset right now'));
        }),
});


