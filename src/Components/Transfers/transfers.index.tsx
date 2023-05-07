import { useEffect, useRef, useState } from "react"
import AuthIndex from "../Auth/auth.index"
import ChannelIndex from "../Channel/channel.index"
import Headerbar from "../HeaderBar/headerbar.index"
import Navbar from "../Navbar/navbar.index"
import { Action, validateAndReturn } from "../../utilities"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { Modal } from "../Modalv2/modal.index"
import { HttpMethod, api as globalApi } from "../../services/http";
import { useNavigate } from "react-router-dom"
import useChannel from "../../hooks/useChannel"


const TransferForm = ({ channelId, toggleModal }: { channelId: string, toggleModal: () => void }) => {

    const [assets, setAssets] = useState([]);
    const [queueAssets, setQueueAssets] = useState<string[]>([]);
    const tbodyRowRef = useRef(null);
    const allCheckboxRef = useRef(null);
    const [specificAsset, setSpecificAsset] = useState<any>(null);

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
                return _pState
            })
        } else {
            setQueueAssets(prevState => {
                return [...prevState, value];
            })
        }

        if (queueAssets.length === assets.length) (allCheckboxRef.current as any).checked = true;
        else (allCheckboxRef.current as any).checked = false;
    }

    const handleTransfer = async () => {
        if (queueAssets.length) {
            let data = await globalApi("/chaincode", HttpMethod.POST, {
                action: Action.TRANSFER,
                args: {
                    assetIds: queueAssets,
                    channelId,
                    newOwnerMSP: "empinomanufacturerMSP"
                }
            })
            const response = validateAndReturn(data);
            if (response.includes("created")) toggleModal();

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
            let assetTags = JSON.parse(cleaned.tags);
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
                <div className="border rounded mb-3 text-xs p-2">
                    <p><b>Name: </b>{specificAsset.asset_name}</p>
                    {
                        specificAsset.tags.map((tag: any) => <p><b>{tag.key}: </b>{tag.value}</p>)
                    }
                </div>
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
    const [isLoadingTransfer, setIsLoadingTransfer] = useState(false);
    const [isLoadingOwn, setIsLoadingOwn] = useState(false);


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

        let response = JSON.parse(cleaned);

        if (response.message === "Done") toggleModal();

        setIsLoadingAccept(false)


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

        let response = JSON.parse(cleaned);

        console.log({ response })

        if (response.message === "Done") toggleModal();

        setIsLoadingTransfer(false)
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

        let response = JSON.parse(cleaned);

        console.log({ response })

        if (response.message === "Done") toggleModal()
        setIsLoadingOwn(false)
    }

    useEffect(() => {
        (() => {
            if (transaction.length) {
                transaction[0].assetIds.map(async (asset: any, index: number) => {

                    let data = await globalApi("/asset", HttpMethod.POST, {
                        assetUuid: asset.assetId
                    })

                    let transact = { ...transaction[0] };

                    let cleaned = validateAndReturn(data)

                    if (typeof cleaned === "object") {
                        transact.assetIds[index].assetName = cleaned[0].asset_name

                        setTransaction(transact);
                    }


                })
            }
        })();
    }, []);

    return (
        <div>
            <p className="text-sm mb-2 font-light"><b>Transferring to: </b>{transaction.length ? transaction[0].newOwnerMSP : null}</p>
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
                                return <tr key={asset.assetId} className="hover:bg-slate-50 border-b-slate-100 text-left">
                                    <td className="p-2">{asset.assetName}</td>
                                    <td className="text-xs">
                                        {
                                            JSON.parse(asset.tags).map((tag: any, index: number) => {
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
                _transaction ? _transaction.isNewOwnerAccepted && _transaction.isCurrentOwnerApproved
                    ? <button className="bg-green-400 w-full rounded p-1 text-center text-sm" onClick={() => handleOwnAsset(_transaction.id)}>

                        {
                            isLoadingOwn
                                ?
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" size="sm" />
                                : 'Own Asset'
                        }

                    </button>
                    : null : null
            }
            {
                _transaction ? _transaction.isNewOwnerAccepted && !_transaction.isCurrentOwnerApproved
                    ? <button className="bg-green-400 w-full rounded p-1 text-center text-sm" onClick={() => handleTransferAsset(_transaction.id)}>
                        {
                            isLoadingTransfer
                                ?
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" size="sm" />
                                : 'Transfer Now'
                        }
                    </button>
                    : null : null
            }
            {
                _transaction ? !_transaction.isNewOwnerAccepted
                    ? <>
                        <button className="bg-green-400 w-full rounded p-1 text-center text-sm mb-2" onClick={() => handleAcceptAsset(_transaction.id)}>{
                            isLoadingAccept
                                ?
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" size="sm" />
                                : 'Accept'
                        }</button>
                        <button className="border w-full rounded p-1 text-center text-sm">Reject</button>
                    </>
                    : null : null
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
    const navigate = useNavigate();
    const channels = useChannel();

    const handleTransactions = () => {
        if (channel.trim()) {
            (async () => {
                const data = await globalApi("/chaincode", HttpMethod.POST, {
                    action: Action.TRANSACTIONS,
                    args: {
                        channelId: channel
                    }
                })
                console.log(data);
                setTransactions(validateAndReturn(data))
            })();
        }
    }

    const toggleCreateNewModal = () => {
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

    useEffect(() => {
        handleTransactions()
    }, [channel]);

    return <div className="grid grid-cols-5 h-full">
        <Navbar />
        <div className="col-span-5 sm:col-span-5 md:col-span-4">
            <Headerbar />
            <div className="px-10 lg:px-24 md:px-20 sm:px-10 xl:px-24 py-20">
                {
                    channels.length
                        ? <>
                            <h1 className="text-2xl mb-5">Transfers</h1>

                            <div className="grid grid-cols-4 items-center">
                                <div className="col-span-2">
                                    <label className="text-sm mb-2 block">Channels</label>
                                    <ChannelIndex handleValue={setChannel} />
                                </div>
                                <div className="col-start-4 flex justify-end">
                                    <button className="border py-2 px-4 rounded" onClick={toggleCreateNewModal}>
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
                            <label className="text-sm mb-2 block">Transfers</label>
                            <table className="w-full border border-slate-100 text-left">
                                <thead className="bg-slate-100 text-sm text-slate-600">
                                    <tr>
                                        <th className="p-2">Transaction ID</th>
                                        <th>Status</th>
                                        <th>Action</th>
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
                                                    <td className="py-2 px-2 pr-4 text-left">{transaction.id}</td>
                                                    <td>
                                                        <span className={`${transaction.isNewOwnerAccepted ? 'bg-gray-200' : 'bg-orange-200'} p-1 rounded`}>
                                                            {
                                                                transaction.isNewOwnerAccepted && transaction.isCurrentOwnerApproved ? "For own" : null
                                                            }
                                                            {
                                                                !transaction.isNewOwnerAccepted && !transaction.isCurrentOwnerApproved ? "For Acceptance" : null
                                                            }
                                                            {
                                                                transaction.isNewOwnerAccepted && !transaction.isCurrentOwnerApproved ? "For owner approval" : null
                                                            }
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <a href="#" className="underline hover:no-underline" onClick={() => toggleViewDtailsModal(transaction.id)}>View details</a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
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

}

export default () => <AuthIndex Component={Transfer} />