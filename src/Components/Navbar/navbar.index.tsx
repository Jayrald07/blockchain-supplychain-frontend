import React, { useEffect, useRef, useState } from "react";
import "./navbar.index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faDatabase,
  faTableColumns,
  faChevronLeft,
  faSignOut,
  faArrowRight,
  faChain,
  faCog,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";

export default () => {
  const navbar: any = useRef(null);
  const toggler: any = useRef(null);
  const firstList: any = useRef(null);
  const dashboard: any = useRef(null);
  const asset: any = useRef(null);
  const transaction: any = useRef(null);
  const transfer: any = useRef(null);
  const connections: any = useRef(null);
  const logout: any = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSideOpen, setIsSideOpen] = useState(false);


  const [isNavOpen, setIsNavOpen] = useState(true);

  const toggleTab = (element: any) => {
    element.children[1].style.display = isNavOpen ? "none" : "initial";
    element.style.textAlign = isNavOpen ? "center" : "initial";
  };

  const handleToggler = () => {
    toggler.current.children[0].style.transform = isNavOpen
      ? "rotate(180deg)"
      : "unset";
    navbar.current.style.width = isNavOpen ? "80px" : "300px";
    firstList.current.style.gridTemplateColumns = isNavOpen
      ? "unset"
      : "1fr 4fr 1fr";
    firstList.current.style.paddingLeft = isNavOpen ? 0 : "20px";
    firstList.current.children[0].style.padding = isNavOpen ? "20px" : 0;
    firstList.current.children[0].style.width = isNavOpen ? "80px" : "100%";
    firstList.current.children[0].style.justifySelf = isNavOpen
      ? "center"
      : "initial";
    firstList.current.children[1].style.display = isNavOpen
      ? "none"
      : "initial";

    navbar.current.children[0].style.width = isNavOpen ? "80px" : "100%";
    navbar.current.children[1].style.width = isNavOpen ? "80px" : "100%";

    toggleTab(dashboard.current);
    toggleTab(asset.current);
    toggleTab(transfer.current);
    toggleTab(transaction.current);
    toggleTab(connections.current);
    toggleTab(logout.current);

    setIsNavOpen(!isNavOpen);
  };

  const handleSidebarToggle = (e: any) => {
    e.stopPropagation();
    let toggle = !isSideOpen;
    setIsSideOpen(toggle);
  }

  const handleBackClick = (e: any) => {
    handleSidebarToggle(e)
  }

  useEffect(() => { }, [isNavOpen]);

  return (
    <div className={`top-0 navbar-container ${isSideOpen ? 'w-full block' : 'w-0'} z-10  h-full fixed sm:relative md:relative overflow-x-hidden sm:w-auto md:w-auto`} onClick={handleBackClick}>
      <div className={`fixed ${isSideOpen ? 'left-52' : 'rounded rounded-tl-none rounded-bl-none border-l-0'} sm:hidden z-50 bg-white border rounded shadow-md block top-20 text-sm p-2 px-3 cursor-pointer hover:bg-slate-100`} onClick={handleSidebarToggle}>
        <FontAwesomeIcon icon={faBars} size="sm" />
      </div>
      <nav onClick={(e) => e.stopPropagation()} className={`h-full bg-slate-700 fixed sm:relative md:relative sm:w-auto md:w-auto ${isSideOpen ? 'w-auto block' : 'w-0'} overflow-x-hidden`} ref={navbar}>
        <ol>
          {/* <li ref={firstList}>
          <img src={Logo} draggable="false" />
          <span>ChainDirect</span>
          <a href="#" ref={toggler} onClick={handleToggler}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </a>
        </li> */}
          <li>
            <a className='p-5 py-4 text-white flex gap-x-4 items-center text-center justify-center bg-slate-50' href="#" ref={dashboard}>
              <img src={Logo} draggable="false" className="w-32" />
            </a>
          </li>
          <li>
            <a className={`p-5 text-white flex gap-x-4 items-center ${location.pathname === "/dashboard" ? 'bg-slate-600' : ''} hover:bg-slate-600`} href="/dashboard" ref={dashboard}>
              <FontAwesomeIcon icon={faTableColumns} /> <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a className={`p-5 text-white flex gap-x-4 items-center ${location.pathname === "/asset" ? 'bg-slate-600' : ''} hover:bg-slate-600`} href="/asset" ref={asset}>
              <FontAwesomeIcon icon={faDatabase} /> <span>Manage Assets</span>
            </a>
          </li>
          <li>
            <a className={`p-5 text-white flex gap-x-4 items-center ${location.pathname === "/transfer" ? 'bg-slate-600' : ''} hover:bg-slate-600`} href="/transfer" ref={transfer}>
              <FontAwesomeIcon icon={faArrowRight} /> <span>Transaction</span>
            </a>
          </li>
          <li>
            <a className={`p-5 text-white flex gap-x-4 items-center ${location.pathname === "/transaction" ? 'bg-slate-600' : ''} hover:bg-slate-600`} href="/transaction" ref={transaction}>
              <FontAwesomeIcon icon={faChartLine} /> <span>Transaction Logs</span>
            </a>
          </li>
          <li>
            <a className={`p-5 text-white flex gap-x-4 items-center ${location.pathname === "/connections" ? 'bg-slate-600' : ''} hover:bg-slate-600`} href="/connections" ref={connections}>
              <FontAwesomeIcon icon={faChain} /> <span>Connections</span>
            </a>
          </li>
          <li>
            <a className={`p-5 text-white flex gap-x-4 items-center ${location.pathname === "/settings" ? 'bg-slate-600' : ''} hover:bg-slate-600`} href="/settings" ref={connections}>
              <FontAwesomeIcon icon={faCog} /> <span>Settings</span>
            </a>
          </li>
        </ol>
      </nav>
    </div>

  );
};
