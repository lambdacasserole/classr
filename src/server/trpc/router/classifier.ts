import { router, publicProcedure, protectedProcedure } from "../trpc";
import z from 'zod';
import { Readable } from 'stream';
import { parse } from 'csv';

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
                rows.push({ document: row[1], label: row[0] })
            })
            .on('error', (e) => {
                reject(e);
            })
            .on('end', () => {
                resolve(rows);
            });
    });
}

export const classifierRouter = router({
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
            const gmx = data.split(',')[1];
            if (!gmx) {
                return {};
            }
            const docs = await base64EncodedCsvToDocuments(gmx);
            const nb = bayes();
            await Promise.all(docs.map((d) => nb.learn(d.document, d.label)));
            console.log(await nb.categorize('Stressed out but deeply inspired by our CEO, working on myself!'));
            console.log(await nb.categorize('Just failed a job interview, seriously upset right now'));
        }),
});


