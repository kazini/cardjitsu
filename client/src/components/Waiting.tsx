import { useState } from "react";

function Waiting({id}:{id:string|undefined}){

    const [idCopied, setIdCopied] = useState(false);
    const [urlCopied, setUrlCopied] = useState(false);
    const copyId = () =>{
        navigator.clipboard.writeText(id || "");
        setIdCopied(true);
    }
    const copyUrl = () =>{
        navigator.clipboard.writeText(`http://localhost:5173/room/${id}` || "");
        setUrlCopied(true);
    }

    return(
        <div className="text-text font-lilita text-4xl p-6 h-full gap-5 flex flex-col items-center justify-center text-center">
            <h2 className="my-8">Waiting for players...</h2>
            <h3>INVITE YOUR FRIEND</h3>
            <div className={`flex flex-col items-center justify-center gap-1`}>
                <h3 className="text-secondary text-xl">Copy ID</h3>
                <div className={`relative cursor-pointer bg-text rounded-md w-[300px] outline outline-green-400 ${idCopied ? "outline-3" : " outline-0"}`} onClick={copyId}>
                    <h2 className={`text-primary text-center p-1 px-14`}>{id}</h2>
                    <svg className="absolute right-2 top-0 bottom-0 my-auto" fill="#8EB0EB" height="24px" width="24px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 460 460" xmlSpace="preserve">
                        <g>
                            <g>
                                <g>
                                    <path d="M425.934,0H171.662c-18.122,0-32.864,14.743-32.864,32.864v77.134c6.985,0,144.07,0,149.543,0
                                        c34.664,0,62.865,28.201,62.865,62.865c0,6.489,0,145.491,0,147.139h74.728c18.121,0,32.864-14.743,32.864-32.865V32.864
                                        C458.797,14.743,444.055,0,425.934,0z"/>
                                    <path d="M288.339,139.998H34.068c-18.121,0-32.865,14.743-32.865,32.865v254.272C1.204,445.257,15.946,460,34.068,460h254.272
                                        c18.122,0,32.865-14.743,32.865-32.864V172.863C321.206,154.741,306.461,139.998,288.339,139.998z"/>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <h3 className="text-secondary text-xl">Copy URL</h3>
                <div className={`relative cursor-pointer bg-text rounded-md w-[300px] outline outline-green-400 ${urlCopied ? "outline-3" : " outline-0"}`} onClick={copyUrl}>
                    <h2 className={`text-primary text-center p-1 px-14 truncate`}>{`http://localhost:5173/room/${id}`}</h2>
                    <svg className="absolute right-2 top-0 bottom-0 my-auto" fill="#8EB0EB" height="24px" width="24px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 460 460" xmlSpace="preserve">
                        <g>
                            <g>
                                <g>
                                    <path d="M425.934,0H171.662c-18.122,0-32.864,14.743-32.864,32.864v77.134c6.985,0,144.07,0,149.543,0
                                        c34.664,0,62.865,28.201,62.865,62.865c0,6.489,0,145.491,0,147.139h74.728c18.121,0,32.864-14.743,32.864-32.865V32.864
                                        C458.797,14.743,444.055,0,425.934,0z"/>
                                    <path d="M288.339,139.998H34.068c-18.121,0-32.865,14.743-32.865,32.865v254.272C1.204,445.257,15.946,460,34.068,460h254.272
                                        c18.122,0,32.865-14.743,32.865-32.864V172.863C321.206,154.741,306.461,139.998,288.339,139.998z"/>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    )
}
export default Waiting;