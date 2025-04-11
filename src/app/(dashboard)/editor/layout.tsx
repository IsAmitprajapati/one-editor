import { SidebarProvider } from "@/components/ui/sidebar";
import EditorHeader from "./_component/EditorHeader";
import EditorSidebar from "./_component/EditorSidebar";
import FileOpen from "./_component/FileOpen";
import { EditorProviderComp } from "./_provider/EditorProvider";
import BrowerRunCode from "./_component/BrowerRunCode";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <EditorProviderComp>
        <EditorHeader />
        <div className="relative">
          <BrowerRunCode>
            <SidebarProvider>
              {/**editor sidebar */}
              <EditorSidebar />

              {/**editor and file open */}
              <main className="bg-gray-100 w-full">
                <FileOpen />
                {children}
              </main>
            </SidebarProvider>
          </BrowerRunCode>
        </div>
      </EditorProviderComp>
    </div>
  );
}
