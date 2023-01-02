import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ClassifierTile from "../components/classifierTile";
import Favicon from "../components/favicon";
import FileUpload from "../components/fileUpload";
import Footer from "../components/footer";
import GitHubRibbon from "../components/gitHubRibbon";
import Navbar from "../components/navbar";
import NavItem from "../components/navItem";
import Spinner from "../components/spinner";
import { getAbsoluteTop } from "../utils/spatial";
import { trpc } from "../utils/trpc";


const App: NextPage = () => {

  const [isLoading, setIsLoading] = useState(true);

  // Maintain these references to allow smooth scrolling to sections.
  const [navbarHeight, setNavbarHeight] = useState(0);
  const myClassifiersRef = useRef<HTMLDivElement>(null);
  const newClassifierRef = useRef<HTMLDivElement>(null);

  // Maintains a handle to the user's session.
  const { data: sessionData } = useSession();

  const loadingTile = useRef<HTMLDivElement>(null);
  const classifiersQuery = trpc.classifier.list.useQuery(undefined, {
    onSettled: () => {
      setIsLoading(false);
    },
  });
  const addClassifierQuery = trpc.classifier.train.useMutation({
    onSettled: () => classifiersQuery.refetch(), // Reload all classifiers on add.
  });

  return (
    <>
      <Head>
        <title>Classr &middot; My classifiers ({sessionData?.user?.name})</title>
        <meta name="description" content="Train and use microclassifiers in the cloud" />
        <Favicon />
      </Head>
      <header>
        <Navbar onScrollListenerRegistered={(offsetHeight) => setNavbarHeight(offsetHeight)}>
          <>
            <NavItem text="Home" href="/" />
            <NavItem text="My Classifiers" onClick={() => window.scrollTo({
              top: getAbsoluteTop(myClassifiersRef.current) - navbarHeight,
              behavior: "smooth",
            })} />
            <NavItem text="New Classifier" onClick={() => window.scrollTo({
              top: getAbsoluteTop(newClassifierRef.current) - navbarHeight,
              behavior: "smooth",
            })} />
            <NavItem text="Sign out" onClick={() => signOut({ callbackUrl: '/' })} />
          </>
        </Navbar>
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
            <div className="flex justify-center items-center h-full">
              <div className="text-white">
                <Image
                  src="/logo-app.svg"
                  className="mx-auto mb-4"
                  width={640}
                  height={100}
                  alt="Classr Logo" />
                <h4 className="text-lg mb-6">
                  Hey {sessionData?.user?.name}! You can manage, inspect and test your microclassifiers below.
                </h4>
              </div>
            </div>
          </div>
        </section>
        <section
          ref={myClassifiersRef}
          className="p-12 text-center relative overflow-hidden bg-no-repeat bg-cover rounded-lg grid lg:grid-cols-6 md:grid-cols-1 gap-4">
          <div className="col-span-1"></div>
          <div className="lg:col-span-4 md:col-span-1">
            {isLoading ?
              <div ref={loadingTile} className="p-6 mb-6 rounded-lg bg-neutral-800 text-white border border-neutral-700">
                <Spinner />
              </div> :
              <>
                {classifiersQuery.data?.length ?
                  classifiersQuery.data?.map((classifier) => <ClassifierTile classifier={classifier} />) :
                  <div ref={loadingTile} className="p-6 mb-6 rounded-lg bg-neutral-800 text-neutral-400 text-white border border-neutral-700">
                    You have no microclassifiers yet!
                  </div>}
                <div ref={newClassifierRef} className="p-6 mb-6">
                  <FileUpload
                    onChange={(e) => {
                      const f = e.target.files?.item(0);
                      if (!f) {
                        return;
                      }
                      setIsLoading(true);
                      const fr = new FileReader();
                      fr.onload = () => {
                        addClassifierQuery.mutate({ data: fr.result as string });
                      };
                      fr.readAsDataURL(f);
                    }} />
                </div>
              </>
            }
          </div>
          <div className="col-span-1"></div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default App;
