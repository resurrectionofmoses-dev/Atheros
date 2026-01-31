
import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { Message } from './Message';

interface ChatViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onInteractionSubmit?: (messageTimestamp: Date, answer: string) => void;
  searchQuery: string;
}

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center justify-center p-4">
        <div className="flex space-x-1.5">
            <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></div>
        </div>
    </div>
);

export const ChatView: React.FC<ChatViewProps> = ({ messages, isLoading, onInteractionSubmit, searchQuery }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto bg-gray-900 rounded-t-lg">
      <div className="max-w-4xl mx-auto w-full p-4 md:px-8 space-y-6">
        {searchQuery.trim() && (
            <div className="text-center text-sm text-gray-400 font-bold py-2 bg-gray-800/50 rounded-lg border-2 border-black sticky top-2 z-10">
                {messages.length} result{messages.length === 1 ? '' : 's'} found for "{searchQuery}"
            </div>
        )}
        {messages.map((msg) => {
            const isModel = msg.sender === 'model';
            return (
                 <div key={msg.timestamp.getTime()} className={`flex w-full ${isModel ? 'justify-start' : 'justify-end'}`}>
                    <Message 
                        message={msg} 
                        onInteractionSubmit={onInteractionSubmit}
                        searchQuery={searchQuery}
                    />
                </div>
            )
        })}
        {isLoading && messages[messages.length - 1]?.sender === 'model' && !messages[messages.length - 1]?.content &&(
             <div className="flex items-start gap-4 p-4 md:p-6 w-full justify-start">
                <div className="flex items-end gap-3 max-w-3xl">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-600" />
                    <div className="message-bubble message-bubble-model">
                        <LoadingIndicator />
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
