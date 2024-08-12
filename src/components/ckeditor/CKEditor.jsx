/* eslint-disable camelcase */
import { useState, useEffect, useRef } from "react";

import { CKEditor as Editor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  AccessibilityHelp,
  Alignment,
  AutoLink,
  Autosave,
  Bold,
  CloudServices,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  ImageBlock,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  PageBreak,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SelectAll,
  SimpleUploadAdapter,
  Strikethrough,
  Table,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TodoList,
  Underline,
  Undo,
} from "ckeditor5";
import {
  Comments,
  RevisionHistory,
  ExportPdf,
  FormatPainter,
  ImportWord,
  PasteFromOfficeEnhanced,
  TableOfContents,
} from "ckeditor5-premium-features";
import PropTypes from "prop-types";

import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";

import "./ckeditor.css";

import { ckeditorPdfOptions, getAuthHeaders, getToken } from "./ckeditor.utils";
import { CommentsIntegration } from "./plugins/CommentsIntegration";
import { InjectAccessTokenPlugin } from "./plugins/InjectAccessTokenPlugin";
import { RevisionHistoryIntegration } from "./plugins/RevisionHistoryIntegration";

const CKEditor = ({
  config,
  exportFileName,
  onReady,
  disableComments = false,
  disableRevisionHistory = false,
  customRevisionContainer = false,
  ...props
}) => {
  const { exportPdfConf = {}, ...restConfig } = config || {};

  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const editorAnnotationsRef = useRef(null);
  const editorRevisionHistoryRef = useRef(null);
  const editorRevisionHistoryEditorRef = useRef(null);
  const editorRevisionHistorySidebarRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);
    return () => {
      window.removeEventListener("beforeunload", checkPendingActions);
      const revisionHistoryNameTooltip =
        document.getElementsByClassName("ck-body-wrapper")[0];
      revisionHistoryNameTooltip?.remove();
      setIsLayoutReady(false);
    };
  }, []);

  const checkPendingActions = (editor, domEvt) => {
    if (editor.plugins.get("PendingActions").hasAny) {
      domEvt.preventDefault();
      domEvt.returnValue = true;
    }
  };

  const editorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "importWord",
        "exportPdf",
        "formatPainter",
        "findAndReplace",
        "selectAll",
        "|",
        "heading",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "removeFormat",
        "|",
        "pageBreak",
        "link",
        "insertImage",
        "insertTable",
        "tableOfContents",
        "highlight",
        "|",
        "alignment",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "indent",
        "outdent",
        "|",
        "accessibilityHelp",
      ],
      shouldNotGroupWhenFull: true,
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      AutoLink,
      Autosave,
      Bold,
      CloudServices,
      Essentials,
      ExportPdf,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      FormatPainter,
      GeneralHtmlSupport,
      Heading,
      Highlight,
      ImageBlock,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageToolbar,
      ImageUpload,
      ImportWord,
      Indent,
      IndentBlock,
      Italic,
      Link,
      List,
      PageBreak,
      Paragraph,
      PasteFromOffice,
      PasteFromOfficeEnhanced,
      RemoveFormat,
      SelectAll,
      SimpleUploadAdapter,
      Strikethrough,
      Table,
      TableCellProperties,
      TableColumnResize,
      TableOfContents,
      TableProperties,
      TableToolbar,
      TodoList,
      Underline,
      Undo,
    ],
    extraPlugins: [InjectAccessTokenPlugin],
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, "default", 18, 20, 22],
      supportAllValues: true,
    },
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    htmlSupport: {
      allow: [
        {
          name: /^.*$/,
          styles: true,
          attributes: true,
          classes: true,
        },
      ],
    },
    image: {
      toolbar: [
        "imageTextAlternative",
        "|",
        "imageStyle:alignBlockLeft",
        "imageStyle:block",
        "imageStyle:alignBlockRight",
        "|",
        "resizeImage",
      ],
      styles: {
        options: ["alignBlockLeft", "block", "alignBlockRight"],
      },
    },
    licenseKey: "<PUT ANY LICENSE KEY HERE>",
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    placeholder: "Type or paste your content here!",
    ...(disableRevisionHistory
      ? {}
      : {
          revisionHistory: {
            ...(customRevisionContainer
              ? {
                  editorContainer: editorContainerRef.current,
                  viewerContainer: document.getElementById(
                    "revision-history-custom"
                  ),
                  viewerEditorElement: document.getElementById(
                    "revision-history-custom-editor"
                  ),
                  viewerSidebarContainer: document.getElementById(
                    "revision-history-custom-sidebar"
                  ),
                }
              : {
                  editorContainer: editorContainerRef.current,
                  viewerContainer: editorRevisionHistoryRef.current,
                  viewerEditorElement: editorRevisionHistoryEditorRef.current,
                  viewerSidebarContainer:
                    editorRevisionHistorySidebarRef.current,
                }),
            resumeUnsavedRevision: true,
          },
        }),
    sidebar: {
      container: editorAnnotationsRef.current,
    },
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
    importWord: {
      tokenUrl: () => getToken("word"),
    },
    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: `https://app.scrut.io/api/v1/fileUploaderService/ckeditor/uploadImage`,
      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: getAuthHeaders(),
    },
    customDownload: {
      url: "https://app.scrut.io/api/v1/fileUploaderService",
      tokens: getAuthHeaders(),
    },
    ...restConfig,
  };

  return (
    <div className="main-container">
      <div
        ref={editorContainerRef}
        className="editor-container editor-container_classic-editor editor-container_include-annotations"
      >
        <div className="editor-container__editor-wrapper">
          <div className="editor-container__editor">
            <div ref={editorRef}>
              {isLayoutReady && (
                <Editor
                  disableWatchdog
                  config={editorConfig}
                  editor={ClassicEditor}
                  onReady={async (editor) => {
                    try {
                      window.addEventListener(
                        "beforeunload",
                        checkPendingActions
                      );
                      if (!disableComments && !disableRevisionHistory) {
                        editor.plugins.get("AnnotationsUIs").switchTo("inline");
                      }

                      if (onReady) onReady(editor);
                    } catch (e) {
                      console.error({ e });
                    }
                  }}
                  {...props}
                />
              )}
            </div>
          </div>
          {!disableComments && !disableRevisionHistory && (
            <div className="editor-container__sidebar">
              <div ref={editorAnnotationsRef}></div>
            </div>
          )}
        </div>
      </div>
      {!disableComments && !disableRevisionHistory && (
        <div ref={editorRevisionHistoryRef} className="revision-history">
          <div className="revision-history__wrapper">
            <div
              ref={editorRevisionHistoryEditorRef}
              className="revision-history__editor"
            ></div>
            <div
              ref={editorRevisionHistorySidebarRef}
              className="revision-history__sidebar"
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

CKEditor.displayName = "CKEditor";

CKEditor.propTypes = {
  config: PropTypes.shape({
    extraPlugins: PropTypes.array,
  }),
  exportFileName: PropTypes.string,
  onReady: PropTypes.func,
  disableComments: PropTypes.bool,
  disableRevisionHistory: PropTypes.bool,
  customRevisionContainer: PropTypes.bool,
};

export default CKEditor;
