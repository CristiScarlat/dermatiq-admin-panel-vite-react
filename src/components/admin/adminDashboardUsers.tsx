import {useEffect, useState, useRef, useContext} from "react";
//import {useNavigate} from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineLockReset } from "react-icons/md";
import Spinner from "../Spinner.tsx";
import SimpleModal from "../SimpleModal.tsx";
import { Form } from "react-bootstrap";
import {Ctx} from "../../context/context.tsx";


interface IFormUser {
    id?: number
    username?: string
    email?: string
    password?: string
    fullName?: string
    phone?: string
    role?: "on" | "off" | "user" | "admin"
}

const AdminDashboardUsers = () => {
    const [users, setUsers] = useState<IFormUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const context = useContext(Ctx);
    //const navigate = useNavigate();

    const modalAddUserFormRef = useRef<HTMLFormElement | null>(null);

    async function fetchUsers() {
        try{
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                headers: {
                    Accept: 'application/json',
                },
                credentials: "include",
            });
            if(res.status === 401){
                console.log("login error");
                return
            }
            const data = await res.json();
            setUsers(data.users);
            setLoading(false);
        }
        catch(error){
            console.log(error)
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    const handleOpenModal = () => {
        setModalOpen(true);
    }

    const saveUser = async (user: IFormUser) => {
        try{
            setLoading(true);
            await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({user: user})
            });
            await fetchUsers()
            setLoading(false);
        }
        catch(error){
            console.log(error)
            setLoading(false);
        }
    }

    const deleteUser = async (id: number) => {
        try{
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                method: "DELETE",
                headers: {
                    Accept: 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({userId: id})
            });
            const data = await res.json();
            console.log(data);
            setLoading(false);
        }
        catch(error){
            console.log(error)
            setLoading(false);
        }
    }

    const handleSaveUser = () => {
        const formData = new FormData(modalAddUserFormRef.current as HTMLFormElement);
        const userData: IFormUser = {};
        let invalid = false;
        for (const pair of formData.entries()) {
            if(!pair[1])invalid = true;
            // @ts-expect-error too complex to implement
            userData[pair[0]] = pair[1];
        }
        if(invalid && context){
            context.dispatch({
                payload: {
                    toast: {
                        showToast: true,
                        type: "Error",
                        headerText: "Error.",
                        bodyText: `Please fill out all the fields in the form.`,
                    }
                },
                type: "SET_TOAST",

            });
            return
        }
        setModalOpen(false);
        if(!userData?.role)userData.role = "user";
        else if(userData?.role === "on")userData.role = "admin";
        console.log(userData);
        saveUser(userData);
    }

    const handleDeleteUser = (selectedUser: IFormUser) => {
        if(confirm(`Sunteți sigur că doriți să stergeți ${selectedUser.fullName} din baza de date?`) && selectedUser?.id){
            deleteUser(selectedUser.id)
                .then(() => {
                    const newUsers = users.filter(user => user.id !== selectedUser.id);
                    setUsers(newUsers);
                })
                .catch(err => {console.log(err)})
        }
    }

    const handleResetPassword = async (row: IFormUser) => {
        const newTemporaryPassword = prompt(`Tastați o parolă temporară pentru utilizatorul ${row.fullName}.`);
        if(newTemporaryPassword && newTemporaryPassword !== ""){
            try{
                await fetch(`${import.meta.env.VITE_API_URL}/api/users/${row.id}`, {
                    method: "PATCH",
                    headers: {
                        Accept: 'application/json',
                    },
                    credentials: "include",
                    body: JSON.stringify({password: newTemporaryPassword}),
                })
                alert(`Parola a fost resetata cu succes, parola temporara este ${newTemporaryPassword}.`)
            }
            catch(err) {
                console.log(err)
            }
        }
    }

    return (
        <>
        <div className="w-100">
            <div className="d-flex justify-content-end align-items-center border border-white rounded p-3">
                <button className="rounded-circle bg-primary text-white border-0 fw-bold"
                        style={{width: 30, height: 30}}
                        onClick={handleOpenModal}
                        title="adaugă un utilizator">
                    +
                </button>
            </div>
            <div className="overflow-auto border border-white rounded">
                {loading ? <Spinner/> : <Table striped bordered hover className="dashboard-table">
                    <thead>
                    <tr>
                        <th></th>
                        {users?.length > 0 && Object.keys(users[0]).filter(key => key !== "id").map(col => <th key={col}>{col}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                        {users?.length > 0 && users.map((row: IFormUser) => (
                            <tr key={row.id}>
                                <td className="d-flex align-items-center justify-content-between">
                                    <button className="border-0 bg-transparent"
                                            onClick={() => handleResetPassword(row)}>
                                        <MdOutlineLockReset color="darkgreen" size="1.5rem"/>
                                    </button>
                                    <button className="border-0 bg-transparent"
                                            onClick={() => handleDeleteUser(row)}>
                                        <FaTrashAlt color="darkred"/>
                                    </button>
                                </td>
                                {/*
                                   // @ts-expect-error too complex to fix */}
                                {Object.keys(row).filter(key => key !== "id").map((cel: string) => <td key={cel}>{row[cel]}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </Table>}
            </div>
        </div>
        <SimpleModal
            show={modalOpen}
            onHide={() => setModalOpen(false)}
            onYesClick={handleSaveUser}
            title="Adaugă un utilizator nou"
            yesBtnLabel="Salvează"
            cancelBtnLabel="Închide">
            <Form ref={modalAddUserFormRef}>
                <Form.Group className="mb-3">
                    <Form.Label>Nume Utilizator</Form.Label>
                    <Form.Control placeholder="Nume utilizator" name="username"/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Adresa Email</Form.Label>
                    <Form.Control type="email" placeholder="Adresa email" name="email"/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Parolă temporară</Form.Label>
                    <Form.Control type="password" placeholder="Parolă temporară" name="password"/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Nume și Prenume</Form.Label>
                    <Form.Control placeholder="Nume și Prenume" name="fullName"/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Telefon</Form.Label>
                    <Form.Control placeholder="Telefon" name="phone"/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Funcție</Form.Label>
                    <Form.Control placeholder="Funcție" disabled/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check type="checkbox" label="Are drepturi de administrator?" name="role"/>
                </Form.Group>
            </Form>
        </SimpleModal>
        </>
    )
}


export default AdminDashboardUsers;