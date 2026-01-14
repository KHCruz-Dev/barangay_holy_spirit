import { FcGoogle } from "react-icons/fc";

const GoogleDividerButton = ({ text }) => {
  return (
    <>
      <button
        type="button"
        className="relative w-full text-blue-600 text-sm py-3 rounded-md bg-transparent border-2 border-blue-600 transition duration-200 
        hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-400 flex items-center justify-center gap-3"
      >
        <FcGoogle className="w-5 h-5" />
        <span>{text}</span>
      </button>
    </>
  );
};

export default GoogleDividerButton;
