import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import ClassifierTile from "../components/classifierTile";
import Favicon from "../components/favicon";
import { trpc } from "../utils/trpc";


const App: NextPage = () => {

  const [trainingData, setTrainingData] = useState<string | null>(null);

  const { data: sessionData } = useSession();

  const { data: classifiers } = trpc.classifier.list.useQuery();
  const hello = trpc.classifier.train.useMutation();

  return (
    <>
      <Head>
        <title>Classr &middot; My classifiers ({sessionData?.user?.name ?? "Unknown user"})</title>
        <meta name="description" content="Train and use microclassifiers in the cloud" />
        <Favicon />
      </Head>
      {/* <aside className="bg-gray-800 w-64 h-screen fixed left-0 top-0 overflow-y-auto">
        <img src="/logo-hero.svg" alt="Logo" className="h-8 w-auto mx-auto mt-4" />
        <nav className="px-4 py-2">
          <a href="#" className="block px-2 py-1 text-white font-semibold rounded hover:bg-gray-700">Home</a>
          <a href="#" className="block px-2 py-1 text-white font-semibold rounded hover:bg-gray-700">About</a>
          <a href="#" className="block px-2 py-1 text-white font-semibold rounded hover:bg-gray-700">Contact</a>
        </nav>
      </aside> */}


      <main>
        {classifiers?.map((classifier) => <ClassifierTile classifier={classifier} />)}
        <input
          type="file"
          name="file"
          className="upload-file"
          id="file"
          onChange={(e) => {
            const f = e.target.files?.item(0);
            if (!f) {
              return;
            }
            const fr = new FileReader();
            fr.onload = () => {
              setTrainingData(fr.result as string);
            };
            fr.readAsDataURL(f);

            // console.log(e.target.files?.item(0));
          }}
          required />
        <button onClick={() => {
          if (!trainingData) {
            return;
          }
          hello.mutate({ data: trainingData });
        }
        }>ggwp</button>
      </main>
    </>
  );
};

export default App;
