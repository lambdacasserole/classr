declare module "bayes" {

    interface NaivebayesOptions { tokenizer?: CallableFunction<string, string[]> };

    class Naivebayes {
        constructor(options?: NaivebayesOptions);
        async learn(text: string, category: string);
        toJson(): string;
        async categorize(text): Promise<string>;
    }

    function bayes(options?: NaivebayesOptions): Naivebayes;

    export default bayes;
}
