import { useEffect, useRef, useState } from "react"
import AuthIndex from "../Auth/auth.index"
import ChannelIndex from "../Channel/channel.index"
import Headerbar from "../HeaderBar/headerbar.index"
import Navbar from "../Navbar/navbar.index"
import { Action, host, port, validateAndReturn } from "../../utilities"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { Modal } from "../Modalv2/modal.index"
import { HttpMethod, api as globalApi } from "../../services/http";
import { useNavigate } from "react-router-dom"
import useChannel from "../../hooks/useChannel"
import AlertIndex from "../Alert/alert.index"
import useVerified from "../../hooks/useVerified"
import useSocket from "../../hooks/useSocket"
import PromptIndex from "../Prompt/prompt.index"


const TransferForm = ({ channelId, toggleModal }: { channelId: string, toggleModal: (alert: { title?: string, content?: string, type?: string }) => void }) => {

    const [assets, setAssets] = useState([]);
    const [queueAssets, setQueueAssets] = useState<string[]>([]);
    const tbodyRowRef = useRef(null);
    const allCheckboxRef = useRef(null);
    const [specificAsset, setSpecificAsset] = useState<any>(null);
    console.log({ channelId })
    const handleAllCheckbox = (e: any) => {
        if (e.target.checked) {
            assets.map((asset: any) => {
                setQueueAssets(prevState => {
                    return [...prevState, asset.asset_uuid];
                })
            })
        } else {
            setQueueAssets([])
        }
        for (let row of (tbodyRowRef.current as any).children) {
            row.children[0].children[0].checked = e.target.checked
        }
    }

    const handleSpecificCheckbox = (e: any) => {
        let value = e.target.value;
        let assetIndex = queueAssets.indexOf(value);

        if (assetIndex > -1) {
            setQueueAssets(prevState => {
                let _pState = [...prevState];
                _pState.splice(assetIndex, 1);
                if (_pState.length === assets.length) (allCheckboxRef.current as any).checked = true;
                else (allCheckboxRef.current as any).checked = false;
                return _pState
            })
        } else {
            setQueueAssets(prevState => {
                let _q = [...prevState, value];
                if (_q.length === assets.length) (allCheckboxRef.current as any).checked = true;
                else (allCheckboxRef.current as any).checked = false;
                return _q;
            })
        }


    }

    const handleTransfer = async () => {
        if (queueAssets.length) {
            let data = await globalApi("/chaincode", HttpMethod.POST, {
                action: Action.TRANSFER,
                args: {
                    assetIds: queueAssets,
                    channelId
                }
            })

            const response = validateAndReturn(data);

            if (response.message === "Done") toggleModal({ type: 'success', title: 'Success transfer initiate', content: response.details })
            else toggleModal({ type: 'error', title: 'Error transfer initiate', content: response.details })

        }
    }

    const handleViewAsset = async (assetId: string) => {
        let data = await globalApi("/chaincode", HttpMethod.POST, {
            action: Action.READ,
            args: {
                assetId,
                channelId
            }
        })
        let cleaned = validateAndReturn(data)

        if (Object.keys(cleaned).includes("tags")) {
            let assetTags = cleaned.tags;
            let _asset = Object.assign({}, cleaned);
            _asset.tags = assetTags;
            setSpecificAsset(_asset);
        }

    }

    useEffect(() => {
        (async () => {
            let data = await globalApi("/chaincode", HttpMethod.POST, {
                action: Action.ASSETS,
                args: {
                    channelId
                }
            })

            setAssets(validateAndReturn(data));
            console.log(data)

            data = await globalApi("/chaincode", HttpMethod.POST, {
                action: Action.TRANSACTIONS,
                args: {
                    channelId
                }
            })

        })()
    }, []);

    return <div>
        {
            specificAsset
                ?
                <table className="w-full whitespace-nowrap border border-slate-100 text-left mb-3">
                    <tbody className="text-sm font-thin text-left">
                        <tr className="hover:bg-slate-50 border-b border-b-slate-100">
                            <td className="bg-slate-200 font-bold p-2 w-1/12 text-slate-600">Name</td>
                            <td className="p-2">{specificAsset.asset_name}</td>
                        </tr>
                        {
                            typeof specificAsset.tags === "string"
                                ? JSON.parse(specificAsset.tags).map((tag: any) => <tr key={tag.key} className="hover:bg-slate-50 border-b border-b-slate-100">
                                    <td className="bg-slate-200 font-bold p-2 w-1/12 text-slate-600">{tag.key}</td>
                                    <td className="p-2">{tag.value}</td>
                                </tr>) : specificAsset.tags.map((tag: any) => <tr key={tag.key} className="hover:bg-slate-50 border-b border-b-slate-100">
                                    <td className="bg-slate-200 font-bold p-2 w-1/12 text-slate-600">{tag.key}</td>
                                    <td className="p-2">{tag.value}</td>
                                </tr>)
                        }
                    </tbody>
                </table>

                : null
        }
        <table className="w-full border border-slate-100 mb-5">
            <thead className="bg-slate-100 text-sm text-slate-600 text-left">
                <tr>
                    <th className="p-2 text-center w-10"><input type="checkbox" ref={allCheckboxRef} onClick={handleAllCheckbox} /></th>
                    <th>Name</th>
                    <th></th>
                </tr>
            </thead>
            <tbody className="text-sm font-thin" ref={tbodyRowRef}>
                {
                    !assets.length
                        ? <tr className="hover:bg-slate-50 border-b-slate-100">
                            <td colSpan={3} className="p-2 text-center"><small>No Available Assets</small></td>
                        </tr>
                        : null
                }
                {
                    assets.map((asset: any) => {
                        return <tr key={asset.asset_uuid} className="hover:bg-slate-50 border-b-slate-100">
                            <td className="p-2 text-center"><input type="checkbox" value={asset.asset_uuid} onChange={handleSpecificCheckbox} /></td>
                            <td>
                                <a href="#" title="View Details">{asset.asset_name}</a>
                            </td>
                            <td className="text-right pr-4">
                                <a href="#" title="View Details" className="underline hover:no-underline" onClick={() => handleViewAsset(asset.asset_uuid)}>View Details</a>
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </table>
        <div className="flex justify-end">
            <button disabled={queueAssets.length === 0} onClick={handleTransfer} className={`text-sm border rounded p-2 disabled:bg-slate-100 ${queueAssets.length === 0 ? 'text-slate-400' : ''}`}>Submit</button>

        </div>
    </div>
}



const TransactionDetails = ({ transaction, channelId, toggleModal }: { transaction: any, channelId: string, toggleModal: () => void }) => {
    const [_transaction, setTransaction] = useState<any>(null);
    const [isLoadingAccept, setIsLoadingAccept] = useState(false);
    const [isLoadingReject, setIsLoadingReject] = useState(false);
    const [isLoadingTransfer, setIsLoadingTransfer] = useState(false);
    const [isLoadingOwn, setIsLoadingOwn] = useState(false);
    const [isLoadingGetBack, setIsLoadingGetBack] = useState(false);
    const [isLoadingReturn, setIsLoadingReturn] = useState(false);
    const [alertContent, setAlertContent] = useState<{ title?: string, description?: string, type?: string }>({})
    const [isReceiver, setIsReceiver] = useState('PENDING');
    const [promptContent, setPromptContent] = useState<{ question?: string, description?: string, buttons?: string[], transactionId?: string, type?: string }>({})


    const handleAcceptAsset = async (transactionId: string) => {
        setIsLoadingAccept(true)

        const data = await globalApi("/chaincode", HttpMethod.POST, {
            action: Action.ACCEPT,
            args: {
                transactionId,
                channelId
            }
        })

        const cleaned = validateAndReturn(data);

        let response = JSON.parse(cleaned.details);

        if (response.message === "Error") {
            setAlertContent({
                title: 'Error accepting',
                description: response.details,
                type: "error"
            })
        } else {
            setAlertContent({
                title: 'Success accepting',
                description: response.details,
                type: "success"
            })
        }

        setIsLoadingAccept(false)

        toggleModal()

    }

    const handleTransferAsset = async (transactionId: string) => {
        setIsLoadingTransfer(true);
        const data = await globalApi("/chaincode", HttpMethod.POST, {
            action: Action.TRANSFER_NOW,
            args: {
                transactionId,
                channelId
            }
        })


        const cleaned = validateAndReturn(data);

        let response = JSON.parse(cleaned.details);

        if (response.message === "Error") {
            setAlertContent({
                title: 'Error transferring',
                description: response.details,
                type: "error"
            })
        } else {
            setAlertContent({
                title: 'Success transferring',
                description: response.details,
                type: "success"
            })
        }

        setIsLoadingTransfer(false)

        toggleModal()
    }

    const handleOwnAsset = async (transactionId: string) => {
        setIsLoadingOwn(true);
        const data = await globalApi("/chaincode", HttpMethod.POST, {
            action: Action.OWN_ASSET,
            args: {
                transactionId,
                channelId
            }
        })

        const cleaned = validateAndReturn(data);

        let response = JSON.parse(cleaned.details);

        if (response.message === "Error") {
            setAlertContent({
                title: 'Error owning the asset',
                description: response.details,
                type: "error"
            })
        } else {
            setAlertContent({
                title: 'Success owning the asset',
                description: response.details,
                type: "success"
            })
        }

        setIsLoadingOwn(false)

        toggleModal()
    }

    const handleGetAssets = async (transactionId: string) => {
        setIsLoadingGetBack(true);
        const data = await globalApi("/chaincode", HttpMethod.POST, {
            action: Action.PULL,
            args: {
                channelId,
                transactionId
            }
        })

        const cleaned = validateAndReturn(data);

        let response = JSON.parse(cleaned.details);

        if (response.message === "Error") {
            setAlertContent({
                title: 'Error gettig back the asset/s',
                description: response.details,
                type: "error"
            })
        } else {
            setAlertContent({
                title: 'Success getting back the asset/s',
                description: response.details,
                type: "success"
            })
        }

        setIsLoadingGetBack(false)
        toggleModal();
    }

    const handleReject = async (transactionId: string) => {
        setIsLoadingReject(true);
        const data = await globalApi("/chaincode", HttpMethod.POST, {
            action: Action.REJECT,
            args: {
                channelId,
                transactionId
            }
        })

        const cleaned = validateAndReturn(data);

        let response = JSON.parse(cleaned.details);

        if (response.message === "Error") {
            setAlertContent({
                title: 'Error rejecting the transaction',
                description: response.details,
                type: "error"
            })
        } else {
            setAlertContent({
                title: 'Success rejecting transaction',
                description: response.details,
                type: "success"
            })
        }

        setIsLoadingReject(false)

        setTimeout(() => {
            toggleModal();
        }, 15000)
    }

    const handleReturn = async () => {
        const data = await globalApi("/chaincode", HttpMethod.POST, {
            action: Action.RETURN,
            args: {
                channelId,
                transactionId: promptContent.transactionId,
                reason: 'nothing'
            }
        })
        console.log(data)
        let response = validateAndReturn(data);
        console.log(response);

        if (response.message === "Done") {
            let _re = JSON.parse(response.details);
            if (_re.message === "Done") setAlertContent({
                title: 'Transaction Rejected',
                description: _re.details,
                type: 'success'
            })
            else setAlertContent({
                title: 'Error Rejecting Transaction',
                description: _re.details,
                type: 'error'
            })
        }
    }

    const handlePromptResponse = (response: string) => {
        setIsLoadingReturn(true)
        if (response === 'Yes') {
            handleReturn();
        }

        setIsLoadingReturn(false)
        setPromptContent({})

    }

    useEffect(() => {
        (async () => {
            if (transaction.length) {
                transaction[0].assetIds.map(async (asset: any, index: number) => {

                    let data = await globalApi("/asset", HttpMethod.POST, {
                        assetUuid: asset.assetId
                    })

                    let transact = { ...transaction[0] };

                    let cleaned = validateAndReturn(data)

                    console.log({ cleaned })

                    if (typeof cleaned === "object") {
                        console.log({ transact })
                        transact.assetIds[index].assetName = cleaned[0].asset_name
                        transact.assetIds[index].tags = typeof transact.assetIds[index].tags === "string" ? JSON.parse(transact.assetIds[index].tags) : transact.assetIds[index].tags
                        setTransaction(transact);
                    }


                })
                console.log(transaction)
            }
            const response = await globalApi("/account", HttpMethod.GET);
            if (response.message === "Done") {
                let _transact = transaction[0];
                let _id = response.details._id;
                if (_id === _transact.newOwnerOrgId) setIsReceiver('TRUE');
                else setIsReceiver('FALSE');
            }
        })();


    }, []);

    return (
        <div>
            {
                promptContent && Object.keys(promptContent).length
                    ? <PromptIndex question={promptContent.question as string} description={promptContent.description as string} buttons={promptContent.buttons as string[]} onClose={() => setPromptContent({})}
                        handleClick={handlePromptResponse} />
                    : null
            }
            {
                Object.keys(alertContent).length
                    ? <AlertIndex title={alertContent.title as string} type={alertContent.type as string} content={alertContent.description as string} handleClose={() => {
                        setAlertContent({});
                    }} />
                    : null
            }
            <p className="text-sm mb-2 font-light"><b>{_transaction && _transaction.isOwnershipChanged ? 'Transferred to: ' : 'Transferring to:'} </b>{transaction.length ? transaction[0].newOwnerMSP.replace("MSP", '') : null}</p>
            <table className="w-full border border-slate-100 text-left mb-4">
                <thead className="bg-slate-100 text-sm text-slate-600">
                    <tr>
                        <th className="p-2">Asset Name</th>
                        <th>Metadata</th>
                    </tr>
                </thead>
                <tbody className="text-sm font-thin text-left">
                    {
                        _transaction
                            ?
                            _transaction.assetIds.map((asset: any) => {
                                console.log(asset)
                                return <tr key={asset.assetId} className="hover:bg-slate-50 border-b-slate-100 text-left">
                                    <td className="p-2">{asset.assetName}</td>
                                    <td className="text-xs">
                                        {
                                            typeof asset.tags === "string"
                                                ? JSON.parse(asset.tags).map((tag: any, index: number) => {
                                                    return <p key={`${tag.key}-${index}`}><b>{tag.key}: </b>{tag.value}</p>
                                                }) : asset.tags.map((tag: any, index: number) => {
                                                    return <p key={`${tag.key}-${index}`}><b>{tag.key}: </b>{tag.value}</p>
                                                })
                                        }
                                    </td>
                                </tr>
                            })
                            : null
                    }
                </tbody>
            </table>
            {
                isReceiver === 'FALSE' ? _transaction ? (_transaction.isRejected || _transaction.isReturned) ? !_transaction.isGotBack
                    ? <button className="bg-green-400 w-full rounded p-1 text-center text-sm" onClick={() => handleGetAssets(_transaction.id)}>
                        {
                            isLoadingGetBack
                                ?
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" size="sm" />
                                : 'Get My Assets'
                        }
                    </button>
                    : null : null : null : null
            }


            {
                _transaction ? (!_transaction.isOwnershipChanged ? isReceiver === 'TRUE' ? _transaction ? _transaction.isNewOwnerAccepted && _transaction.isCurrentOwnerApproved
                    ? <button className="bg-green-400 w-full rounded p-1 text-center text-sm" onClick={() => handleOwnAsset(_transaction.id)}>

                        {
                            isLoadingOwn
                                ?
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" size="sm" />
                                : 'Own Asset'
                        }

                    </button>
                    : null : null : null : null) : null
            }
            {
                isReceiver === 'FALSE' ? _transaction ? _transaction.isNewOwnerAccepted && !_transaction.isCurrentOwnerApproved
                    ? <button className="bg-green-400 w-full rounded p-1 text-center text-sm" onClick={() => handleTransferAsset(_transaction.id)}>
                        {
                            isLoadingTransfer
                                ?
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" size="sm" />
                                : 'Transfer Now'
                        }
                    </button>
                    : null : null : null
            }
            {
                _transaction ? (!_transaction.isRejected ? !_transaction.isCancelled ? isReceiver === 'TRUE' ? _transaction ? !_transaction.isNewOwnerAccepted
                    ? <>
                        <button className="bg-green-400 w-full rounded p-1 text-center text-sm mb-2" onClick={() => handleAcceptAsset(_transaction.id)}>{
                            isLoadingAccept
                                ?
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" size="sm" />
                                : 'Accept'
                        }</button>
                        <button className="border w-full rounded p-1 text-center text-sm" onClick={() => handleReject(_transaction.id)}>
                            {
                                isLoadingReject
                                    ?
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" size="sm" />
                                    : 'Reject'
                            }
                        </button>
                    </>
                    : null : null : null : null : null) : null
            }

            {
                isReceiver === 'TRUE' ? _transaction ? !_transaction.isReturned && !_transaction.isRejected && _transaction.isOwnershipChanged
                    ? <button className="bg-green-400 w-full rounded p-1 text-center text-sm mb-2" onClick={() => setPromptContent({
                        question: 'Are you sure to return?',
                        description: 'This will return back the asset',
                        buttons: ['Yes', 'No'],
                        transactionId: _transaction.id
                    })}>{
                            isLoadingReturn
                                ?
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" size="sm" />
                                : 'Return'
                        }</button>
                    : null : null : null
            }

        </div >
    )

}

const Transfer = () => {
    const [channel, setChannel] = useState("");
    const [transactions, setTransactions] = useState<{}[]>([]);
    const [isCreateNew, setIsCreateNew] = useState(false);
    const [isViewDetails, setIsViewDetails] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState({});
    const [alertContent, setAlertContent] = useState<{ title?: string, content?: string, type?: string }>({})
    const [promptContent, setPromptContent] = useState<{ question?: string, description?: string, buttons?: string[], transactionId?: string, type?: string }>({})
    const navigate = useNavigate();
    const channels = useChannel();
    const [emailVerified, reloadVar, reloader] = useVerified();
    const socket = useSocket(`${host}:${port}`);
    const [isReceiver, setIsReceiver] = useState('PENDING');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const getDateToday = () => {
        var currentDate = new Date();

        var year = currentDate.getFullYear();
        var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        var day = ('0' + currentDate.getDate()).slice(-2);

        var formattedDate = year + '-' + month + '-' + day;

        return formattedDate;
    }

    const handleTransactions = async (from?: string) => {
        if (channel.trim()) {
            const data = await globalApi("/chaincode", HttpMethod.POST, {
                action: Action.TRANSACTIONS,
                args: {
                    channelId: channel,
                    startDate: getDateToday(),
                    endDate: getDateToday()
                }
            })
            console.log(validateAndReturn(data))

            let _transact = validateAndReturn(data);

            setTransactions(_transact);
        }
    }

    const toggleCreateNewModal = (_alert: { title?: string, content?: string, type?: string } = {}) => {
        if (Object.keys(_alert).length) {
            setAlertContent(_alert);
        }

        setIsCreateNew(!isCreateNew);
        handleTransactions()
    }

    const handleToggleModalDetails = () => {
        setIsViewDetails(!isViewDetails);
        handleTransactions()
    }

    const toggleViewDtailsModal = (transactionId: string) => {
        handleTransactions();
        let filteredTransaction = transactions.filter((transaction: any) => transaction.id === transactionId);
        setSelectedTransaction(filteredTransaction);
        handleToggleModalDetails();
    }

    const handleRedirectConnection = () => {
        navigate("/connections")
    }

    const handleCancel = async () => {
        const data = await globalApi("/chaincode", HttpMethod.POST, {
            action: Action.CANCEL,
            args: {
                channelId: channel,
                transactionId: promptContent.transactionId
            }
        })
        let response = validateAndReturn(data);

        if (response.message === "Done") {
            let _re = JSON.parse(response.details);
            if (_re.message === "Done") setAlertContent({
                title: 'Transaction Cancelled',
                content: _re.details,
                type: 'success'
            })
            else setAlertContent({
                title: 'Error Cancelling Transaction',
                content: _re.details,
                type: 'error'
            })
        }
    }



    const handlePromptResponse = (response: string) => {
        if (response === 'Yes') {
            if (promptContent.type === 'CANCEL') handleCancel();
        }
        setPromptContent({});
    }

    useEffect(() => {
        console.log(startDate, endDate)
        if (startDate && endDate) {
            if (startDate > endDate) {
                setAlertContent({
                    title: 'Invalid time range',
                    content: 'Please fix the start date and end date',
                    type: "error"
                })
            } else {
                if (channel.trim()) {
                    (async () => {
                        const data = await globalApi("/chaincode", HttpMethod.POST, {
                            action: Action.TRANSACTIONS,
                            args: {
                                channelId: channel,
                                startDate,
                                endDate
                            }
                        })
                        console.log(validateAndReturn(data))

                        let _transact = validateAndReturn(data);

                        setTransactions(_transact);
                    })()
                }
            }
        }

    }, [startDate, endDate, channel]);

    useEffect(() => {
        setStartDate(getDateToday())
        setEndDate(getDateToday())
    }, []);

    useEffect(() => {
        handleTransactions()
        if (socket) {
            socket.on("notif", data => {
                console.log({ channel })
                console.log(data)
                handleTransactions("notif")
                if (data.action === 'refetch') {
                }
            })
        }
    }, [socket, channel]);

    return <>
        {
            promptContent && Object.keys(promptContent).length
                ? <PromptIndex question={promptContent.question as string} description={promptContent.description as string} buttons={promptContent.buttons as string[]} onClose={() => setPromptContent({})}
                    handleClick={handlePromptResponse} />
                : null
        }
        {
            emailVerified === 'NOT VERIFIED'
                ? <div className="bg-red-500 text-center py-2">
                    <small className="text-white">Looks like your email is not verified yet. Go to your <a href="#"
                        onClick={() => {
                            navigate("/account");
                        }}
                        className="underline"
                    >account</a> to verify</small>
                </div>
                : null
        }
        <div className="grid grid-cols-5 h-full">
            <Navbar />
            <div className="col-span-5 sm:col-span-4 md:col-span-4">
                {
                    alertContent && Object.keys(alertContent).length
                        ? <AlertIndex type={alertContent.type as string} title={alertContent.title as string} content={alertContent.content as string} handleClose={() => setAlertContent({})} />
                        : null
                }
                <Headerbar />
                <div className="px-10 lg:px-24 md:px-20 sm:px-10 xl:px-24 py-20">

                    {
                        channels.length && channels[0].trim()
                            ? <>
                                <h1 className="text-2xl mb-5">Transactions</h1>

                                <div className="grid grid-cols-1 sm:grid-cols-4 items-center">
                                    <div className="col-span-4 md:col-span-1">
                                        <label className="text-sm mb-2 block">Channels</label>
                                        <ChannelIndex handleValue={setChannel} />
                                    </div>
                                    <div className="mb-5 md:mb-0 col-span-4 md:col-start-3 md:col-span-3 md:flex justify-end items-end gap-x-3">
                                        <div className="mb-3 md:mb-0">
                                            <label className="block text-sm">Start date</label>
                                            <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" className="p-1 px-2 outline-none border mr-2 text-sm font-light bg-white w-full" />
                                        </div>
                                        <div className="mb-3 md:mb-0">
                                            <label className="block text-sm">End date</label>
                                            <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" className="p-1 px-2 outline-none border mr-2 text-sm font-light bg-white w-full" />
                                        </div>
                                        <button className="border py-2 px-4 rounded" onClick={() => toggleCreateNewModal()}>
                                            <FontAwesomeIcon icon={faPlus} size="sm" />
                                        </button>
                                    </div>
                                </div>
                                {
                                    isViewDetails
                                        ?
                                        <Modal children={<TransactionDetails transaction={selectedTransaction} channelId={channel} toggleModal={handleToggleModalDetails} />} title="Details" toggleModal={toggleViewDtailsModal} />
                                        : null
                                }
                                {
                                    isCreateNew
                                        ?
                                        <Modal children={<TransferForm channelId={channel} toggleModal={toggleCreateNewModal} />} title="Transfer Assets" toggleModal={toggleCreateNewModal} />
                                        : null
                                }
                                <label className="text-sm mb-2 block">Available transactions</label>
                                <div className="overflow-x-auto">

                                    <table className="w-full whitespace-nowrap border border-slate-100 text-left">
                                        <thead className="bg-slate-100 text-sm text-slate-600">
                                            <tr>
                                                <th className="p-2">Date Created</th>
                                                <th className="p-2">Transaction ID</th>
                                                <th>Status</th>
                                                <th className="px-4">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-thin text-left">
                                            {
                                                !transactions.length
                                                    ? <tr className="hover:bg-slate-50 border-b border-b-slate-100">
                                                        <td className="p-2 text-center" colSpan={5}>No Transfers</td>
                                                    </tr> : null
                                            }
                                            {
                                                transactions.map((transaction: any) => {
                                                    return (
                                                        <tr key={transaction.id} className="hover:bg-slate-50 border-b-slate-100 text-left">
                                                            <td className="py-2 px-2 pr-4 text-left">{new Date(transaction.created * 1000).toLocaleString()}</td>
                                                            <td className="py-2 px-2 pr-4 text-left">{transaction.id}</td>
                                                            <td>
                                                                <span className={`${!transaction.isRejected ? !transaction.isReturned ? !transaction.isCancelled ? !transaction.isOwnershipChanged ? transaction.isNewOwnerAccepted ? 'bg-gray-200' : 'bg-orange-200' : 'bg-green-400 text-white font-bold' : 'bg-red-400 text-white font-bold' : 'bg-red-400 font-bold text-white' : 'bg-red-400 font-bold text-white'} p-1 rounded`}>
                                                                    {
                                                                        !transaction.isReturned ? !transaction.isOwnershipChanged ? transaction.isNewOwnerAccepted && transaction.isCurrentOwnerApproved ? "For own" : null : "Done" : 'Returned'
                                                                    }
                                                                    {
                                                                        !transaction.isRejected ? !transaction.isCancelled ? !transaction.isNewOwnerAccepted && !transaction.isCurrentOwnerApproved ? "For Acceptance" : null : 'Cancelled' : 'Rejected'
                                                                    }
                                                                    {
                                                                        transaction.isNewOwnerAccepted && !transaction.isCurrentOwnerApproved ? "For owner approval" : null
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-4">
                                                                <a href="#" className="underline hover:no-underline" onClick={() => toggleViewDtailsModal(transaction.id)}>View details</a>
                                                                {
                                                                    !transaction.isRejected ? !transaction.isCancelled && !transaction.isOwnershipChanged
                                                                        ? <a href="#" className="underline hover:no-underline ml-2" onClick={() => {
                                                                            setPromptContent({
                                                                                question: 'Are you sure to cancel this transaction?',
                                                                                description: "This will prevent you from sending the assets",
                                                                                buttons: ['Yes', 'No'],
                                                                                transactionId: transaction.id,
                                                                                type: 'CANCEL'
                                                                            })
                                                                        }}>Cancel</a>
                                                                        : null : null
                                                                }

                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>

                                </div>

                            </>
                            :
                            <div className="text-center grid ">
                                <h1>You don't have any connections to other organizations.</h1>
                                <small className="font-light block mb-3">Please connect to atleast 1 organization to show this page.</small>
                                <button className="border rounded text-xs p-2 px-4 justify-self-center hover:bg-slate-100" onClick={handleRedirectConnection}>Create connection</button>
                            </div>
                    }



                </div>
            </div>
        </div>
    </>

}

export default () => <AuthIndex Component={Transfer} />