import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const Modal = ({ title, children, toggleModal }: any) => {

    return <div className="w-full h-full absolute top-0 flex justify-center items-center left-0 bg-slate-600 bg-opacity-50">
        <div className="bg-white border rounded w-5/12 shadow-lg">
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