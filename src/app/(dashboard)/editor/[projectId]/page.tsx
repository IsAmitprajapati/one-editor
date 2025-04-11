"use client";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { basicSetup, EditorView } from "codemirror";
import { EditorState } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
import { css, cssLanguage } from "@codemirror/lang-css";
import { toast } from "sonner";
import Axios from "@/lib/Axios";
import { useEditorContext } from "../_provider/EditorProvider";
import debounce from "@/lib/debounce";

const CodeEditor = () => {
  const searchParams = useSearchParams();
  const file = searchParams.get("file");
  const [element, setElement] = useState<HTMLElement | null>(null);
  const { projectId } = useParams();
  const [content, setContent] = useState<string>();
  const [fileId, setFileId] = useState<string>();
  const { isLoading, setIsLoading } = useEditorContext();

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    setElement(node);
  }, []);

  const fetchData = async () => {
    const payload = {
      projectId: projectId,
      fileName: file,
    };
    try {
      const response = await Axios.post("/api/code", payload);

      if (response.status === 200) {
        setContent(response?.data?.data?.content);
        setFileId(response?.data?.data?._id);
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  const updateData = async (fileContent: string) => {
    const payload = {
      fileId: fileId,
      content: fileContent,
    };
    try {
      setIsLoading(true);
      const response = await Axios.put("/api/code", payload);

      if (response.status === 200) {
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  const extensionArray = file?.split(".") || [];
  const extension = extensionArray[extensionArray?.length - 1];

  console.log("extension", extension);

  useEffect(() => {
    if (file && projectId) {
      fetchData();
    }
  }, [file, projectId]);

  
  const updateDataDebounce = debounce((doc : string)=>{
    updateData(doc);
  },2000)

  useEffect(() => {
    if (!element) return;

    const state = EditorState.create({
      doc: content,
      extensions: [
        basicSetup,
        //html, css , javascript
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            //1 sec it will be update in database
            updateDataDebounce(update.state.doc.toString())
            // setTimeout(() => {
            //   updateData(update.state.doc.toString());
            // }, 2000);
            
          }
        }),
        extension === "js"
          ? javascript()
          : extension === "css"
            ? css()
            : html({
              autoCloseTags : true,
              selfClosingTags  : true,
              nestedLanguages : [
                { 
                  tag : "style",
                  parser : cssLanguage.parser
                },
                { 
                  tag : "script",
                  parser : javascriptLanguage.parser
                }
              ]
            }),
      ],
    });

    const view = new EditorView({
      state: state,
      parent: element,
    });

    return () => {
      view.destroy();
    };
  }, [file, element, content]);

  return (
    <div className="p-2 pb-10">
      {!file ? (
        <div className="flex items-center justify-center flex-col bg-white rounded-md p-4 pb-7">
          <Image
            src={"/editor file.svg"}
            width={320}
            height={320}
            alt="editor"
          />
          <p className="text-slate-400">No file is open</p>
        </div>
      ) : (
        <div
          className="relative flex-1 h-full min-h-[calc(100vh-3.5rem)] bg-white w-full overflow-auto"
          ref={ref}
        ></div>
      )}
    </div>
  );
};

export default CodeEditor;
