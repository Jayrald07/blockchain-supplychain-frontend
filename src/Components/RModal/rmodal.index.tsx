
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./rmodal.index.css"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { ReactNode, useState } from "react"
export default ({ title = "TITLE", Component, onClose }: { title: string, Component: ReactNode, onClose: () => void }) => {

  return <div className="fixed px-5 top-0 left-0 w-full h-full modal-container justify-center items-center flex">
    <section className="bg-white w-full md:w-1/2 lg:w-1/2 xl:w-1/3 rounded-sm shadow-md">
      <section className="py-2 px-4 flex items-center border-b">
        <h1 className="w-full text-md">{title}</h1>
        <a href="#" onClick={onClose}>
          <FontAwesomeIcon icon={faClose} size="xs" />
        </a>
      </section>
      <section className="p-4">
        {Component}
      </section>
    </section>
  </div >

}