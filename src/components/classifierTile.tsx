import { Classifier } from "@prisma/client";

import { MouseEventHandler, useEffect, useState } from "react";
import { ConfusionMatrix } from "../utils/ml";

import { trpc } from "../utils/trpc";
import ConfusionMatrixDisplay from "./confusionMatrixDisplay";


export interface classifierTileProps {
    classifier: Classifier;
}


const ClassifierTile: React.FC<classifierTileProps> = ({ classifier }: classifierTileProps) => {

    const [testDocument, setTestDocument] = useState('');
    const q = trpc.classifier.classify.useQuery({
        classifierUuid: classifier.uuid,
        document: testDocument,
    }, { enabled: false });

    return (
        <div>
            Name: {classifier.name}<br />
            Description: {classifier.description}<br />
            Uuid: {classifier.uuid}<br />
            <textarea onBlur={(e) => setTestDocument(e.target.value)}></textarea>
            <button onClick={() => q.refetch()}>Test</button>
            Result: {q.data}
            <ConfusionMatrixDisplay confusionMatrix={classifier.confusionMatrix as ConfusionMatrix} />
        </div>
    );
};

export default ClassifierTile;
