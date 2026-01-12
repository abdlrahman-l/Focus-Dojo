import { createFileRoute } from '@tanstack/react-router';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/language')({
    component: LanguageSelection,
});

function LanguageSelection() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const currentLanguage = i18n.language;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
            {/* Logo Placeholder - simple implementation until real logo is available */}
            <div className="mb-8 flex flex-col items-center">
                <div className="mb-4 flex size-27 items-center justify-center rounded-xl">
                    <img src='/images/app-icon.webp' />
                </div>
                <h1 className="text-2xl font-bold tracking-[0.2em]">{t('title')}</h1>
            </div>

            <p className="mb-8 text-gray-400">{t('selectLanguage')}</p>

            <div className="w-full max-w-md space-y-4">
                {/* Indonesian Option */}
                <div
                    onClick={() => changeLanguage('id')}
                    className={cn(
                        "group relative flex cursor-pointer items-center justify-between rounded-xl border border-gray-800 bg-[#111111] p-4 transition-all hover:border-gray-600",
                        currentLanguage === 'id' && "border-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div className="size-8 overflow-hidden rounded flex items-center justify-center">
                            {/* Flag for Indonesia */}
                            <span className="text-4xl">🇮🇩</span>
                        </div>
                        <span className="font-semibold">{t('indonesian')}</span>
                    </div>
                    {currentLanguage === 'id' && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                            <Check className="h-4 w-4 text-black" />
                        </div>
                    )}
                </div>

                {/* English Option */}
                <div
                    onClick={() => changeLanguage('en')}
                    className={cn(
                        "group relative flex cursor-pointer items-center justify-between rounded-xl border border-gray-800 bg-[#111111] p-4 transition-all hover:border-gray-600",
                        currentLanguage === 'en' && "border-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div className="size-8 overflow-hidden rounded flex items-center justify-center">
                            {/* Flag for USA */}
                            <span className="text-4xl">🇺🇸</span>
                        </div>
                        <span className="font-semibold">{t('english')}</span>
                    </div>
                    {currentLanguage === 'en' && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                            <Check className="h-4 w-4 text-black" />
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-8 w-full max-w-md px-4">
                <Button
                    className="w-full bg-primary py-6 text-base font-bold tracking-widest text-white hover:bg-[#059669]"
                    onClick={() => console.log('Protocol Initialized')}
                >
                    {t('initializeProtocol')}
                </Button>
            </div>
        </div>
    );
}
