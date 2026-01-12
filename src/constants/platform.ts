import platform from 'platform';
import g from './urls';

const getCurrentTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const platformConfig = {
    app_version: g.WEB_VERSION,
    platform: g.API_PLATFORM,
    manufacturer: platform?.manufacturer ?? platform?.layout,
    product: platform?.product ?? platform?.name,
    description: platform?.description,
    timezone: getCurrentTimeZone(),
};

export const getPlatformEncoded = () => {
    try {
        const jsonString = JSON.stringify(platformConfig);
        const utf8Bytes = new TextEncoder().encode(jsonString);
        const base64Encoded = btoa(String.fromCharCode(...utf8Bytes));
        return base64Encoded;
    } catch (error) {
        // Handle the case where TextEncoder is not supported
        if (error instanceof ReferenceError) {
            // Fallback for older browsers without TextEncoder
            const jsonString = JSON.stringify(platformConfig);
            return btoa(unescape(encodeURIComponent(jsonString)));
        } else {
            // Handle other potential errors
            // eslint-disable-next-line no-console
            console.error('Error encoding platformConfig:', error);
            return null;
        }
    }
};

export const platformEncoded = getPlatformEncoded();

export const platformRaw = platformConfig;
