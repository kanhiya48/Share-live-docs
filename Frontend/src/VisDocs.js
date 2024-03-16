import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
function VisDocs() {
    const [docs,setDocs]=useState([]);
      const [cookies, removeCookie] = useCookies(['token']);
      const [username, setUsername] = useState('');
      const [showTooltips, setShowTooltips] = useState([]);
  const [showTooltips1, setShowTooltips1] = useState([]);
     const navigate=useNavigate();



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

  
  const deleteDoc = async (item) => {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER}/removevisdoc`,
      {item:item},
      { withCredentials: true }
    );
    if(response.data.status===true){
    toast(`Document Removed`, {
          position: 'top-center',
        });
    setDocs([...response.data.docs]);}
  else
  toast(`Error removing document`, {
          position: 'top-center',
        });
  };







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
          `${process.env.REACT_APP_SERVER}/getvisdocs`,
          {},
          { withCredentials: true }
        );
        setDocs([...data.docs]);
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);



  return (
    
<>
     <nav className=" sticky top-0 flex flex-col md:flex-row items-center justify-between px-4 py-2 bg-gray-800 text-white">
      <div className="text-center md:text-left mb-2 md:mb-0">
        <h4 className="text-2xl font-bold">
          Welcome <span className="text-blue-500">{username}</span>
        </h4>
      </div>
      <div className="text-center md:flex items-center md:space-x-4">
         <button
          onClick={()=>{navigate('/')}}
          className="px-4 py-2 mt-2 md:mt-0 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        >
          Home
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
  {docs.map((item, index) => (
    <div
  onClick={() => navigate(`/documents/${item.id}`)}
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
  var currentURL = window.location.href;

// Remove "/visdocs" from the end of the URL
var modifiedURL = currentURL.replace("/visdocs", "");

// You can then append 'documents/' + item.id to the modifiedURL
var finalURL = modifiedURL + '/documents/' + item.id;
        navigator.clipboard.writeText(finalURL);
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
        Remove Document 
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
  )
}

export default VisDocs