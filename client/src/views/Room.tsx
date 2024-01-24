import { Link, useParams } from "react-router-dom"
function Home() {
    const {id} = useParams();
    return (
      <>
        <Link to={`/`}>Home</Link>
        <div className="flex flex-col justify-center items-center text-white text-2xl">
            <h1 className="text-blue-300">Room {id}</h1>
        </div>
      </>
    )
  }
  
  export default Home
  