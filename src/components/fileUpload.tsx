/**
 * Contains the {@link FileUpload} component and its props interface.
 *
 * @since 01/01/2023
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import type { ChangeEventHandler } from "react";


/**
 * Props for the {@link FileUploadProps} component.
 */
export interface FileUploadProps {

    /**
     * The event handler to trigger when a file is uploaded.
     */
    onChange?: ChangeEventHandler<HTMLInputElement>;
}


/**
 * Represents a file upload button.
 */
const FileUpload: React.FC<FileUploadProps> = ({ onChange }: FileUploadProps) => {
    return (
        <div className="flex w-full items-center justify-center">
            <label className="w-64 flex flex-col items-center px-4 py-6 bg-neutral-700 text-white rounded-lg tracking-wide uppercase border border-neutral-600 cursor-pointer hover:bg-neutral-500">
                <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span className="mt-2 text-base leading-normal">Upload CSV</span>
                <input type='file' className="hidden" onChange={onChange}/>
            </label>
        </div>
    );
};

export default FileUpload;
