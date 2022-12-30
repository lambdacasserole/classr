import { Classifier } from "@prisma/client";

import { MouseEventHandler, useEffect, useState } from "react";
import { ConfusionMatrix } from "../utils/ml";

import { trpc } from "../utils/trpc";
import ActionButton from "./actionButton";
import ConfusionMatrixDisplay from "./confusionMatrixDisplay";


export interface classifierTileProps {
    classifier: Classifier;
}


const ClassifierTile: React.FC<classifierTileProps> = ({ classifier }: classifierTileProps) => {

    const [testDocument, setTestDocument] = useState('');
    const [copyButtonWarm, setCopyButtonWarm] = useState(false);
    const testQuery = trpc.classifier.classify.useQuery({
        classifierUuid: classifier.uuid,
        document: testDocument,
    }, { enabled: false });

    return (
        <div className="p-6 mb-6 rounded-lg bg-neutral-800 text-white grid lg:grid-cols-2 md:grid-cols-1 text-left border border-neutral-700">
            <div className="md:col-span-1 lg:col-span-2 mb-6">
                <h2 className="text-xl">{classifier.name.length ? classifier.name : classifier.uuid}</h2>
            </div>
            <div className="lg:pr-6 col-span-1">
                <label htmlFor="nameField" className="form-label inline-block mb-2 text-white">
                    Name
                </label>
                <input name="nameField" type="text" value={classifier.name} className="form-control block w-full px-3 py-1.5 text-base text-white bg-transparent font-mono bg-clip-padding border border-solid border-neutral-600 rounded transition ease-in-out m-0 mb-4 focus:outline-none" readOnly />
                <label htmlFor="descriptionField" className="form-label inline-block mb-2 text-white">
                    Description
                </label>
                <textarea name="descriptionField" className="form-control block w-full px-3 py-1.5 text-base font-mono text-white bg-transparent bg-clip-padding border border-solid border-neutral-600 rounded transition ease-in-out m-0 mb-4 focus:outline-none" readOnly>
                    {classifier.description}
                </textarea>
                <label htmlFor="uuidField" className="form-label block mb-2 text-white">
                    ID
                </label>
                <div className="flex">
                    <input
                        name="uuidField"
                        type="text"
                        value={classifier.uuid}
                        className="form-control mr-6 flex-grow px-3 py-1.5 text-base text-white bg-transparent font-mono bg-clip-padding border border-solid border-neutral-600 rounded transition ease-in-out m-0 mb-4 focus:outline-none"
                        readOnly />
                    <ActionButton text={copyButtonWarm ? 'Copied!' : 'Copy'} onClick={(e) => {
                        navigator.clipboard.writeText(classifier.uuid);
                        setCopyButtonWarm(true);
                        setTimeout(() => setCopyButtonWarm(false), 2000);
                    }} />
                </div>
                <label htmlFor="trainingDataField" className="form-label block mb-2 text-white">
                    Testing input
                </label>
                <textarea placeholder="Enter testing data here..." name="exampleFormControlTextarea1" className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 mb-4 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    onBlur={(e) => setTestDocument(e.target.value)}></textarea>
                <p className="text-right">
                    <span className="mr-6">
                        Result: {testQuery.data ?
                            <b className="font-mono">{testQuery.data}</b> :
                            <span className="text-neutral-500 font-mono">N/A</span>}
                    </span>
                    <ActionButton onClick={() => testQuery.refetch()} text="Test" />
                </p>
            </div>
            <div className="col-span-1 text-left overflow-scroll">
                <h2 className="text-md">Confusion matrix</h2>
                <ConfusionMatrixDisplay confusionMatrix={classifier.confusionMatrix as ConfusionMatrix} />
            </div>
        </div>
    );
};

export default ClassifierTile;
