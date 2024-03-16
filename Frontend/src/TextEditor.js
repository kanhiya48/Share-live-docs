import { useCallback, useEffect, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom"

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

export default function TextEditor() {
  const navigate=useNavigate();
  const { id: documentId } = useParams()
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()
  const [cookies, removeCookie] = useCookies(['token']);
  useEffect(() => {
      if (!cookies || !cookies.token) {
    console.log("Token not present");
    navigate('/login');
    return;
  }
    if(cookies.token){
      console.log("cookie ",JSON.stringify(cookies))
    const s = io(`${process.env.REACT_APP_SERVER}`,{
  auth: {
    token: cookies.token
  }
})
    setSocket(s)

    return () => {
      s.disconnect()
    }}
    else{
      alert("token not present")
    }
  }, [cookies])

  useEffect(() => {
    if (socket == null || quill == null) return

    socket.once("load-document", document => {
      
     const data= JSON.parse(document.data)
      console.log("data   ",data)
      quill.setContents(data)
      quill.enable()
    })

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId])

  useEffect(() => {
    if (socket == null || quill == null) return

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = delta => {
      quill.updateContents(delta)
    }
    socket.on("receive-changes", handler)

    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
      socket.emit("send-changes", delta)
    }
    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }
  }, [socket, quill])
const [wrapperRef, setWrapperRef] = useState(null);

useEffect(() => {
  if (!wrapperRef) return;

  wrapperRef.innerHTML = "";
  const editor = document.createElement("div");
  wrapperRef.appendChild(editor);
  const q = new Quill(editor, {
    theme: "snow",
    modules: { toolbar: TOOLBAR_OPTIONS },
  });
  q.disable();
  q.setText("Loading...");
  setQuill(q);

}, [wrapperRef]); // Ensure useEffect runs whenever wrapperRef changes

return <div className="container" ref={setWrapperRef}></div>;

}