import {useContext, useState} from 'react';
import {Ctx} from "../context/context.tsx";
import Sidebar from "../components/admin/sidebar";
import AdminDashboardUsers from "../components/admin/adminDashboardUsers";
import AdminAccountSettings from "../components/admin/adminAccountSettings";


interface SidebarItem {
    id: number
    label: string
    role: 'admin' | 'user'
}
const sidebarItems: SidebarItem[] = [
    {id: 1, label: 'Utilizatori', role: 'admin'},
    {id:2, label: 'Programări', role: 'user'},
    {id:3, label: 'Pacienți', role: 'user'},
    {id:4, label: 'Contul tău', role: 'user'}
];

const Dashboard = () => {
    const [selectedView, setSelectedView] = useState(sidebarItems[0]);

    const context = useContext(Ctx);
    console.log(context);
    const user = context ? context.state.user : null;


    const handleSelectView = (selected: SidebarItem) => {
        setSelectedView(selected);
    }

    const getItemsByRole = () => {
        if(user?.role === 'user'){
            return sidebarItems.filter((item) => item.role === 'user');
        }
        return sidebarItems;
    }

    return (
        <div>
            <div aria-roledescription="main" style={{minHeight: '70vh'}}>
                <h1 className="text-center text-secondary my-3">Dashboard</h1>
                <div className="d-flex justify-content-start align-items-start gap-2 flex-lg-row flex-column px-2">
                    <Sidebar
                        className="mt-1"
                        items={getItemsByRole()}
                        onClick={handleSelectView}
                        selectedItem={selectedView}/>
                    {(selectedView.id === 1 && user && user.role === 'admin') && <AdminDashboardUsers />}
                    {(selectedView.id === 4 && user) && <AdminAccountSettings user={user}/>}
                </div>
            </div>
        </div>
    )
}

export default Dashboard;