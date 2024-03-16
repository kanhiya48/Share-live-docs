import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const navigate = useNavigate();
 const [showTooltips, setShowTooltips] = useState([]);
  const [showTooltips1, setShowTooltips1] = useState([]);
  const id = useRef();
  const [docscreated, setDocsCreated] = useState([]);
  const [cookies, removeCookie] = useCookies(['token']);
  const [username, setUsername] = useState('');
   const[namebox,setNameBox]=useState(false);
   const[docname,setDocName]=useState('');
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate('/login');
      }
      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER}`,
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      setUsername(user);

      if (status) {
        console.log("toast")
       
      } else {
        removeCookie('token');
        navigate('/login');
      }
      if (status) {
        const { data } = await axios.post(
          `${process.env.REACT_APP_SERVER}/getuserdocs`,
          {},
          { withCredentials: true }
        );
        setDocsCreated([...data.docs]);
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

   const handleMouseEnter = (index) => {
    const newTooltips = [...showTooltips];
    newTooltips[index] = true;
    setShowTooltips(newTooltips);
  };

  const handleMouseLeave = (index) => {
    const newTooltips = [...showTooltips];
    newTooltips[index] = false;
    setShowTooltips(newTooltips);
  };
   const handleMouseEnter1 = (index) => {
    const newTooltips = [...showTooltips1];
    newTooltips[index] = true;
    setShowTooltips1(newTooltips);
  };

  const handleMouseLeave1 = (index) => {
    const newTooltips = [...showTooltips1];
    newTooltips[index] = false;
    setShowTooltips1(newTooltips);
  };

  const logout = () => {
    removeCookie('token');
    navigate('/signup');
  };

  const createDoc = async (docname) => {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER}/getuniqueidandcreatedoc`,
      {docname},
      { withCredentials: true }
    );
    setDocsCreated([...docscreated, response.data]);
  };
  const deleteDoc = async (item) => {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER}/deletedoc`,
      {item:item},
      { withCredentials: true }
    );
    if(response.data.status===true){
    toast(`Document Deleted`, {
          position: 'top-center',
        });
    setDocsCreated([...response.data.docs]);}
  else
  toast(`Error deleting document`, {
          position: 'top-center',
        });
  };

  const goToDocument = () => {
    if (id.current.value !== '') navigate(`documents/${id.current.value}`);
  };

  return (<>
     <nav className=" sticky top-0 flex flex-col md:flex-row items-center justify-between px-4 py-2 bg-gray-800 text-white">
      <div className="text-center md:text-left mb-2 md:mb-0">
        <h4 className="text-2xl font-bold">
          Welcome <span className="text-blue-500">{username}</span>
        </h4>
      </div>
      <div className="text-center md:flex items-center md:space-x-4">
        <button
          onClick={()=>{setNameBox(true)}}
          className="relative px-4 py-2 mt-2 md:mt-0 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        >
          
          Create Document
           {namebox && <div className='absolute left-0 top-[5rem] p-3 rounded-sm shadow-lg bg-indigo-500 '>
            <div className='ml-auto text-left'>Enter Document name</div>
             <div className=''>
            <input className='rounded inline p-2 w-[15rem] mt-2 text-black h-[3rem]  ' onChange={(e)=>{setDocName(e.target.value)}} value={docname} placeholder='Enter doc name'></input>
             <button style={{right:"12px" , top:"44px"}} onClick={(event)=>
             { event.stopPropagation(); if(docname==="") {toast("Name can not be empty",{position:'top-center'}); return} createDoc(docname); setNameBox(false);setDocName('');}}  className=' absolute bg-green-300 hover:bg-green-700 rounded h-[3rem] w-[3rem]  inline'><img src='submit.png' alt='jjjj'  /></button>
            </div>
          </div>}
        </button>
       
        <button
          onClick={()=>{navigate('visdocs')}}
          className="px-4 py-2 mt-2 md:mt-0 bg-green-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        >
          Visited Documents
        </button>
        <button
          onClick={logout}
          className="px-4 py-2 mt-2 md:mt-0 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
    <div className="bg-gray-200 min-h-screen flex flex-col justify-center items-center p-4">
  
<div className="mt-4 flex flex-wrap justify-center">
  {docscreated.map((item, index) => (
    <div
  onClick={() => navigate(`documents/${item.id}`)}
  key={index}
  className="relative bg-white p-4 rounded-md shadow-md cursor-pointer hover:bg-gray-100 transition duration-300 m-2 flex flex-col justify-between"
  style={{ maxWidth: '300px' }} // Limiting maximum width for responsiveness
>
  <div className="flex items-center justify-between">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 mr-2 text-blue-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
    <span className="text-sm font-medium">{`${item.name}`}</span>
  </div>
 
  {/* This div provides the positioning context for the button */}
  <div  className="absolute top-0 right-0">
    {showTooltips[index]  && (
      <div className="absolute bg-blue-400 bottom-7 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-md">
        Copy document URL
      </div>
    )}

    {/* Button positioned at the top-right corner */}
    <button style={{heidht:"17px",width:"17px"}}
      className=" hover:bg-gray-200 text-gray-700 text-xs rounded-md transition-opacity"
      onClick={(event) => {
        event.stopPropagation();
        var urldoc= window.location.href + 'documents/' + item.id;
        navigator.clipboard.writeText(urldoc);
        toast(`Document URL Copied you can share it now`, {
          position: 'top-center',
        });
      }}
onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
    >
      <img src='copy.png' alt='not found' />
    </button>
  </div>
  <div  className="absolute top-0 left-0">
    {showTooltips1[index] && (
      <div className="absolute bg-red-400 bottom-7 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-md">
        Delete Document
      </div>
    )}

    {/* Button positioned at the top-right corner */}
    <button style={{heidht:"17px",width:"17px"}}
      className=" hover:bg-gray-200 text-gray-700 text-xs rounded-md transition-opacity"
      onClick={(event) => {
        event.stopPropagation();
       
       deleteDoc(item);
      }}
      onMouseEnter={() => handleMouseEnter1(index)}
            onMouseLeave={() => handleMouseLeave1(index)}
      
    >
      <img src='delete.png' alt='not found' />
    </button>
  </div>
</div>

  ))}
</div>


  <ToastContainer />
</div>
</>
  );
}

export default Home;
