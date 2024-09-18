import { LoaderFunctionArgs, redirect, useLoaderData } from "react-router-dom";
import { getThreadById } from "@/services/threads/service";
import { useEffect } from "react";
import { MessageComponent } from "./message";
import { ChatInput } from "./chat-input";
import { DocumentPanel } from "./document-panel";
import { ChatContextProvider, useChatContext } from "@/pages/chat/context";
import React from "react";
import type { Document, Thread } from "@/lib/database/schema";
import { ChatTitle } from "./chat-title";
import { useUsageQuery } from "@/services/usage/queries";
import { useMessagesQuery } from "@/services/messages/queries";
import { useDocumentsQuery } from "@/services/documents/queries";
import { FullPageLoader } from "@/components/fulll-page-loader";
import { useTranslation } from "react-i18next";

export async function loader(params: LoaderFunctionArgs) {
  const threadId = params.params.threadId;
  if (!threadId) {
    return { messages: [] };
  }
  const thread = await getThreadById(threadId);
  if (!thread) {
    return redirect(`/`);
  }
  return { thread };
}

const Document = React.memo(DocumentPanel);

function ChatContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:max-w-3xl xl:max-w-[48rem] w-full mx-auto">
      {children}
    </div>
  );
}

function ChatPageContent() {
  const { chatHook, scrollRef, scrollToEnd, isSmallScreen } = useChatContext();

  useEffect(() => {
    scrollToEnd();
  }, [scrollToEnd]);

  return (
    <div className="flex flex-row h-screen min-w-[20rem]">
      {!isSmallScreen && <Document />}
      <div className="w-full h-full flex flex-col">
        <ChatTitle />
        <div className="flex-grow overflow-hidden flex flex-col">
          <div className="flex-grow overflow-y-auto" ref={scrollRef}>
            <div className="mx-auto">
              {chatHook.messages.map((message) => (
                <ChatContainer key={message.id}>
                  <MessageComponent message={message} />
                </ChatContainer>
              ))}
            </div>
          </div>
          <div className="mx-auto w-full py-4">
            <ChatContainer>
              <ChatInput />
            </ChatContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { thread } = useLoaderData() as { thread: Thread };
  const { t } = useTranslation();
  const usageQuery = useUsageQuery();
  const messagesQuery = useMessagesQuery(thread.id);
  const documentQuery = useDocumentsQuery(thread.id);
  if (!usageQuery.data || !messagesQuery.data || !documentQuery.data) {
    return <FullPageLoader label={t("page.loading")} />;
  }

  return (
    <ChatContextProvider
      thread={thread}
      messages={messagesQuery.data}
      documents={documentQuery.data}
      usage={usageQuery.data}
    >
      <ChatPageContent />
    </ChatContextProvider>
  );
}
