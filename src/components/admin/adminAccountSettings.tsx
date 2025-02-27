import { useEffect, useState } from "react";
import {Button, Form} from "react-bootstrap";
import {IUser} from "../../context/context.tsx";


interface IUserDetails {
    email: string,
    username: string,
    fullname: string,
    phone: string,
    role: 'admin' | 'user',
    companyRole?: 'medic' | 'assistant'
    id: number
}

interface IFormDataPsw {
    oldPassword?: string,
    newPassword: string
}

const AdminAccountSettings = ({user}: {user: IUser}) => {

    const [userData, setUserData] = useState<IUserDetails | null>(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.uid}`, {
            headers: {
                Accept: 'application/json',
            },
            credentials: "include",
        })
        .then(res => {
            res.json()
                .then((data: IUserDetails) => setUserData(data))
                .catch((err: Error) => console.log(err));
        })
            .catch((err: Error) => console.log(err));
    }, [user])

    const handleSubmitChangeUserData = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const dataToUpdate: IUserDetails = {
            email: "",
            fullname: "",
            id: 0,
            phone: "",
            role: "user",
            username: "", ...userData
        };
        const formData = new FormData(e.currentTarget);
        for (const pair of formData.entries()) {
            //@ts-expect-error too complicated to fix this
            dataToUpdate[pair[0]] = pair[1];
        }
        try{
            fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.uid}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    Accept: 'application/json',
                },
                body: JSON.stringify(dataToUpdate),
            })
        }
        catch(err) {
            console.log(err)
        }
    }

    const handleSubmitChangePsw = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const dataToUpdate: IFormDataPsw = {
            oldPassword: "",
            newPassword: ""
        };
        const formData = new FormData(e.currentTarget);
        for (const pair of formData.entries()) {
            //@ts-expect-error too complicated to fix this
            dataToUpdate[pair[0]] = pair[1];
        }

        if(dataToUpdate.oldPassword === dataToUpdate.newPassword){
            alert("Parola nouă trebuie să fie diferită de parola veche.");
            return;
        }
        if(dataToUpdate.oldPassword)delete dataToUpdate.oldPassword;
        try{
            fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.uid}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    Accept: 'application/json',
                },
                body: JSON.stringify({password: dataToUpdate.newPassword}),
            })
        }
        catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            <h1>Contul tău</h1>
            <hr/>
            <h4>Datele tale</h4>
            <Form onSubmit={handleSubmitChangeUserData}>
                <Form.Group className="mb-3">
                    <Form.Label>Nume Utilizator</Form.Label>
                    <Form.Control defaultValue={userData ? userData.username : ''} name="username"/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Adresa Email</Form.Label>
                    <Form.Control type="email" defaultValue={userData ? userData.email : ''} name="email"/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Nume și Prenume</Form.Label>
                    <Form.Control defaultValue={userData ? userData.fullname : ''} name="fullname"/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Telefon</Form.Label>
                    <Form.Control defaultValue={userData ? userData.phone : ''} name="phone"/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Funcție</Form.Label>
                    <Form.Control defaultValue={userData ? userData.companyRole : ''} disabled/>
                </Form.Group>
                <Button variant="primary" type="submit">Salvează</Button>
            </Form>
            <hr/>
            <h4>Schimbă parola</h4>
            <Form onSubmit={handleSubmitChangePsw}>
                <Form.Group className="mb-3">
                    <Form.Label>Parola veche</Form.Label>
                    <Form.Control type="password" placeholder="Parola veche" name="oldPassword"/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Parola nouă</Form.Label>
                    <Form.Control type="password" placeholder="Parola nouă" name="newPassword"/>
                </Form.Group>
                <Button variant="primary" type="submit">Salvează</Button>
            </Form>
        </div>
    )
}

export default AdminAccountSettings;