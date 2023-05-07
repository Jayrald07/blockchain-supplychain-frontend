import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./prompt.index.css"
import { faClose } from "@fortawesome/free-solid-svg-icons"
export default ({ question, description, buttons, onClose, handleClick }: { question: string, description: string, buttons: string[], onClose: () => void, handleClick: (response: string) => void }) => {

  return <div className="fixed top-0 z-50 left-0 w-full flex justify-center items-start prompt-container h-full py-5">
    <div className="bg-white relative z-50 w-3/4 sm:3/4 md:w-2/4 lg:w-1/4 rounded-sm shadow-md ">
      <div className="flex items-center py-1 px-4">
        <span className="text-sm w-full"></span>
        <a href="#" onClick={onClose}>
          <FontAwesomeIcon icon={faClose} size="xs" />
        </a>
      </div>
      <div className="px-4">
        <h1 className="font-medium text-sm">{question}</h1>
        <small className="font-thin text-xs">{description}</small>
      </div>
      <div className="px-4 py-3 pt-4 flex justify-end">
        {
          buttons.map((button) => {
            return <button key={button} className="font-light text-xs py-1 px-2 border rounded mr-2" onClick={() => handleClick(button)}>{button}</button>
          })
        }
        <button className="font-light text-xs py-1 px-2 border rounded" onClick={onClose}>Cancel</button>
      </div>
    </div>
  </div>
}