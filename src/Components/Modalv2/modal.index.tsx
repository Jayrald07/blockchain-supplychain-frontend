import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const Modal = ({ title, children, toggleModal, size }: any) => {

    let _size = 5;

    if (size === "sm") _size = 3;

    return <div className="w-full h-full fixed top-0 flex justify-center items-center left-0 bg-slate-600 bg-opacity-50">
        <div className={`bg-white border w-3/4 sm:w-2/4 md:w-${_size}/12 lg:w-1/4  rounded w-${_size}/12 shadow-lg`}>
            <div className="flex p-4 border-b items-center">
                <h1 className="w-full">{title}</h1>
                <FontAwesomeIcon role="button" icon={faClose} onClick={toggleModal} />
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    </div>

}