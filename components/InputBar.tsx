
import React from 'react';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { XIcon } from './icons/XIcon';
import type { AttachedFile } from '../types';
import { BinaryFileAttachment } from './BinaryFileAttachment';
import { isBinaryFile } from '../utils';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  inputText: string;
  setInputText: (text: string) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  attachedFiles: AttachedFile[];
  onFilesChange: (files: FileList | null) => void;
  onRemoveFile: (fileName: string) => void;
  onScanFile: (fileName: string) => void;
}

export const InputBar: React.FC<InputBarProps> = ({ 
    onSendMessage, isLoading, inputText, setInputText, 
    isRecording, onToggleRecording, attachedFiles, onFilesChange, onRemoveFile, onScanFile
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() || attachedFiles.length > 0) {
      onSendMessage(inputText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [inputText]);
  
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const placeholder = "Enter a command or ask a question...";
  
  const textFiles = attachedFiles.filter(f => !isBinaryFile(f.name));
  const binaryFiles = attachedFiles.filter(f => isBinaryFile(f.name));

  return (
    <div className="p-4 pt-2 bg-gray-800 rounded-b-lg border-t-4 border-black">
      <div className="max-w-4xl mx-auto relative">
        <div className="flex flex-col p-2 rounded-xl comic-panel bg-gray-600">
            {(textFiles.length > 0 || binaryFiles.length > 0) && (
                <div className="p-2 border-b-2 border-black space-y-2">
                    {binaryFiles.map(file => (
                        <BinaryFileAttachment key={file.name} file={file} onScan={onScanFile} onRemove={onRemoveFile} />
                    ))}
                    {textFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {textFiles.map(file => (
                                <div key={file.name} className="flex items-center gap-2 bg-gray-700 rounded-full py-1 px-3 text-xs text-white border-2 border-black">
                                    <span>{file.name}</span>
                                    <button onClick={() => onRemoveFile(file.name)} className="text-gray-400 hover:text-white">
                                        <XIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex items-end gap-2 p-1">
            <input 
                type="file" 
                multiple 
                ref={fileInputRef} 
                onChange={(e) => onFilesChange(e.target.files)}
                className="hidden"
            />
            <button
                type="button"
                onClick={handleAttachClick}
                className="w-10 h-10 rounded-full text-gray-800 bg-gray-300 hover:bg-gray-100 flex items-center justify-center flex-shrink-0 transition-colors comic-button"
                aria-label="Upload Firmware"
            >
                <PaperclipIcon className="w-5 h-5" />
            </button>
            <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isRecording ? "Listening..." : placeholder}
                className="flex-1 bg-gray-200 resize-none focus:outline-none p-2 max-h-48 text-gray-800 placeholder-gray-500 rounded-lg border-2 border-black"
                rows={1}
                disabled={isLoading}
            />
            <button
                type="button"
                onClick={onToggleRecording}
                className={`w-10 h-10 rounded-full text-white flex items-center justify-center flex-shrink-0 transition-all duration-300 relative comic-button ${
                    isRecording 
                    ? 'bg-red-500' 
                    : 'bg-gray-700 hover:bg-gray-900'
                }`}
                aria-label={isRecording ? 'Stop listening' : 'Start listening'}
            >
                {isRecording && <div className="absolute inset-0 rounded-full bg-red-500/50 animate-pulse"></div>}
                <MicrophoneIcon className="w-5 h-5 z-10" />
            </button>
            <button
                type="submit"
                disabled={isLoading || (!inputText.trim() && attachedFiles.length === 0)}
                className="w-10 h-10 rounded-full bg-[var(--theme-color-main)] text-white flex items-center justify-center flex-shrink-0 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors comic-button"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
            </form>
        </div>
      </div>
    </div>
  );
};