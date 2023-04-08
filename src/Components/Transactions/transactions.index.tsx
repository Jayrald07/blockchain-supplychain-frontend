import AuthIndex from "../Auth/auth.index"
import Headerbar from "../HeaderBar/headerbar.index"
import Navbar from "../Navbar/navbar.index"

const Transaction = () => {

    return <div className="grid grid-cols-5 h-full">
        <Navbar />
        <div className="col-span-4">
            <Headerbar />
            <div className="px-32 py-20">

            </div>
        </div>
    </div>

}

export default () => <AuthIndex Component={Transaction} />