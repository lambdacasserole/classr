/**
 * Contains the {@link ClassifierTile} component and its props interface.
 *
 * @since 01/01/2023
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import { useState } from "react";

import type { Classifier } from "@prisma/client";

import { trpc } from "../utils/trpc";
import type { ConfusionMatrix } from "../utils/ml";

import ActionButton from "./actionButton";
import ConfusionMatrixDisplay from "./confusionMatrixDisplay";


/**
 * Props for the {@link ClassifierTile} component.
 */
export interface classifierTileProps {

    /**
     * The classifier to wrap.
     */
    classifier: Classifier;

    /**
     * Raised when the classifier is deleted.
     */
    onDelete?: (classifier: Classifier) => void;
}


/**
 * Represents a classifier tile component.
 */
const ClassifierTile: React.FC<classifierTileProps> = ({ classifier, onDelete }: classifierTileProps) => {

    // Hold testing document in state.
    const [testDocument, setTestDocument] = useState('');

    // Hold buttom warm states.
    const [isCopyButtonWarm, setIsCopyButtonWarm] = useState(false);
    const [isDeleteButtonWarm, setIsDeleteButtonWarm] = useState(false);

    // Queries and mutations (tRPC).
    const testQuery = trpc.classifier.classify.useQuery({ // Query for test classifier input.
        classifierUuid: classifier.uuid,
        document: testDocument,
    }, { enabled: false });

    return (
        <div
            className="p-6 mb-6 rounded-lg bg-neutral-800 text-white grid lg:grid-cols-2 md:grid-cols-1 text-left border border-neutral-700 position-relative">
            <div className="md:col-span-1 lg:col-span-2 mb-6">
                <h2 className="text-xl">{classifier.name.length ? classifier.name : classifier.uuid}</h2>
            </div>
            <div className="lg:pr-6 col-span-1">
                {/* Name and description */}
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
                {/* Copy UUID box and button */}
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
                    <ActionButton text={isCopyButtonWarm ? 'Copied!' : 'Copy'} onClick={() => {

                        // Copy UUID and set button warm, cool down after 2s.
                        navigator.clipboard.writeText(classifier.uuid);
                        setIsCopyButtonWarm(true);
                        setTimeout(() => setIsCopyButtonWarm(false), 2000);
                    }} />
                </div>
                {/* Testing input box */}
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
                <p className="mt-3">
                    <ActionButton
                        className={`${isDeleteButtonWarm ? 'border-neutral-900 text-neutral-900 bg-red-500' : 'border-red-500 text-red-500'} w-full`}
                        onClick={() => {
                            if (isDeleteButtonWarm && onDelete) { // Delete button must be clicked twice.
                                onDelete(classifier);
                            } else {
                                setIsDeleteButtonWarm(true); // Confirm delete, time out after 5s.
                                setTimeout(() => setIsDeleteButtonWarm(false), 5000);
                            }
                        }}
                        text={isDeleteButtonWarm ? "Really? Click again to confirm" : "Delete classifier"} />
                </p>
            </div>
            {/* Confusion matrix and performance information */}
            <div className="col-span-1 text-left overflow-scroll">
                <h2 className="text-md">Confusion matrix</h2>
                <ConfusionMatrixDisplay confusionMatrix={classifier.confusionMatrix as ConfusionMatrix} />
                <div className="mt-6 mb-3">
                    Overall accuracy ({Math.round(classifier.overallAccuracy * 100)}%)
                </div>
                <div className="w-full bg-neutral-600 h-2">
                    <div className="bg-green-600 h-2" style={{ width: `${Math.round(classifier.overallAccuracy * 100)}%` }}></div>
                </div>
                <div className="mt-6 mb-3">
                    Macro precision ({Math.round(classifier.precision * 100)}%)
                </div>
                <div className="w-full bg-neutral-600 h-2">
                    <div className="bg-blue-600 h-2" style={{ width: `${Math.round(classifier.precision * 100)}%` }}></div>
                </div>
                <div className="mt-6 mb-3">
                    Macro recall ({Math.round(classifier.recall * 100)}%)
                </div>
                <div className="w-full bg-neutral-600 h-2">
                    <div className="bg-red-600 h-2" style={{ width: `${Math.round(classifier.recall * 100)}%` }}></div>
                </div>
                <div className="mt-6 mb-3">
                    Macro F1 score ({Math.round(classifier.f1Score * 100) / 100})
                </div>
                <div className="w-full bg-neutral-600 h-2">
                    <div className="bg-yellow-600 h-2" style={{ width: `${Math.round(classifier.f1Score * 100)}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default ClassifierTile;
