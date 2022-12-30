import { randomUUID } from 'crypto';

import bayes from 'bayes';
import z from 'zod';

import { router, protectedProcedure } from "../trpc";
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


