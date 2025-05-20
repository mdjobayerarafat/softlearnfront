import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import styled from 'styled-components'
import Youtube from '@tiptap/extension-youtube'
// Custom Extensions
import InfoCallout from '@components/Objects/Editor/Extensions/Callout/Info/InfoCallout'
import WarningCallout from '@components/Objects/Editor/Extensions/Callout/Warning/WarningCallout'
import ImageBlock from '@components/Objects/Editor/Extensions/Image/ImageBlock'
import VideoBlock from '@components/Objects/Editor/Extensions/Video/VideoBlock'
import MathEquationBlock from '@components/Objects/Editor/Extensions/MathEquation/MathEquationBlock'
import PDFBlock from '@components/Objects/Editor/Extensions/PDF/PDFBlock'
import QuizBlock from '@components/Objects/Editor/Extensions/Quiz/QuizBlock'

// Lowlight
import { common, createLowlight } from 'lowlight'
const lowlight = createLowlight(common)
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import { NoTextInput } from '@components/Objects/Editor/Extensions/NoTextInput/NoTextInput'
import EditorOptionsProvider from '@components/Contexts/Editor/EditorContext'
import AICanvaToolkit from './AI/AICanvaToolkit'
import EmbedObjects from '@components/Objects/Editor/Extensions/EmbedObjects/EmbedObjects'
import Badges from '@components/Objects/Editor/Extensions/Badges/Badges'
import Buttons from '@components/Objects/Editor/Extensions/Buttons/Buttons'
import Table from '@tiptap/extension-table'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import UserBlock from '@components/Objects/Editor/Extensions/Users/UserBlock'
import { getLinkExtension } from '@components/Objects/Editor/EditorConf'

interface Editor {
  content: string
  activity: any
}

function Canva(props: Editor) {
  /**
   * Important Note : This is a workaround to enable user interaction features to be implemented easily, like text selection, AI features and other planned features, this is set to true but otherwise it should be set to false.
   * Another workaround is implemented below to disable the editor from being edited by the user by setting the caret-color to transparent and using a custom extension to filter out transactions that add/edit/remove text.
   * To let the various Custom Extensions know that the editor is not editable, React context (EditorOptionsProvider) will be used instead of props.extension.options.editable.
   */
  const isEditable = true

  // Code Block Languages for Lowlight
  lowlight.register('html', html)
  lowlight.register('css', css)
  lowlight.register('js', js)
  lowlight.register('ts', ts)
  lowlight.register('python', python)
  lowlight.register('java', java)

  const editor: any = useEditor({
    editable: isEditable,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'bullet-list',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'ordered-list',
          },
        },
      }),
      NoTextInput,
      // Custom Extensions
      InfoCallout.configure({
        editable: isEditable,
      }),
      WarningCallout.configure({
        editable: isEditable,
      }),
      ImageBlock.configure({
        editable: isEditable,
        activity: props.activity,
      }),
      VideoBlock.configure({
        editable: true,
        activity: props.activity,
      }),
      MathEquationBlock.configure({
        editable: false,
        activity: props.activity,
      }),
      PDFBlock.configure({
        editable: true,
        activity: props.activity,
      }),
      QuizBlock.configure({
        editable: isEditable,
        activity: props.activity,
      }),
      Youtube.configure({
        controls: true,
        modestBranding: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      EmbedObjects.configure({
        editable: isEditable,
        activity: props.activity,
      }),
      Badges.configure({
        editable: isEditable,
        activity: props.activity,
      }),
      Buttons.configure({
        editable: isEditable,
        activity: props.activity,
      }),
      UserBlock.configure({
        editable: isEditable,
        activity: props.activity,
      }),
      Table.configure({
        resizable: true,
      }),
      getLinkExtension(),
      TableRow,
      TableHeader,
      TableCell,
    ],

    content: props.content,
  })

  return (
    <EditorOptionsProvider options={{ isEditable: false }}>
      <CanvaWrapper>
        <AICanvaToolkit activity={props.activity} editor={editor} />
        <EditorContent editor={editor} />
      </CanvaWrapper>
    </EditorOptionsProvider>
  )
}

const CanvaWrapper = styled.div`
  width: 100%;
  margin: 0 auto;

  .bubble-menu {
    display: flex;
    background-color: #0d0d0d;
    padding: 0.2rem;
    border-radius: 0.5rem;

    button {
      border: none;
      background: none;
      color: #fff;
      font-size: 0.85rem;
      font-weight: 500;
      padding: 0 0.2rem;
      opacity: 0.6;

      &:hover,
      &.is-active {
        opacity: 1;
      }
    }
  }

  // disable chrome outline

  .ProseMirror {
    // Workaround to disable editor from being edited by the user.
    caret-color: transparent;

    h1 {
      font-size: 30px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    h2 {
      font-size: 25px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    h3 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    h4 {
      font-size: 18px;
      font-weight: 600;
      margin-top: 10px;
      margin-bottom: 10px;
    }

    h5 {
      font-size: 16px;
      font-weight: 600;
      margin-top: 10px;
      margin-bottom: 10px;
    }

    // Link styling
    a {
      color: #2563eb;
      text-decoration: underline;
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: #1d4ed8;
        text-decoration: none;
      }
    }

    ul,
    ol {
      padding: 0 1rem;
      padding-left: 20px;
    }

    ul {
      list-style-type: disc;
    }

    ol {
      list-style-type: decimal;
    }

    table {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;

    td,
    th {
      border: 1px solid rgba(139, 139, 139, 0.4);
      box-sizing: border-box;
      min-width: 1em;
      padding: 6px 8px;
      position: relative;
      vertical-align: top;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      background-color: rgba(217, 217, 217, 0.4);
      font-weight: bold;
      text-align: left;
    }

    .selectedCell:after {
      background: rgba(139, 139, 139, 0.2);
      content: "";
      left: 0; right: 0; top: 0; bottom: 0;
      pointer-events: none;
      position: absolute;
      z-index: 2;
    }

    .column-resize-handle {
      background-color: #8d78eb;
      bottom: -2px;
      pointer-events: none;
      position: absolute;
      right: -2px;
      top: 0;
      width: 4px;
      }
    }

    &:focus {
      outline: none !important;
      outline-style: none !important;
      box-shadow: none !important;
    }

    // Code Block
    pre {
      background: #0d0d0d;
      border-radius: 0.5rem;
      color: #fff;
      font-family: 'JetBrainsMono', monospace;
      padding: 0.75rem 1rem;

      code {
        background: none;
        color: inherit;
        font-size: 0.8rem;
        padding: 0;
      }

      .hljs-comment,
      .hljs-quote {
        color: #616161;
      }

      .hljs-variable,
      .hljs-template-variable,
      .hljs-attribute,
      .hljs-tag,
      .hljs-name,
      .hljs-regexp,
      .hljs-link,
      .hljs-name,
      .hljs-selector-id,
      .hljs-selector-class {
        color: #f98181;
      }

      .hljs-number,
      .hljs-meta,
      .hljs-built_in,
      .hljs-builtin-name,
      .hljs-literal,
      .hljs-type,
      .hljs-params {
        color: #fbbc88;
      }

      .hljs-string,
      .hljs-symbol,
      .hljs-bullet {
        color: #b9f18d;
      }

      .hljs-title,
      .hljs-section {
        color: #faf594;
      }

      .hljs-keyword,
      .hljs-selector-tag {
        color: #70cff8;
      }

      .hljs-emphasis {
        font-style: italic;
      }

      .hljs-strong {
        font-weight: 700;
      }
    }
  }
`

export default Canva
