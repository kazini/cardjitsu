import { Link } from "react-router-dom"
function NavBar({connection}:{connection:string}){
    return(
        <div className="flex flex-row justify-between p-2 h-[5%]">
            <Link to={`/`}>Home</Link>
            <h3>Connection: {connection}</h3>
        </div>
    )
}
export default NavBar;