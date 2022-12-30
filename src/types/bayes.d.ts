declare module "bayes" {

    interface NaivebayesOptions { tokenizer?: CallableFunction<string, string[]> };

    class Naivebayes {
        constructor(options?: NaivebayesOptions);
        async learn(text: string, category: string);
        toJson(): string;
        async categorize(text: string): Promise<string>;
        static fromJson(text: string): Naivebayes;
    }

    type bayesFunctionType = {
        fromJson(jsonStr: string): Naivebayes;
        (options?: NaivebayesOptions): Naivebayes;
    }

    const bayes: bayesFunctionType;

    export default bayes;
}
