/**
 * Contains the {@link PlausibleAnalytics} component and its props interface.
 *
 * @since 15/01/2023
 * @author Saul Johnson <saul.a.johnson@gmail.com>
 */


/**
 * Props for the {@link PlausibleAnalytics} component.
 */
export interface PlausibleAnalyticsProps {

    /**
     * The host at which the Plausible analytics instance is running.
     */
    host: string;

    /**
     * The domain this application should record analytics against in Plausible.
     */
    domain: string;
}


/**
 * Represents a connection to a Plausible anlaytics server.
 */
const PlausibleAnalytics: React.FC<PlausibleAnalyticsProps> = ({ host, domain }: PlausibleAnalyticsProps) => {
    return <script defer data-domain={domain} src={`https://${host}/js/plausible.js`}></script>;
}

export default PlausibleAnalytics;
