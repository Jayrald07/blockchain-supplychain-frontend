import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const Modal = ({ title, children, toggleModal, size }: any) => {

    let _size = 5;

    if (size === "sm") _size = 3;

    return <div className="w-full z-20 h-full px-5 fixed top-0 flex justify-center items-center left-0 bg-slate-600 bg-opacity-50">
        <div className={`bg-white border w-full sm:w-2/4 md:w-${_size}/12 lg:w-2/4  rounded w-${_size}/12 shadow-lg`}>
            <div className="flex p-4 border-b items-center">
                <h1 className="w-full">{title}</h1>
                <FontAwesomeIcon role="button" icon={faClose} onClick={() => toggleModal()} />
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    </div>

}