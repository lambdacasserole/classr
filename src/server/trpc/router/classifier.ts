/**
 * Contains server-side tRPC functions for classifier management.
 *
 * @since 04/01/2023
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import { randomUUID } from 'crypto';

import bayes from 'bayes';
import z from 'zod';

import { env } from '../../../env/server.mjs';

import { router, protectedProcedure } from "../trpc";

import type { Document } from '../../../utils/ml';
import {
    base64EncodedCsvToDocuments,
    computeMacroF1Score,
    computeMacroPrecision,
    computeMacroRecall,
    computeOverallAccuracy,
    computeSupport,
    initializeConfusionMatrix,
    testTrainSplit,
} from '../../../utils/ml';


export const classifierRouter = router({
    list: protectedProcedure
        .query(async ({ ctx }) => {

            // Return all classifiers for signed-in user.
            return ctx.prisma.classifier.findMany({
                where: {
                    userId: ctx.session.user.id,
                },
            });
        }),
    classify: protectedProcedure
        .input(
            z.object({
                classifierUuid: z.string(), // Classifier UUID required.
                document: z.string(), // Document to classify required.
            }),
        )
        .query(async ({
            ctx,
            input: { classifierUuid, document },
        }) => {

            // Find requested classifier or throw an exception.
            const classifierRecord = await ctx.prisma.classifier.findFirstOrThrow({
                where: {
                    uuid: classifierUuid,
                },
            });

            // Rehydrate model and return categorization result.
            const classifier = bayes.fromJson(JSON.stringify(classifierRecord.classifier));
            return classifier.categorize(document);
        }),
    delete: protectedProcedure
        .input(
            z.object({
                classifierUuid: z.string(), // Classifier UUID required.
            })
        ).mutation(async ({
            ctx,
            input: { classifierUuid },
        }) => {

            // Delete classifier (restrict to current user only).
            return ctx.prisma.classifier.deleteMany({
                where: {
                    AND: [{ uuid: classifierUuid }, { userId: ctx.session.user.id }]
                }
            });
        }),
    train: protectedProcedure
        .input(
            z.object({
                name: z.string().optional(),
                data: z.string(),
            }),
        )
        .mutation(async ({
            ctx,
            input: { name, data },
        }) => {

            // Check that we haven't gone over the limit for number of classifiers.
            const classifierCountLimit = env.CLASSIFIER_UPPER_LIMIT ?? 100;
            const existingClassifierCount = await ctx.prisma.classifier.count({
                where: {
                    userId: ctx.session.user.id,
                },
            });
            if (existingClassifierCount >= classifierCountLimit) {
                throw new Error(`You may not create more than ${classifierCountLimit} microclassifier right now.`);
            }

            // Parse base64 out of data URL.
            const csvData = data.split(',')[1];
            if (!csvData) {
                throw new Error('CSV data is missing or corrupt.');
            }

            // Translate base64-encoded CSV to document set.
            let documents: Document[];
            try {
                documents = await base64EncodedCsvToDocuments(csvData);
            } catch (e) {
                throw new Error('CSV data could not be parsed. Check that you\'re using commas as delimiters and'
                    + ' quoting/escaping appropriately.');
            }

            // Initialize a fresh confusion matrix for this model.
            const confusionMatrix = initializeConfusionMatrix(documents);

            // Test-train split (with default 80/20 split).
            const { test, train } = testTrainSplit(documents);

            // Initialize classifier, train and test.
            const classifier = bayes();
            await Promise.all(train.map((document) => classifier.learn(document.document, document.label)));
            await Promise.all(test.map(async (document) => {
                const trueLabel = document.label;
                const actualLabel = await classifier.categorize(document.document);
                const column = confusionMatrix[trueLabel];
                if (column) {
                    column[actualLabel] += 1; // Populate confusion matrix.
                }
            }));

            // Create classifier.
            await ctx.prisma.classifier.create({
                data: {
                    uuid: randomUUID(),
                    name: name ?? '',
                    description: `Classifier created from ${name ?? 'a CSV file'} on ${(new Date()).toLocaleString()}`
                        + ` with classes: ${Object.keys(confusionMatrix).join(', ')}`,
                    precision: computeMacroPrecision(confusionMatrix),
                    recall: computeMacroRecall(confusionMatrix),
                    f1Score: computeMacroF1Score(confusionMatrix),
                    overallAccuracy: computeOverallAccuracy(confusionMatrix),
                    support: computeSupport(confusionMatrix),
                    classifier: JSON.parse(classifier.toJson()),
                    confusionMatrix: confusionMatrix,
                    userId: ctx.session.user.id,
                }
            });
        }),
});


