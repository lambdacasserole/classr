
import { type NextApiRequest, type NextApiResponse } from "next";

import bayes from "bayes";
import { prisma } from "../../../server/db/client";

import type { ConfusionMatrix} from "../../../utils/ml";
import { normalizeConfusionMatrix } from "../../../utils/ml";


const classifier = async (req: NextApiRequest, res: NextApiResponse) => {

    // Extract UUID from query.
    const { uuid } = req.query;
    if (!uuid) {
        return res.status(400).json({ message: 'UUID of classifier must be provided.' }); // Bad request without UUID.
    }

    // Find requested classifier or throw an exception.
    const classifierRecord = await prisma.classifier.findFirstOrThrow({
        where: {
            uuid: uuid as string,
        },
    });

    // Error if classifier not found.
    if (!classifierRecord) {
        return res.status(404).json({ message: 'Classifier with the specified UUID was not found.' });
    }

    // Otherwise, a POST means we want to classify.
    if (req.method === 'POST') {

        // Bad request without document.
        const { document } = req.body;
        if (!document) {
            return res.status(400).json({ message: 'Document to classify must be provided.' });
        }

        // Classify.
        const classifier = bayes.fromJson(JSON.stringify(classifierRecord.classifier));
        return res.status(200).json({ class: await classifier.categorize(req.body.document) });
    }

    // GET requests should result in returning classifier details.
    return res.status(200).json({
        uuid: classifierRecord.uuid,
        name: classifierRecord.name,
        description: classifierRecord.description,
        precision: classifierRecord.precision,
        recall: classifierRecord.recall,
        f1Score: classifierRecord.f1Score,
        overallAccuracy: classifierRecord.overallAccuracy,
        support: classifierRecord.support,
        confusionMatrix: classifierRecord.confusionMatrix,
        nomalizedConfusionMatrix: normalizeConfusionMatrix(classifierRecord.confusionMatrix as ConfusionMatrix),
    });
};

export default classifier;
