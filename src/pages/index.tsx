/**
 * Contains the application home/landing page.
 *
 * @since 30/12/2022
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import { useRef, useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { signIn, signOut, useSession } from "next-auth/react";

import { getAbsoluteTop } from "../utils/spatial";

import Navbar from "../components/navbar";
import Jumbotron from "../components/jumbotron";
import StaticImageCard from "../components/staticImageCard";
import AnimatedImageCard from "../components/animatedImageCard";
import NavItem from "../components/navItem";
import Favicon from "../components/favicon";
import ActionButton from "../components/actionButton";
import LinkButton from "../components/linkButton";
import GitHubRibbon from "../components/gitHubRibbon";
import Footer from "../components/footer";


/**
 * The application home/landing page.
 */
const Home: NextPage = () => {

  // Maintain these references to allow smooth scrolling to sections.
  const [navbarHeight, setNavbarHeight] = useState(0);
  const quickstartSection = useRef<HTMLElement>(null);
  const trainingSection = useRef<HTMLElement>(null);
  const usageSection = useRef<HTMLElement>(null);


  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Classr &middot; Train and use microclassifiers in the cloud</title>
        <meta name="description" content="Train and use microclassifiers in the cloud" />
        <Favicon />
      </Head>
      <header>
        <Navbar onScrollListenerRegistered={(offsetHeight) => setNavbarHeight(offsetHeight)}>
          <>
            <NavItem text="Home" onClick={() => window.scrollTo({
              top: 0,
              behavior: "smooth",
            })} />
            <NavItem text="Quickstart" onClick={() => window.scrollTo({
              top: getAbsoluteTop(quickstartSection.current) - navbarHeight,
              behavior: "smooth",
            })} />
            <NavItem text="Training" onClick={() => window.scrollTo({
              top: getAbsoluteTop(trainingSection.current) - navbarHeight,
              behavior: "smooth",
            })} />
            <NavItem text="Usage" onClick={() => window.scrollTo({
              top: getAbsoluteTop(usageSection.current) - navbarHeight,
              behavior: "smooth",
            })} />
            {sessionData ?
              <>
                <NavItem text={`My Classifiers (${sessionData.user?.name})`} href="/app" />
                <NavItem text="Sign out" onClick={() => signOut()} />
              </> :
              <NavItem text="Sign in" onClick={() => signIn()} />
            }
          </>
        </Navbar>
      </header>
      <main className="flex min-h-screen flex-col bg-neutral-900">
        <Jumbotron onButtonClick={() => window.scrollTo({
          top: getAbsoluteTop(quickstartSection.current) - navbarHeight,
          behavior: "smooth"
        })} />
        <section
          ref={quickstartSection}
          className="p-12 text-center relative overflow-hidden grid lg:grid-cols-3 md:grid-cols-1 gap-4">
          <div className="lg:col-span-3 md:col-span-1">
            <h2 className="text-xl text-white mb-4">Quickstart</h2>
            <hr className="w-40 mx-auto border-t-2 border-gray-400 mt-6 mb-6" />
          </div>
          <div className="col-span-1">
            <StaticImageCard
              title="Sign in/up"
              text="We support sign-in with GitHub, GitLab or Bitbucket"
              imageSrc="/images/source-control.svg"
              imageAlt="GitHub, GitLab and Bitbucket logos"
              buttonText={sessionData ? "Already signed in" : "Register"}
              buttonDisabled={!!sessionData}
              onButtonClick={() => signIn()}
            />
          </div>
          <div className="col-span-1">
            <AnimatedImageCard
              title="Train your first microclassifier"
              text="Provide your training data as a CSV file mapping documents to classes"
              baseUrl="/images/animations/classifier-training/frame-#.svg"
              imageAlt="Animation of a Classr logo slowly filling up with colour from bottom to top"
              frameCount={10}
              frameDelay={500}
              buttonText="See supported formats"
              onButtonClick={() => window.scrollTo({
                top: getAbsoluteTop(trainingSection.current) - navbarHeight,
                behavior: "smooth"
              })} />
          </div>
          <div className="col-span-1">
            <AnimatedImageCard
              title="Use your trained model"
              text="Query your model using our simple HTTP REST API"
              baseUrl="/images/animations/classifier-use/frame-#.svg"
              imageAlt="Animation of a Classr logo flashing green and red from left to right"
              frameCount={2}
              frameDelay={500}
              buttonText="Read the docs"
              onButtonClick={() => window.scrollTo({
                top: getAbsoluteTop(usageSection.current) - navbarHeight,
                behavior: "smooth"
              })} />
          </div>
        </section>
        <section
          ref={trainingSection}
          className="p-12 text-center relative overflow-hidden bg-neutral-800 grid lg:grid-cols-4 md:grid-cols-1 gap-4">
          <div className="lg:col-span-4 md:col-span-1">
            <h2 className="text-xl text-white mb-4">Training</h2>
            <hr className="w-40 mx-auto border-t-2 border-gray-400 mt-6 mb-6" />
          </div>
          <div className="col-span-1"></div>
          <div className="col-span-1">
            <Image alt="" src="/images/training-data.png" width={800} height={100} />
          </div>
          <div className="col-span-1 text-left text-white pl-5">
            <p className="font-bold mb-3">
              Provide your training data to Classr as a 2-column CSV file.
            </p>
            <p className="mb-6">
              This file must have a &quot;label&quot; column containing class labels and a &quot;document&quot; column
              containing documents. A maximum file size of 4MB is supported for training your microclassifier.
            </p>
            <p>
              {sessionData ?
                <LinkButton text="Train a microclassifier now" href="/app" /> :
                <ActionButton text="Sign in to train a microclassifier" onClick={() => signIn()} />}
            </p>
          </div>
          <div className="col-span-1"></div>
        </section>
        <section
          ref={usageSection}
          className="p-12 text-center relative overflow-hidden grid lg:grid-cols-4 md:grid-cols-1 gap-4">
          <div className="col-span-1"></div>
          <div className="lg:col-span-2 md:col-span-1">
            <h2 className="text-xl text-white mb-4">Usage</h2>
            <hr className="w-40 mx-auto border-t-2 border-gray-400 mt-6 mb-6" />
            <p className="text-white">
              Each microclassifier you create gives you, and everyone who knows your microclassifier ID, the ability to
              use it for classification (a POST request) or retrieve information about it (a GET request).
            </p>
          </div>
          <div className="col-span-1"></div>
          <div className="col-span-1"></div>
          <div className="lg:col-span-2 md:col-span-1 text-left">
            <h3 className="text-lg text-white mb-4">Get microclassifier info (GET)</h3>
            <pre className="text-mono overflow-scroll bg-neutral-800 text-white p-6 rounded">
{"$ curl https://classr.dev/api/classifier/<classifier-uuid>"}
            </pre>
            <h3 className="text-lg text-white mb-4 mt-4">Use microclassifier (POST)</h3>
            <pre className="text-mono overflow-scroll bg-neutral-800 text-white p-6 rounded">
{"$ curl --header \"Content-Type: application/json\" --request POST --data '{\"document\":\"The text of the unseen document to classify!\"}' https://classr.dev/api/classifier/<classifier-uuid>"}
            </pre>
          </div>
          <div className="col-span-1"></div>
        </section>
      </main>
      <Footer />
      <GitHubRibbon />
    </>
  );
};

export default Home;
