import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import ClassifierTile from "../components/classifierTile";
import Favicon from "../components/favicon";
import NavBar from "../components/navbar";
import { trpc } from "../utils/trpc";


const App: NextPage = () => {

  const [trainingData, setTrainingData] = useState<string | null>(null);

  const { data: sessionData } = useSession();

  const qr = trpc.classifier.list.useQuery();
  const hello = trpc.classifier.train.useMutation({
    onSuccess: () => qr.refetch(),
  });

  return (
    <>
      <Head>
        <title>Classr &middot; My classifiers ({sessionData?.user?.name ?? "Unknown user"})</title>
        <meta name="description" content="Train and use microclassifiers in the cloud" />
        <Favicon />
      </Head>
      <header>
        <NavBar>
          <>

          </>
        </NavBar>
      </header>


      <main className="flex min-h-screen flex-col bg-neutral-900">

      <section
            className="p-12 h-100 text-center relative overflow-hidden bg-no-repeat bg-cover bg-fixed rounded-lg"
            style={{
                backgroundImage: "url('/images/hero-wisps.png')",
                height: "400px",
            }}>
            <div
                className="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                }}>
                {/* <div className="flex justify-center items-center h-full">
                    <div className="text-white">
                        <Image
                            src="/logo-hero.svg"
                            className="mx-auto mb-4"
                            width={512}
                            height={100}
                            alt="Classr Logo" />
                        <h4 className="text-lg mb-6">
                            Train microclassifiers in the cloud for spam detection, sentiment analysis and more.
                        </h4>
                        <ActionButton text="Get started" onClick={onButtonClick} />
                    </div>
                </div> */}
            </div>
        </section>
        <section
          className="p-12 text-center relative overflow-hidden bg-no-repeat bg-cover rounded-lg grid lg:grid-cols-6 md:grid-cols-1 gap-4">
          <div className="col-span-1"></div>
          <div className="lg:col-span-4 md:col-span-1">
            {qr.data?.map((classifier) => <ClassifierTile classifier={classifier} />)}
          </div>
          <div className="col-span-1"></div>
        </section>
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
