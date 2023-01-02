import type { Context } from "react";

import Head from "next/head";
import Image from "next/image";
import type { OAuthConfig } from "next-auth/providers";
import { getProviders, signIn } from "next-auth/react"

import ActionButton from "../../components/actionButton";
import Favicon from "../../components/favicon";
import LinkButton from "../../components/linkButton";


/**
 * Props for the {@link SignIn} page.
 */
export interface SignInProps {

    /**
     * The providers to display on the sign-in page.
     */
    providers: OAuthConfig<unknown>[];
}


/**
 * Converts a provider name for display on the sign-in page.
 *
 * @param providerName the provider name to convert
 * @returns the converted provider name
 */
function convertProviderName(providerName: string): string {
    const lowerCaseProviderName = providerName.toLowerCase();
    if (lowerCaseProviderName === 'atlassian') {
        return 'bitbucket';
    }
    return providerName.toLowerCase();
}


/**
 * The sign in page.
 */
const SignIn: React.FC<SignInProps> = ({ providers }: SignInProps) => {
    return (
        <>
            <Head>
                <title>Classr &middot; Sign in</title>
                <meta name="description" content="Train and use microclassifiers in the cloud" />
                <Favicon />
            </Head>
            <main className="grid h-screen place-items-center" style={{
                backgroundImage: "url('/images/hero-wisps-dark.png')",
                backgroundSize: 'cover',
            }}>
                <div className="p-6 bg-neutral-800 border border-neutral-700 rounded text-center">
                    <Image
                        src="/logo-hero.svg"
                        className="mx-auto mb-6"
                        width={256}
                        height={100}
                        alt="Classr Logo" />
                    <h3 className="text-lg text-white">Sign in</h3>
                    <hr className="w-40 mx-auto border-t-2 border-neutral-600 mt-6 mb-6" />
                    {Object.values(providers).map((provider) => (
                        <div key={provider.name} >
                            <ActionButton
                                className="mb-3 mr-0"
                                onClick={() => signIn(provider.id, {
                                    callbackUrl: '/',
                                })}
                                text={`Sign in with ${provider.name}`}
                                icon={`/images/${convertProviderName(provider.name)}.svg`} />
                        </div>
                    ))}
                    <hr className="w-40 mx-auto border-t-2 border-neutral-600 mt-3 mb-6" />
                    <LinkButton href="/" text="Back to Home" className="border-red-500 text-red-500" />
                </div>
            </main>
        </>
    )
}

export default SignIn;

export async function getServerSideProps(context: Context) {
    const providers = await getProviders()
    return {
        props: { providers },
    }
}