
import React, { useState } from 'react';
import { ImplementationResult } from './ImplementationResult';
import type { ImplementationResponse } from '../types';
import { BuildIcon, SpinnerIcon, PackageIcon } from './icons';
import { PopularLanguages } from './PopularLanguages';

interface SoftwareWorkshopProps {
  onGenerate: (logic: string) => Promise<ImplementationResponse | null>;
}

export const SoftwareWorkshop: React.FC<SoftwareWorkshopProps> = ({ onGenerate }) => {
  const [logic, setLogic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedModule, setGeneratedModule] = useState<ImplementationResponse | null>(null);
  const [moduleWasSaved, setModuleWasSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logic.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedModule(null);
    setModuleWasSaved(false);

    try {
      const result = await onGenerate(logic);
      if (result) {
        setGeneratedModule(result);
        setModuleWasSaved(true); // Confirmation state
      } else {
        setError('Failed to generate module. The response was empty or invalid.');
      }
    } catch (err) {
      setError('An unexpected error occurred during module generation.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg">
      <div className="p-4 border-b-4 border-black sticky top-0 z-10 bg-gray-800 rounded-t-lg">
        <h2 className="font-comic-header text-3xl text-white">Software Workshop</h2>
        <p className="text-gray-400 -mt-1">Generate new software modules for AetherOS.</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
        
        {/* Main Content Area (Form & Output) */}
        <div className="lg:w-2/3 flex flex-col gap-4 overflow-hidden">
            <form onSubmit={handleSubmit} className="comic-panel bg-gray-800/50 p-4">
              <h3 className="font-comic-header text-2xl text-violet-300 border-b-2 border-black pb-2 mb-3">Module Logic</h3>
              <p className="text-sm text-gray-400 mb-4">Describe the functionality of the module you want to create. AetherOS will generate the necessary files and code structure.</p>
              <textarea
                value={logic}
                onChange={(e) => setLogic(e.target.value)}
                placeholder="e.g., 'A module to monitor tire pressure and send an alert if it drops below 30 PSI.'"
                className="w-full h-32 bg-gray-900/80 border-2 border-black rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-200"
                required
                disabled={isLoading}
              />
              <button type="submit" disabled={!logic.trim() || isLoading} className="comic-button bg-violet-600 hover:bg-violet-700 text-white w-full mt-4 py-2 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <SpinnerIcon className="w-5 h-5" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <BuildIcon className="w-5 h-5" />
                    <span>Generate Module</span>
                  </>
                )}
              </button>
            </form>

            <div className="flex-1 comic-panel bg-black/50 overflow-hidden flex flex-col">
                <h3 className="font-comic-header text-2xl text-violet-300 border-b-2 border-black p-3">Generated Output</h3>
                <div className="flex-1 overflow-y-auto p-4">
                    {error && <div className="text-center text-red-400 p-6">{error}</div>}
                    
                    {!isLoading && generatedModule && moduleWasSaved && (
                        <div className="text-center text-green-400 mb-4 p-4 flex flex-col items-center gap-3 fade-in comic-panel bg-gray-800/50">
                            <PackageIcon className="w-10 h-10" />
                            <p className="font-bold">Module generated and saved to the Module Bay!</p>
                        </div>
                    )}

                    {generatedModule && (
                        <div className="fade-in">
                            <ImplementationResult response={generatedModule} />
                        </div>
                    )}
                    
                    {!isLoading && !generatedModule && !error && (
                        <div className="text-center text-gray-500 italic p-6">
                            Generated files will appear here.
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Side Panel (Popular Languages) */}
        <div className="lg:w-1/3 lg:max-h-full overflow-y-auto">
            <PopularLanguages />
        </div>

      </div>
    </div>
  );
};
