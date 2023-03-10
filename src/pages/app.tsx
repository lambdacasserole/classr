/**
 * Contains the application classifiers page (main app).
 *
 * @since 02/01/2023
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */

import { useRef, useState } from "react";

import { type NextPage } from "next";
import Head from "next/head";

import { signOut, useSession } from "next-auth/react";

import { toast } from 'react-toastify';

import { getAbsoluteTop } from "../utils/spatial";
import { trpc } from "../utils/trpc";

import Jumbotron from "../components/jumbotron";
import ClassifierTile from "../components/classifierTile";
import FileUpload from "../components/fileUpload";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import NavItem from "../components/navItem";
import Spinner from "../components/spinner";


/**
 * The application classifiers page (main app).
 */
const App: NextPage = () => {

    // Required to make use of query invalidation.
    const utils = trpc.useContext();

    // Loading state and reference to loading tile.
    const loadingTile = useRef<HTMLDivElement>(null);

    // Maintain these references to allow smooth scrolling to sections.
    const [navbarHeight, setNavbarHeight] = useState(0);
    const myClassifiersRef = useRef<HTMLDivElement>(null);
    const newClassifierRef = useRef<HTMLDivElement>(null);

    // Maintains a handle to the user's session.
    const { data: sessionData } = useSession();

    // Queries and mutations for list/add/delete classifier.
    const listClassifiersQuery = trpc.classifier.list.useQuery(undefined, {
        onError: () => toast.error("Error retrieving classifiers, ensure you're logged in and refresh the page to try"
            + " again."),
    });
    const addClassifierMutation = trpc.classifier.train.useMutation({
        onSuccess: () => {
            toast.success("CSV file uploaded successfully! You can now access your trained model!");
            utils.classifier.list.invalidate(); // Invalidate query on add.
        },
        onError: (error) => toast.error(error.message),
    });
    const deleteMutation = trpc.classifier.delete.useMutation({
        onSuccess: () => {
            toast.success("Model successfully deleted.");
            utils.classifier.list.invalidate(); // Invalidate query on delete.
        },
    });
    const isFetchingOrMutating = listClassifiersQuery.isFetching
        || addClassifierMutation.isLoading
        || deleteMutation.isLoading; // TODO: No need to reload entire page, just fire query and hide tile.

    return (
        <>
            {/* Injected into document head */}
            <Head>
                <title>Classr &middot; My classifiers ({sessionData?.user?.name})</title>
            </Head>
            {/* Header section */}
            <header>
                {/* Navigation bar */}
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
                {/* Jumbotron */}
                <Jumbotron imageSrc="/logo-app.svg" imageAlt="Classr Logo" className="h-96" showButton={false}
                    subtitle={`Hey ${sessionData?.user?.name}! You can manage, inspect and test your microclassifiers below.`} />
                {/* Classifiers section */}
                <section
                    ref={myClassifiersRef}
                    className="p-12 text-center relative overflow-hidden bg-no-repeat bg-cover rounded-lg grid lg:grid-cols-6 md:grid-cols-1 gap-4">
                    <div className="col-span-1"></div>
                    <div className="lg:col-span-4 md:col-span-1">
                        {listClassifiersQuery.isLoading ?
                            // Loading tile.
                            <div ref={loadingTile} className="p-6 mb-6 rounded-lg bg-neutral-800 text-white border border-neutral-700">
                                <Spinner />
                            </div> :
                            <>
                                {listClassifiersQuery.data?.length ?
                                    // Classifier tiles.
                                    listClassifiersQuery.data?.map((classifier, i) => <ClassifierTile
                                        key={i}
                                        classifier={classifier}
                                        onDelete={(classifier) => {
                                            deleteMutation.mutate({ classifierUuid: classifier.uuid });
                                        }} />) :
                                    // No classifiers tile.
                                    <div
                                        ref={loadingTile}
                                        className="p-6 mb-6 rounded-lg bg-neutral-800 text-neutral-400 text-white border border-neutral-700">
                                        You have no microclassifiers yet!
                                    </div>}
                                {isFetchingOrMutating && // TODO: No need to reload entire page, just fire query and hide tile.
                                    // Loading tile.
                                    <div ref={loadingTile} className="p-6 mb-6 rounded-lg bg-neutral-800 text-white border border-neutral-700">
                                        <Spinner />
                                    </div>}
                                {/* New classifier upload. */}
                                <div ref={newClassifierRef} className="p-6 mb-6">
                                    <FileUpload
                                        onChange={(e) => {

                                            // Receive uploaded file.
                                            const uploadedFile = e.target.files?.item(0);
                                            if (!uploadedFile) {
                                                return; // No file selected.
                                            }

                                            // Read file and make tRPC call with base64.
                                            const fileReader = new FileReader();
                                            fileReader.onload = () => {
                                                addClassifierMutation.mutate({
                                                    name: uploadedFile.name,
                                                    data: fileReader.result as string,
                                                });
                                            };
                                            fileReader.readAsDataURL(uploadedFile);
                                        }} />
                                </div>
                            </>
                        }
                    </div>
                    <div className="col-span-1"></div>
                </section>
            </main>
            {/* Include footer */}
            <Footer />
        </>
    );
};

export default App;
